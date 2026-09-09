function GenerateQuizButton({ onClick }) {
  return (
    <button className="generate-quiz-button" type="button" onClick={onClick}>
      Generate Another Quiz
    </button>
  )
}

export default GenerateQuizButton
