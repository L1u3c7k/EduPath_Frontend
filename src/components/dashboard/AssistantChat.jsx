function AssistantChat({ text, pending = false }) {
  return (
    <article className={`message message-assistant ${pending ? 'is-pending' : ''}`}>
      {pending && !text ? 'Mentora is thinking…' : text}
    </article>
  )
}

export default AssistantChat
