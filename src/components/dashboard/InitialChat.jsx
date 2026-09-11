import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'

function InitialChat({ prompt, onPromptChange, onSubmit, isSending = false, error = '' }) {
  return (
    <div className="conversation conversation-empty">
      <h1>How can I help you today?</h1>
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

export default InitialChat
