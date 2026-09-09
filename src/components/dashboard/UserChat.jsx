import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useState } from 'react'

function UserChat({ text, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)
  const [copied, setCopied] = useState(false)

  const copyMessage = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const beginEditing = () => {
    setDraft(text)
    setEditing(true)
  }

  const updateMessage = (event) => {
    event.preventDefault()
    const updatedText = draft.trim()
    if (!updatedText || updatedText === text) return
    onUpdate(updatedText)
    setEditing(false)
  }

  if (editing) {
    return (
      <form className="message-editor" onSubmit={updateMessage}>
        <textarea autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Edit your message" />
        <div className="message-editor-actions">
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          <button className="message-update" type="submit" disabled={!draft.trim() || draft.trim() === text}>Update</button>
        </div>
      </form>
    )
  }

  return (
    <div className="user-message-wrap">
      <article className="message message-user">{text}</article>
      <div className="message-actions">
        <button type="button" aria-label={copied ? 'Copied' : 'Copy message'} title={copied ? 'Copied' : 'Copy'} onClick={copyMessage}>
          {copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
        </button>
        <button type="button" aria-label="Edit message" title="Edit" onClick={beginEditing}><EditOutlinedIcon /></button>
      </div>
    </div>
  )
}

export default UserChat
