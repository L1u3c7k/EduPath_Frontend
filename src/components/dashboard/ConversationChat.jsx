import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import AssistantChat from './AssistantChat'
import InitialChat from './InitialChat'
import UserChat from './UserChat'
import { updateMessageApi } from '../../api/chatApi'

function ConversationChat({
  messages = [],
  setMessages,
  prompt = '',
  onPromptChange,
  onSubmit,
  isSending = false,
  isLoading = false,
  error = '',
  refetchHistory,
}) {
  const listRef = useRef(null)
  const { chatId: activeChatId } = useParams()

  const messageList = Array.isArray(messages) ? messages : []
  const hasMessages = messageList.length > 0

  const handleUpdateUserMessage = async (messageId, newText) => {
    if (typeof messageId === 'string' && messageId.startsWith('temp-')) {
      console.warn('Cannot update message with a temporary ID.')
      return
    }

    try {
      await updateMessageApi(activeChatId, messageId, newText)

      if (typeof refetchHistory === 'function') {
        await refetchHistory()
      }
    } catch (err) {
      console.error('Failed to update message:', "Can Only be Update for the latest message")
      throw err
    }
  }

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [messages, isLoading])

  if (!hasMessages && !isLoading) {
    return (
      <InitialChat
        prompt={prompt}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        isSending={isSending}
        error={error}
      />
    )
  }

  return (
    <div className="conversation">
      <div className="message-list" aria-live="polite" ref={listRef}>
        {isLoading && !hasMessages ? (
          <article className="message message-assistant is-pending">Loading conversation…</article>
        ) : (
          messageList.map((message, index) => {
            if (message.role === 'assistant') {
              return (
                <AssistantChat
                  key={message.id ?? `assistant-${index}`}
                  text={message.text || message.message || message.content || ''}
                  pending={message.pending}
                />
              )
            }

            return (
              <UserChat
                key={message.id ?? `user-${index}`}
                text={message.text || message.message || message.content || ''}
                onUpdate={(newText) => handleUpdateUserMessage(message.id, newText)}
              />
            )
          })
        )}
      </div>
      {error ? <p className="chat-status-error">{error}</p> : null}
      <form className="prompt-form" onSubmit={onSubmit}>
        <input
          value={prompt}
          onChange={onPromptChange}
          placeholder="Ask anything..."
          aria-label="Ask Mentora anything"
          disabled={isSending}
        />
        <button type="submit" aria-label="Send message" disabled={isSending || !prompt.trim()}>
          <ArrowUpwardRoundedIcon />
        </button>
      </form>
    </div>
  )
}

export default ConversationChat