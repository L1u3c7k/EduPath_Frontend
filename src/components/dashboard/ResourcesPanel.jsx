import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

function ResourcesPanel({ isOpen, sourceDocuments = [], onClose }) {
  return (
    <>
      <aside className={`resources-panel ${isOpen ? 'mobile-open' : ''}`} aria-label="Resources">
        <div className="resources-title-row">
          <h2 style={{marginBottom:"20px"}}>Resources</h2>
          <button className="dashboard-icon-button resources-close" type="button" aria-label="Close resources" onClick={onClose}>
            <CloseRoundedIcon />
          </button>
        </div>
        <div className="resource-list">
          {sourceDocuments.map((document, index) => (
            <article className="resource-card" key={`${document.book_title}-${document.chapter}-${index}`}>
              <strong>{document.book_title || 'Unknown book'}</strong>
              <span>Chapter: {document.chapter || 'Chapter unavailable'}</span>
              <span>Topic: {document.topic || 'Chapter unavailable'}</span>
              <span>Page: {document.page || 'Chapter unavailable'}</span>
            </article>
          ))}
          {!sourceDocuments.length && <span>No source documents for this response.</span>}
        </div>
      </aside>
      {isOpen && <button className="dashboard-backdrop" type="button" aria-label="Close resources" onClick={onClose} />}
    </>
  )
}

export default ResourcesPanel
