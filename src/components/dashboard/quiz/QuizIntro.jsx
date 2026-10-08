import assistantProfile from '../../../assets/assistant-profile.png'

function QuizIntro() {
  return (
    <div className="quiz-intro">
      <img className="quiz-mentor-avatar" src={assistantProfile} alt="Mentora assistant" />
      <div>
        <strong>Mentora</strong>
        <p>Great! Let's check your understanding.</p>
      </div>
    </div>
  )
}

export default QuizIntro
