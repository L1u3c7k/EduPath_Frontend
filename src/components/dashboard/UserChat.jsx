import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useRef, useState } from 'react'

function UserChat({ text, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const copyTimeoutRef = useRef(null)

  // Clean up copy icon timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const beginEditing = () => {
    setDraft(text)
    setError(null)
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setError(null)
    setDraft(text)
  }

  const updateMessage = async (event) => {
    if (event) event.preventDefault()
    const updatedText = draft.trim()

    if (!updatedText || updatedText === text || loading) return

    setLoading(true)
    setError(null)

    try {
      // Handles both sync and async onUpdate handlers
      await onUpdate(updatedText)
      setEditing(false)
    } catch (err) {
      setError('Failed to update message:Can only be updated on the latest message')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      cancelEditing()
    } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      // Trigger submit on Ctrl+Enter or Cmd+Enter
      updateMessage(event)
    }
  }

  if (editing) {
    const isSubmitDisabled = !draft.trim() || draft.trim() === text || loading

    return (
      <form className="message-editor" onSubmit={updateMessage}>
        <textarea
          autoFocus
          disabled={loading}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Edit your message"
          placeholder="Type your message..."
        />
        
        {error && <div className="message-editor-error" role="alert">{error}</div>}

        <div className="message-editor-actions">
          <button type="button" onClick={cancelEditing} disabled={loading}>
            Cancel
          </button>
          <button
            className="message-update"
            type="submit"
            disabled={isSubmitDisabled}
          >
            {loading ? <CircularProgress size={16} color="inherit" /> : 'Update'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="user-message-wrap">
      <article className="message message-user">{text}</article>
      <div className="message-actions">
        <button
          type="button"
          aria-label={copied ? 'Copied' : 'Copy message'}
          title={copied ? 'Copied' : 'Copy'}
          onClick={copyMessage}
        >
          {copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
        </button>
        <button
          type="button"
          aria-label="Edit message"
          title="Edit"
          onClick={beginEditing}
        >
          <EditOutlinedIcon />
        </button>
      </div>
    </div>
  )
}

export default UserChat