import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import Skeleton from '@mui/material/Skeleton'
import AssistantChat from './AssistantChat'
import InitialChat from './InitialChat'
import UserChat from './UserChat'
import QuizReadyButton from './quiz/QuizReadyButton'
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
  quizReady = false,
  onOpenQuiz,
  isGeneratingQuiz = false,
  quizGenerationError = '',
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
        quizReady={quizReady}
        onOpenQuiz={onOpenQuiz}
        isGeneratingQuiz={isGeneratingQuiz}
        quizGenerationError={quizGenerationError}
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
        {isSending && (
          <div className="assistant-message-wrap" role="status" aria-label="Loading AI response">
            <Skeleton
              sx={{ bgcolor: '#efe7e7ၤF', borderRadius: '0 39px 39px 39px' }}
              variant="rectangular"
              width={"90%"}
              height={118}
            />
          </div>
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

        {quizReady && (
          <QuizReadyButton
            onClick={onOpenQuiz}
            isLoading={isGeneratingQuiz}
          />
        )}
        
        <button className='button' type="submit" aria-label="Send message" disabled={isSending || !prompt.trim()}>
          <ArrowUpwardRoundedIcon />
        </button>
      </form>
      {quizGenerationError && <p className="chat-status-error" role="alert">{quizGenerationError}</p>}
    </div>
  )
}

export default ConversationChat
