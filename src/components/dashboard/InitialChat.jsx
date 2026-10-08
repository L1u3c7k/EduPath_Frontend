import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import QuizReadyButton from './quiz/QuizReadyButton'

function InitialChat({ prompt, onPromptChange, onSubmit, isSending = false, error = '', quizReady = false, onOpenQuiz, isGeneratingQuiz = false, quizGenerationError = '' }) {
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
        {quizReady && (
          <QuizReadyButton
            onClick={onOpenQuiz}
            isLoading={isGeneratingQuiz}
          />
        )}
        
        <button className="button" type="submit" aria-label="Send message" disabled={isSending || !prompt.trim()}>
          <ArrowUpwardRoundedIcon />
        </button>
      </form>
      {quizGenerationError && <p className="chat-status-error" role="alert">{quizGenerationError}</p>}
    </div>
  )
}

export default InitialChat
