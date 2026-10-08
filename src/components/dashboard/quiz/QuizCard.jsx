import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import QuizFeedback from './QuizFeedback'

function QuizCard({ question, index, totalQuestions, result, isSubmitting = false, readOnly = false, onChange, onSubmit }) {
  const finished = result.status === 'correct' || result.attempts >= 3
  const questionNumber = question.question_number ?? index + 1
  const hasSubmittedAnswer = Boolean(result.submitted)

  return (
    <article className={`quiz-card quiz-card-${result.status}${readOnly ? ' quiz-card-readonly' : ''}`}>
      <div className="quiz-card-body">
        <span className="quiz-number">Question {index + 1} of {totalQuestions}</span>
        <p>{question.question || question.text}</p>
        {readOnly && result.submitted && (
          <span className="quiz-submitted">Your answer: {result.submitted}</span>
        )}
      </div>
      {!readOnly && hasSubmittedAnswer && (
        <span className="quiz-submitted">Your answer: {result.submitted}</span>
      )}
      {!readOnly && !finished && (
        <form className="quiz-answer-form" onSubmit={(event) => onSubmit(event, index)}>
          <input
            value={result.answer}
            onChange={(event) => onChange(index, event.target.value)}
            placeholder={result.attempts ? 'Input your answer again and submit' : 'Input your answer and submit'}
            aria-label={`Answer question ${questionNumber}`}
            disabled={finished || isSubmitting}
          />
          <button type="submit" aria-label={`Submit answer ${questionNumber}`} disabled={!result.answer.trim() || finished || isSubmitting}>
            <ArrowForwardRoundedIcon />
          </button>
        </form>
      )}
      <QuizFeedback question={question} result={result} finished={finished} />
    </article>
  )
}

export default QuizCard
