import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

function QuizFeedback({ question, result }) {
  if (result.status === 'correct') {
    return (
      <div className="quiz-feedback quiz-feedback-correct" role="status">
        <span className="quiz-feedback-icon"><CheckRoundedIcon /></span>
        <div>
          <strong>Correct!</strong>
          <p>Your answer: {result.submitted}</p>
          <span className="quiz-attempt">Attempt {result.attempts} of 3</span>
        </div>
      </div>
    )
  }

  if (result.status !== 'incorrect') return null
  const finished = result.attempts >= 3

  return (
    <div className={`quiz-feedback quiz-feedback-incorrect${finished ? ' quiz-feedback-final' : ''}`} role="status">
      <span className="quiz-feedback-icon"><CloseRoundedIcon /></span>
      <div>
        <strong>Incorrect!</strong>
        <h3>{finished ? 'Explanation' : 'Hint'}</h3>
        <p>{finished ? result.explanation : (result.hint || 'Try again.')}</p>
        {finished && <p className="quiz-correct-answer"><b>Answer:</b> {result.modelAnswer || question.model_answer}</p>}
        <span className="quiz-attempt">Attempt {result.attempts} of 3</span>
      </div>
    </div>
  )
}

export default QuizFeedback
