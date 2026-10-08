import mentoraLogo from '../../assets/mentora-logo.png'

function AuthBrandPanel() {
  return (
    <aside className="brand-section" aria-label="About Mentora">
      <div className="brand-mark">
        <img src={mentoraLogo} alt="Mentora" />
      </div>

      <div className="brand-copy">
        <h2>Welcome to Mentora.<br />Turn Knowledge Into Understanding.</h2>
        <p>Ask questions, get meaningful explanations, and challenge yourself with AI-generated quizzes based on what you learn.</p>
      </div>
    </aside>
  )
}

export default AuthBrandPanel
