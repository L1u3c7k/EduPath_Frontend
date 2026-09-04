import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import AssistantChat from './AssistantChat'
import InitialChat from './InitialChat'
import UserChat from './UserChat'

function ConversationChat({ messages, prompt, onPromptChange, onSubmit }) {
  if (!messages.length) {
    return (
      <InitialChat
        prompt={prompt}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
      />
    )
  }

  return (
    <div className="conversation">
      <div className="message-list" aria-live="polite">
        {messages.map((message, index) => {
          const ChatMessage = message.role === 'assistant' ? AssistantChat : UserChat

          return <ChatMessage key={`${message.role}-${index}`} text={message.text} />
        })}
      </div>
      <form className="prompt-form" onSubmit={onSubmit}>
        <input
          value={prompt}
          onChange={onPromptChange}
          placeholder="Ask anything..."
          aria-label="Ask Mentora anything"
        />
        <button type="submit" aria-label="Send message" disabled={!prompt.trim()}>
          <ArrowUpwardRoundedIcon />
        </button>
      </form>
    </div>
  )
}

export default ConversationChat
