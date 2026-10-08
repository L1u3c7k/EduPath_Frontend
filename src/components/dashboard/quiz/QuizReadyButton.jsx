import './QuizReadyButton.css'

function QuizReadyButton({ onClick, isLoading = false }) {
  return (
    <>
      <button
        className="quiz-ready-button"
        type="button"
        onClick={onClick}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'Generating...' : 'Quiz ready'}
      </button>
    </>
  )
}

export default QuizReadyButton
