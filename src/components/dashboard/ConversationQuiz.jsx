import { useState } from 'react'
import GenerateQuizButton from './quiz/GenerateQuizButton'
import QuizCard from './quiz/QuizCard'
import QuizIntro from './quiz/QuizIntro'

const questions = [
  { text: 'Name one characteristic of a good prompt.', answers: ['clear', 'clarity', 'specific', 'context'], hint: 'Think about the qualities that make instructions easy for an AI to understand.', explanation: 'A good prompt clearly communicates what you want the AI to do.', correctAnswer: 'Clear' },
  { text: 'What is the main benefit of making a prompt specific?', answers: ['accurate', 'relevant', 'precise', 'desired response'], hint: 'Think about how clear instructions help the AI understand exactly what kind of response you want.', explanation: 'A specific prompt gives the AI clear details about what you want. This reduces ambiguity and helps the AI generate a response that is more relevant, focused, and useful.', correctAnswer: 'It helps the AI understand exactly what you want' },
  { text: 'You need to compare Python and Java clearly. Which prompt is best?', answers: ['compare python and java', 'table'], hint: 'Include the subjects, format, and specific comparison criteria in your prompt.', explanation: 'A strong comparison prompt names both subjects, specifies the format, and identifies the criteria to compare.', correctAnswer: 'Compare Python and Java in a table using learning difficulty, performance, and common use cases.' },
  { text: 'Why should a prompt include clear instructions?', answers: ['understand', 'desired response', 'accurate', 'task'], hint: 'Consider how instructions guide the AI toward the intended task and result.', explanation: 'Clear instructions guide the AI toward the intended task and reduce the chance of an irrelevant response.', correctAnswer: 'To help the AI understand the task and produce the desired response' },
  { text: 'Which prompt demonstrates strong prompt-engineering practices?', answers: ['clear', 'specific', 'context', 'format', 'details'], hint: 'Think about how adding clear details helps the AI understand your expected result.', explanation: 'This prompt gives the AI a clear role, specific task, and desired output, helping it produce a more relevant and useful response.', correctAnswer: 'Act as a beginner-friendly tutor. Explain SQL JOINs with one simple example, then give me three practice questions.' },
]

const createInitialResults = () => questions.map(() => ({ answer: '', attempts: 0, status: 'idle', submitted: '' }))

function ConversationQuiz({ chatId }) {
  const [results, setResults] = useState(createInitialResults)
  const quizCompleted = results.every((result) => result.status === 'correct' || result.attempts >= 3)

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

  const generateAnotherQuiz = () => {
    setResults(createInitialResults())
  }

  return (
    <div className="quiz-view">
      <h1>Quiz {chatId ? `for Chat #${chatId}` : ''}</h1>
      <QuizIntro />
      <div className="quiz-question-list">
        {questions.map((question, index) => (
          <QuizCard 
            key={question.text} 
            question={question} 
            index={index} 
            totalQuestions={questions.length} 
            result={results[index]} 
            onChange={changeAnswer} 
            onSubmit={submitAnswer} 
          />
        ))}
      </div>
      {quizCompleted && <GenerateQuizButton onClick={generateAnotherQuiz} />}
    </div>
  )
}

export default ConversationQuiz