import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

function ResourcesPanel({ isOpen, hasMessages, onClose }) {
  return (
    <>
      <aside className={`resources-panel ${isOpen ? 'mobile-open' : ''}`} aria-label="Resources">
        <div className="resources-title-row">
          <h2>Resources</h2>
          <button className="dashboard-icon-button resources-close" type="button" aria-label="Close resources" onClick={onClose}>
            <CloseRoundedIcon />
          </button>
        </div>
        {hasMessages && (
          <a className="resource-card" href="https://www.edfreitas.me/" target="_blank" rel="noreferrer">
            <strong>Prompt Engineering for Developers</strong>
            <span>by Ed Freitas</span>
          </a>
        )}
      </aside>
      {isOpen && <button className="dashboard-backdrop" type="button" aria-label="Close resources" onClick={onClose} />}
    </>
  )
}

export default ResourcesPanel
