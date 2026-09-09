import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import QuizFeedback from './QuizFeedback'

function QuizCard({ question, index, totalQuestions, result, onChange, onSubmit }) {
  const finished = result.status === 'correct' || result.attempts >= 3

  return (
    <article className={`quiz-card quiz-card-${result.status}`}>
      <span className="quiz-number">Question {index + 1} of {totalQuestions}</span>
      <p>{question.text}</p>
      {result.status !== 'correct' && (
        <form className="quiz-answer-form" onSubmit={(event) => onSubmit(event, index)}>
          <input
            value={result.answer}
            onChange={(event) => onChange(index, event.target.value)}
            placeholder={result.attempts ? 'Input your answer again and submit' : 'Input your answer and submit'}
            aria-label={`Answer question ${index + 1}`}
            disabled={finished}
          />
          <button type="submit" aria-label={`Submit answer ${index + 1}`} disabled={!result.answer.trim() || finished}>
            <ArrowForwardRoundedIcon />
          </button>
        </form>
      )}
      <QuizFeedback question={question} result={result} finished={finished} />
    </article>
  )
}

export default QuizCard
