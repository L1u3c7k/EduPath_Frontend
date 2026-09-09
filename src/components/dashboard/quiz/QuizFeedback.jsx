import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

function QuizFeedback({ question, result, finished }) {
  if (result.status === 'correct') {
    return (
      <div className="quiz-feedback quiz-feedback-correct" role="status">
        <span className="quiz-feedback-icon"><CheckRoundedIcon /></span>
        <div><strong>Correct!</strong><p>Your answer: {result.submitted}</p></div>
      </div>
    )
  }

  if (result.status !== 'incorrect') return null

  return (
    <div className={`quiz-feedback quiz-feedback-incorrect${finished ? ' quiz-feedback-final' : ''}`} role="status">
      <span className="quiz-feedback-icon"><CloseRoundedIcon /></span>
      <div>
        <strong>Incorrect!</strong>
        <h3>{finished ? 'Explanation' : 'Hint'}</h3>
        <p>{finished ? question.explanation : question.hint}</p>
        {finished
          ? <p className="quiz-correct-answer"><b>Answer:</b> {question.correctAnswer}</p>
          : <span className="quiz-attempt">Attempt {result.attempts} of 3</span>}
      </div>
    </div>
  )
}

export default QuizFeedback
