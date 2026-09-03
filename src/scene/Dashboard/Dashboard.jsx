import { useEffect, useMemo, useRef, useState } from 'react'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
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
    </svg>
  )
}

const initialMessages = [
  { role: 'user', text: 'What is prompt engineering?' },
  { role: 'assistant', text: `Based on the provided context, prompt engineering is an emerging discipline focused on designing, refining, and optimizing inputs (prompts) for large language models (LLMs) to achieve desired outputs.\n\nIt is described as the art and science of communicating effectively with AI, transforming abstract goals into concrete instructions that an AI can execute. At its core, it involves understanding how LLMs process information and respond to various types of input.\n\nPrompt engineering goes beyond simply asking a question; it requires:\n– Structuring the question effectively\n– Providing context\n– Specifying desired formats\n– Guiding the AI’s thought process to produce accurate, relevant, and high-quality results\n\nThe cornerstones of practical prompt engineering are clarity, specificity, and context, which work together to ensure the AI understands the user’s intent without ambiguity.\n\nThe field is dynamic and constantly evolving with new models and techniques, making continuous learning essential for practitioners.` },
]

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 720)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [search, setSearch] = useState('')
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [expandedChats, setExpandedChats] = useState([])
  const [openMenu, setOpenMenu] = useState(null)
  const [editingChat, setEditingChat] = useState(null)
  const [editValue, setEditValue] = useState('')
  const menuRef = useRef(null)
  const visibleChats = useMemo(() => chats.filter((chat) => chat.toLowerCase().includes(search.toLowerCase())), [chats, search])

  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !menuRef.current?.contains(event.target))) setOpenMenu(null)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [])

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 720px)')
    const handleViewportChange = (event) => {
      setSidebarOpen(!event.matches)
      if (!event.matches) setResourcesOpen(false)
    }

    mobileQuery.addEventListener('change', handleViewportChange)
    return () => mobileQuery.removeEventListener('change', handleViewportChange)
  }, [])

  const submitPrompt = (event) => {
    event.preventDefault()
    const text = prompt.trim()
    if (!text) return
    const isPromptEngineering = /prompt engineering/i.test(text)
    if (!messages.length) {
      const chatName = isPromptEngineering ? 'Prompt Engineering' : (text.length > 32 ? `${text.slice(0, 32)}...` : text)
      setChats((current) => current.includes(chatName) ? current : [chatName, ...current])
      setExpandedChats((current) => current.includes(chatName) ? current : [...current, chatName])
    }
    setMessages((current) => isPromptEngineering && !current.length ? initialMessages : [...current, { role: 'user', text }])
    setPrompt('')
  }

  const startNewChat = () => {
    setMessages([])
    setPrompt('')
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  const openChat = (chat) => {
    setMessages(chat === 'Prompt Engineering' ? initialMessages : [{ role: 'user', text: chat }])
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  const toggleChat = (chat) => {
    setExpandedChats((current) => current.includes(chat) ? current.filter((item) => item !== chat) : [...current, chat])
  }

  const beginEditing = (chat) => {
    setEditingChat(chat)
    setEditValue(chat)
    setOpenMenu(null)
  }

  const saveChatName = (event, chat) => {
    event.preventDefault()
    const name = editValue.trim()
    if (name) {
      setChats((current) => current.map((item) => item === chat ? name : item))
      setExpandedChats((current) => current.map((item) => item === chat ? name : item))
    }
    setEditingChat(null)
  }

  const deleteChat = (chat) => {
    setChats((current) => current.filter((item) => item !== chat))
    setExpandedChats((current) => current.filter((item) => item !== chat))
    setMessages([])
    setOpenMenu(null)
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
        <button className="sidebar-action" type="button" onClick={startNewChat}>
          <NewChatIcon />
          <span>New chat</span>
        </button>
        <label className="chat-search">
          <SearchRoundedIcon />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chats" aria-label="Search chats" />
        </label>
        <section className="recent-chats" aria-labelledby="recent-title">
          <h2 id="recent-title">Recent</h2>
          {visibleChats.map((chat) => (
            <div className="recent-group" key={chat} ref={openMenu === chat ? menuRef : null}>
              <div className="recent-group-title">
                {editingChat === chat ? (
                  <form className="chat-name-form" onSubmit={(event) => saveChatName(event, chat)}>
                    <input autoFocus value={editValue} onChange={(event) => setEditValue(event.target.value)} onBlur={(event) => saveChatName(event, chat)} aria-label="Chat name" />
                  </form>
                ) : (
                  <button type="button" onClick={() => openChat(chat)}>{chat}</button>
                )}
                <button className="chat-expand-button" type="button" aria-label={`${expandedChats.includes(chat) ? 'Collapse' : 'Expand'} ${chat}`} aria-expanded={expandedChats.includes(chat)} onClick={() => toggleChat(chat)}>
                  <KeyboardArrowDownRoundedIcon />
                </button>
                <button className="chat-options-button" type="button" aria-label={`Options for ${chat}`} aria-haspopup="menu" aria-expanded={openMenu === chat} onClick={() => setOpenMenu((current) => current === chat ? null : chat)}>
                  <MoreHorizRoundedIcon />
                </button>
              </div>
              {openMenu === chat && (
                <div className="chat-options-menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => beginEditing(chat)}><EditOutlinedIcon />Edit</button>
                  <button type="button" role="menuitem" onClick={() => deleteChat(chat)}><DeleteOutlineRoundedIcon />Delete</button>
                </div>
              )}
              {expandedChats.includes(chat) && (
                <div className="recent-children">
                  <button className="recent-child" type="button" onClick={() => openChat(chat)}>Chat</button>
                  <button className="recent-child" type="button">Quiz</button>
                </div>
              )}
            </div>
          ))}
        </section>
        <button className="profile-pill" type="button">
          <span className="profile-avatar" aria-hidden="true">K</span>
          <span>Kira</span>
        </button>
      </aside>
      {sidebarOpen && (
        <button className="sidebar-backdrop" type="button" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} />
      )}

      <section className="dashboard-main" aria-label="Chat with Mentora">
        {!sidebarOpen && (
          <button className="dashboard-icon-button floating-menu" type="button" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}>
            <SidebarIcon />
          </button>
        )}
        <button className="resources-mobile-button" type="button" onClick={() => setResourcesOpen(true)}>Resources</button>
        <div className={`conversation ${messages.length ? '' : 'conversation-empty'}`}>
          {!messages.length && <h1>How can I help you today?</h1>}
          <div className="message-list" aria-live="polite">
            {messages.map((message, index) => (
              <article className={`message message-${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </article>
            ))}
          </div>
          <form className="prompt-form" onSubmit={submitPrompt}>
            <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask anything..." aria-label="Ask Mentora anything" />
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
        {messages.length > 0 && (
          <a className="resource-card" href="https://www.edfreitas.me/" target="_blank" rel="noreferrer">
            <strong>Prompt Engineering for Developers</strong>
            <span>by Ed Freitas</span>
          </a>
        )}
      </aside>
      {resourcesOpen && (
        <button className="dashboard-backdrop" type="button" aria-label="Close resources" onClick={() => setResourcesOpen(false)} />
      )}
    </main>
  )
}

export default Dashboard
