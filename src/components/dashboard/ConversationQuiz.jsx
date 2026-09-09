import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState } from 'react'
import assistantProfile from '../../assets/assistant-profile.png'

const questions = [
  { text: 'Name one characteristic of a good prompt.', answers: ['clear', 'clarity', 'specific', 'context'], hint: 'Think about the qualities that make instructions easy for an AI to understand.' },
  { text: 'What is the main benefit of making a prompt specific?', answers: ['accurate', 'relevant', 'precise', 'desired response'], hint: 'Think about how clear instructions help the AI understand exactly what kind of response you want.' },
  { text: 'You need to compare Python and Java clearly. Which prompt is best?', answers: ['compare python and java', 'table'], hint: 'Include the subjects, format, and specific comparison criteria in your prompt.' },
  { text: 'Why should a prompt include clear instructions?', answers: ['understand', 'desired response', 'accurate', 'task'], hint: 'Consider how instructions guide the AI toward the intended task and result.' },
  { text: 'Which prompt demonstrates strong prompt-engineering practices?', answers: ['clear', 'specific', 'context', 'format', 'details'], hint: 'Think about how adding clear details helps the AI understand your expected result.' },
]

function ConversationQuiz() {
  const [results, setResults] = useState(() => questions.map(() => ({ answer: '', attempts: 0, status: 'idle', submitted: '' })))

  const changeAnswer = (index, answer) => {
    setResults((items) => items.map((item, i) => i === index ? { ...item, answer } : item))
  }

  const submitAnswer = (event, index) => {
    event.preventDefault()
    const result = results[index]
    const answer = result.answer.trim()
    if (!answer || result.status === 'correct' || result.attempts >= 3) return
    const normalized = answer.toLowerCase()
    const correct = questions[index].answers.some((accepted) => normalized.includes(accepted))
    setResults((items) => items.map((item, i) => i === index ? {
      ...item,
      answer: correct ? answer : '',
      submitted: answer,
      attempts: item.attempts + 1,
      status: correct ? 'correct' : 'incorrect',
    } : item))
  }

  return (
    <div className="quiz-view">
      <h1>Quiz</h1>
      <div className="quiz-intro">
        <img className="quiz-mentor-avatar" src={assistantProfile} alt="Mentora assistant" />
        <div><strong>Mentora</strong><p>Great! Let's check your understanding.</p></div>
      </div>
      <div className="quiz-question-list">
        {questions.map((question, index) => (
          <QuizQuestion key={question.text} question={question} index={index} result={results[index]} onChange={changeAnswer} onSubmit={submitAnswer} />
        ))}
      </div>
    </div>
  )
}

function QuizQuestion({ question, index, result, onChange, onSubmit }) {
  const finished = result.status === 'correct' || result.attempts >= 3
  return (
    <article className={`quiz-card quiz-card-${result.status}`}>
      <span className="quiz-number">Question {index + 1} of {questions.length}</span>
      <p>{question.text}</p>
      {result.status !== 'correct' && (
        <form className="quiz-answer-form" onSubmit={(event) => onSubmit(event, index)}>
          <input value={result.answer} onChange={(event) => onChange(index, event.target.value)} placeholder={result.attempts ? 'Input your answer again and submit' : 'Input your answer and submit'} aria-label={`Answer question ${index + 1}`} disabled={finished} />
          <button type="submit" aria-label={`Submit answer ${index + 1}`} disabled={!result.answer.trim() || finished}><ArrowForwardRoundedIcon /></button>
        </form>
      )}
      {result.status === 'correct' && (
        <div className="quiz-feedback quiz-feedback-correct" role="status"><span className="quiz-feedback-icon"><CheckRoundedIcon /></span><div><strong>Correct!</strong><p>Your answer: {result.submitted}</p></div></div>
      )}
      {result.status === 'incorrect' && (
        <div className="quiz-feedback quiz-feedback-incorrect" role="status"><span className="quiz-feedback-icon"><CloseRoundedIcon /></span><div><strong>{finished ? 'No attempts remaining' : 'Incorrect!'}</strong><h3>Hint</h3><p>{question.hint}</p><span className="quiz-attempt">Attempt {result.attempts} of 3</span></div></div>
      )}
    </article>
  )
}

export default ConversationQuiz
