import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import { useState } from 'react'

function AssistantChat({ text }) {
  const [copied, setCopied] = useState(false)

  const copyMessage = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="assistant-message-wrap">
      <article className="message message-assistant">{text}</article>
      <div className="message-actions">
        <button type="button" aria-label={copied ? 'Copied' : 'Copy message'} title={copied ? 'Copied' : 'Copy'} onClick={copyMessage}>
          {copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
        </button>
      </div>
    </div>
  )
}

export default AssistantChat
