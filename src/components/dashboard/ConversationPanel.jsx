import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import AssistantChat from './AssistantChat'
import UserChat from './UserChat'

function ConversationPanel({ messages, prompt, onPromptChange, onSubmit }) {
  return (
    <div className={`conversation ${messages.length ? '' : 'conversation-empty'}`}>
      {!messages.length && <h1>How can I help you today?</h1>}
      <div className="message-list" aria-live="polite">
        {messages.map((message, index) => {
          const ChatMessage = message.role === 'assistant' ? AssistantChat : UserChat

          return <ChatMessage key={`${message.role}-${index}`} text={message.text} />
        })}
      </div>
      <form className="prompt-form" onSubmit={onSubmit}>
        <input value={prompt} onChange={onPromptChange} placeholder="Ask anything..." aria-label="Ask Mentora anything" />
        <button type="submit" aria-label="Send message" disabled={!prompt.trim()}>
          <ArrowUpwardRoundedIcon />
        </button>
      </form>
    </div>
  )
}

export default ConversationPanel
