import { useMemo, useState } from 'react'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import mentoraOwlLogo from '../../assets/mentora-owl-logo.png'
import './Dashboard.css'

function SidebarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 3.5v17" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function NewChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 4H5.75A1.75 1.75 0 0 0 4 5.75v12.5C4 19.22 4.78 20 5.75 20h12.5A1.75 1.75 0 0 0 20 18.25V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m17.25 3.75 3 3L11.5 15.5H8.5v-3l8.75-8.75Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m15.5 5.5 3 3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [search, setSearch] = useState('')
  const [chats, setChats] = useState([])

  const visibleChats = useMemo(
    () => chats.filter((chat) => chat.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  )

  const submitPrompt = (event) => {
    event.preventDefault()
    const message = prompt.trim()
    if (!message) return
    setChats((current) => [message, ...current])
    setPrompt('')
  }

  return (
    <main className={`dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className="dashboard-sidebar" aria-label="Chat navigation">
        <div className="dashboard-brand-row">
          <div className="dashboard-brand-lockup">
            <span className="dashboard-logo-crop">
              <img src={mentoraOwlLogo} alt="Mentora owl and book logo" />
            </span>
            <span className="dashboard-brand-name">Mentora</span>
          </div>
          <button
            className="dashboard-icon-button sidebar-toggle"
            type="button"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <SidebarIcon />
          </button>
        </div>

        <button className="sidebar-action" type="button" title="New chat" onClick={() => setPrompt('')}>
          <NewChatIcon />
          <span>New chat</span>
        </button>

        <label className="chat-search" title="Search chats">
          <SearchRoundedIcon />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats"
            aria-label="Search chats"
          />
        </label>

        <section className="recent-chats" aria-labelledby="recent-title">
          <h2 id="recent-title">Recent</h2>
          {visibleChats.map((chat, index) => (
            <button key={`${chat}-${index}`} type="button" onClick={() => setPrompt(chat)} title={chat}>
              {chat}
            </button>
          ))}
        </section>

        <button className="profile-pill" type="button" title="Profile">
          <span className="profile-avatar" aria-hidden="true">K</span>
          <span>Kira</span>
        </button>
      </aside>

      <section className="dashboard-main" aria-labelledby="dashboard-title">
        {!sidebarOpen && (
          <button className="dashboard-icon-button floating-menu" type="button" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}>
            <SidebarIcon />
          </button>
        )}
        <button className="resources-mobile-button" type="button" onClick={() => setResourcesOpen(true)}>
          Resources
        </button>
        <div className="prompt-area">
          <h1 id="dashboard-title">How can I help you today?</h1>
          <form className="prompt-form" onSubmit={submitPrompt}>
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask anything..."
              aria-label="Ask Mentora anything"
            />
            <button type="submit" aria-label="Send message" disabled={!prompt.trim()}>
              <ArrowUpwardRoundedIcon />
            </button>
          </form>
        </div>
      </section>

      <aside className={`resources-panel ${resourcesOpen ? 'mobile-open' : ''}`} aria-label="Resources">
        <div className="resources-title-row">
          <h2>Resources</h2>
          <button className="dashboard-icon-button resources-close" type="button" aria-label="Close resources" onClick={() => setResourcesOpen(false)}>
            <CloseRoundedIcon />
          </button>
        </div>
        <p>Your helpful learning resources will appear here.</p>
      </aside>
      {resourcesOpen && <button className="dashboard-backdrop" type="button" aria-label="Close resources" onClick={() => setResourcesOpen(false)} />}
    </main>
  )
}

export default Dashboard
