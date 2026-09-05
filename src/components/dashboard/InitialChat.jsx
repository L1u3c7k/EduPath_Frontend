import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'

function InitialChat({ prompt, onPromptChange, onSubmit }) {
  return (
    <div className="conversation conversation-empty">
      <h1>How can I help you today?</h1>
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

export default InitialChat
