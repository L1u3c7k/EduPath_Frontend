import { useCallback, useEffect, useState } from 'react'
import GenerateQuizButton from './quiz/GenerateQuizButton'
import QuizCard from './quiz/QuizCard'
import QuizIntro from './quiz/QuizIntro'
import {
  generateQuizApi,
  getActiveQuizApi,
  submitQuizAnswerApi,
} from '../../api/quizApi'

const getQuizQuestions = (quiz) => Array.isArray(quiz?.questions) ? quiz.questions : []
const getStoredQuestions = (response) =>
  Array.isArray(response?.stored_questions) ? response.stored_questions : []

const createResults = (questions) => questions.map((question) => {
  const attempts = Array.isArray(question.attempts) ? question.attempts : []
  const finalAttempt = attempts.at(-1)
  const completed = Boolean(question.completed)

  return {
    answer: '',
    attempts: attempts.length,
    status: completed
      ? (finalAttempt?.is_correct ? 'correct' : 'incorrect')
      : (attempts.length ? 'incorrect' : 'idle'),
    submitted: finalAttempt?.user_answer || '',
    explanation: finalAttempt?.feedback || '',
    hint: completed ? '' : (finalAttempt?.feedback || ''),
    modelAnswer: completed && !finalAttempt?.is_correct ? question.model_answer : '',
  }
})

const createStoredResults = (questions) => questions.map((question) => ({
  answer: '',
  attempts: Math.max(question.attempts_used || 0, question.is_correct ? 1 : 3),
  status: question.is_correct ? 'correct' : 'incorrect',
  submitted: question.user_answer || '',
  explanation: question.ai_feedback || '',
  hint: '',
  modelAnswer: question.model_answer || '',
  reviewOnly: true,
}))

function ConversationQuiz({ chatId }) {
  const [storedQuestions, setStoredQuestions] = useState([])
  const [storedResults, setStoredResults] = useState([])
  const [questions, setQuestions] = useState([])
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [submittingQuestionNumber, setSubmittingQuestionNumber] = useState(null)
  const [error, setError] = useState('')

  const loadActiveQuiz = useCallback(async () => {
    if (!chatId) return
    setIsLoading(true)
    setError('')

    try {
      const response = await getActiveQuizApi(chatId)
      const completedQuestions = getStoredQuestions(response)
      console.log('Stored questions:', completedQuestions)
      const activeQuestions = getQuizQuestions(response.quiz)
      setStoredQuestions(completedQuestions)
      setStoredResults(createStoredResults(completedQuestions))
      setQuestions(activeQuestions)
      setResults(createResults(activeQuestions))
    } catch (loadError) {
      setStoredQuestions([])
      setStoredResults([])
      setQuestions([])
      setResults([])
      setError(loadError.response?.data?.detail || 'Could not load the active quiz.')
    } finally {
      setIsLoading(false)
    }
  }, [chatId])

  useEffect(() => {
    loadActiveQuiz()
  }, [loadActiveQuiz])

  const changeAnswer = (index, answer) => {
    setResults((current) => current.map((result, resultIndex) =>
      resultIndex === index ? { ...result, answer } : result
    ))
  }

  const submitAnswer = async (event, index) => {
    event.preventDefault()
    const question = questions[index]
    const result = results[index]
    const answer = result?.answer.trim()

    if (!chatId || !question || !answer || submittingQuestionNumber !== null) return

    setSubmittingQuestionNumber(question.question_number)
    setError('')

    try {
      const response = await submitQuizAnswerApi(
        chatId,
        question.question_number,
        answer
      )

      if (response.error) {
        setError(response.error)
        return
      }

      setResults((current) => current.map((item, resultIndex) => resultIndex === index
        ? {
            ...item,
            answer: '',
            submitted: answer,
            attempts: item.attempts + 1,
            status: response.correct ? 'correct' : 'incorrect',
            explanation: response.explanation || '',
            hint: response.hint || '',
            modelAnswer: response.model_answer || '',
          }
        : item
      ))

      if (response.quiz_completed) {
        setQuestions((current) => current.map((item, questionIndex) =>
          questionIndex === index ? { ...item, completed: true } : item
        ))
      }
    } catch (submitError) {
      setError(submitError.response?.data?.detail || 'Could not submit the answer.')
    } finally {
      setSubmittingQuestionNumber(null)
    }
  }

  const generateAnotherQuiz = async () => {
    if (!chatId) return
    setIsLoading(true)
    setError('')

    try {
      const response = await generateQuizApi(chatId)
      const completedQuestions = getStoredQuestions(response)
      console.log('Stored questions:', completedQuestions)
      const newQuestions = getQuizQuestions(response.quiz)
      setStoredQuestions(completedQuestions)
      setStoredResults(createStoredResults(completedQuestions))
      if (!newQuestions.length) {
        setError(response.message || 'No new quiz questions are available yet.')
        return
      }
      setQuestions(newQuestions)
      setResults(createResults(newQuestions))
    } catch (generateError) {
      setError(generateError.response?.data?.detail || 'Could not generate another quiz.')
    } finally {
      setIsLoading(false)
    }
  }

  const quizCompleted = questions.length > 0 && results.length === questions.length &&
    results.every((result) => result.status === 'correct' || result.attempts >= 3)
  const hasStoredQuestions = storedQuestions.length > 0
  const hasActiveSession = questions.length > 0
  const canGenerateAnotherQuiz = quizCompleted || (hasStoredQuestions && !hasActiveSession)

  return (
    <div className="quiz-view">
      
      <QuizIntro />
      {error && <p className="chat-status-error" role="alert">{error}</p>}
      {isLoading ? (
        <p role="status">Loading quiz...</p>
      ) : (
        <>

          {questions.length ? (
            <section className="quiz-section" aria-labelledby="generated-quiz-title">
              
              <div className="quiz-question-list">
                {questions.map((question, index) => (
                  <QuizCard
                    key={question.question_number}
                    question={question}
                    index={index}
                    totalQuestions={questions.length}
                    result={results[index]}
                    isSubmitting={submittingQuestionNumber === question.question_number}
                    onChange={changeAnswer}
                    onSubmit={submitAnswer}
                  />
                ))}
              </div>
            </section>
          ) : <div ><p>No quiz questions are available yet.</p></div>}
          {canGenerateAnotherQuiz && <GenerateQuizButton onClick={generateAnotherQuiz} />}
          {hasStoredQuestions && (
            <section className="quiz-section" aria-labelledby="stored-quiz-title">
              <h1 id="stored-quiz-title">Quiz history</h1>
              <div className="quiz-question-list">
                
                {storedQuestions.map((question, index) => (
                  <QuizCard
                    key={question.id || `stored-${question.question_number}`}
                    question={question}
                    index={index}
                    totalQuestions={storedQuestions.length}
                    result={storedResults[index]}
                    readOnly
                  />
                ))}
              </div>
            </section>
          )}

          
        </>
      )}
      
    </div>
  )
}

export default ConversationQuiz
