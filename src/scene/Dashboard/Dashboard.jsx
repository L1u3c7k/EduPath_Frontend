import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import mentoraOwlLogo from '../../assets/mentora-owl-logo.png'
import ConversationChat from '../../components/dashboard/ConversationChat'
import ConversationQuiz from '../../components/dashboard/ConversationQuiz'
import ResourcesPanel from '../../components/dashboard/ResourcesPanel'
import { NewChatIcon, SidebarIcon } from '../../components/dashboard/DashboardIcons'
import { Settings } from '../Settings'
import './Dashboard.css'

const initialMessages = [
  { role: 'user', text: 'What is prompt engineering?' },
  { role: 'assistant', text: `Based on the provided context, prompt engineering is an emerging discipline focused on designing, refining, and optimizing inputs (prompts) for large language models (LLMs) to achieve desired outputs.\n\nIt is described as the art and science of communicating effectively with AI, transforming abstract goals into concrete instructions that an AI can execute. At its core, it involves understanding how LLMs process information and respond to various types of input.\n\nPrompt engineering goes beyond simply asking a question; it requires:\n– Structuring the question effectively\n– Providing context\n– Specifying desired formats\n– Guiding the AI’s thought process to produce accurate, relevant, and high-quality results\n\nThe cornerstones of practical prompt engineering are clarity, specificity, and context, which work together to ensure the AI understands the user’s intent without ambiguity.\n\nThe field is dynamic and constantly evolving with new models and techniques, making continuous learning essential for practitioners.` },
]

const QUIZ_CHAT_THRESHOLD = 5

function Dashboard() {
  const navigate = useNavigate()
  const { view } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 720)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [search, setSearch] = useState('')
  const [messages, setMessages] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [chatUsageCount, setChatUsageCount] = useState(0)
  const [chats, setChats] = useState([])
  const [expandedChats, setExpandedChats] = useState([])
  const [openMenu, setOpenMenu] = useState(null)
  const [editingChat, setEditingChat] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [chatToDelete, setChatToDelete] = useState(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [username, setUsername] = useState('Kira')
  const menuRef = useRef(null)
  const profileMenuRef = useRef(null)
  const visibleChats = useMemo(() => chats.filter((chat) => chat.toLowerCase().includes(search.toLowerCase())), [chats, search])
  const quizUnlocked = chatUsageCount >= QUIZ_CHAT_THRESHOLD

  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !menuRef.current?.contains(event.target))) setOpenMenu(null)
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !profileMenuRef.current?.contains(event.target))) setProfileMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [])

  useEffect(() => {
    if (!chatToDelete && !logoutDialogOpen) return undefined

    const closeConfirmationDialog = (event) => {
      if (event.key === 'Escape') {
        setChatToDelete(null)
        setLogoutDialogOpen(false)
      }
    }

    document.addEventListener('keydown', closeConfirmationDialog)
    return () => document.removeEventListener('keydown', closeConfirmationDialog)
  }, [chatToDelete, logoutDialogOpen])

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 720px)')
    const handleViewportChange = (event) => {
      setSidebarOpen(!event.matches)
      if (!event.matches) setResourcesOpen(false)
    }

    mobileQuery.addEventListener('change', handleViewportChange)
    return () => mobileQuery.removeEventListener('change', handleViewportChange)
  }, [])

  if (view !== 'chat' && view !== 'quiz') return <Navigate to="/dashboard/chat" replace />
  if (view === 'quiz' && !quizUnlocked) return <Navigate to="/dashboard/chat" replace />

  const submitPrompt = (event) => {
    event.preventDefault()
    const text = prompt.trim()
    if (!text) return
    const isPromptEngineering = /prompt engineering/i.test(text)
    if (!messages.length) {
      const chatName = isPromptEngineering ? 'Prompt Engineering' : (text.length > 32 ? `${text.slice(0, 32)}...` : text)
      setChats((current) => current.includes(chatName) ? current : [chatName, ...current])
      setExpandedChats((current) => current.includes(chatName) ? current : [...current, chatName])
      setActiveChat(chatName)
    }
    setMessages((current) => isPromptEngineering && !current.length ? initialMessages : [...current, { role: 'user', text }])
    setChatUsageCount((count) => count + 1)
    setPrompt('')
  }

  const updateMessage = (index, text) => {
    setMessages((current) => current.map((message, messageIndex) => (
      messageIndex === index && message.role === 'user' ? { ...message, text } : message
    )))
  }

  const startNewChat = () => {
    navigate('/dashboard/chat')
    setMessages([])
    setActiveChat(null)
    setChatUsageCount(0)
    setPrompt('')
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  const openChat = (chat) => {
    navigate('/dashboard/chat')
    if (chat !== activeChat) {
      setMessages(chat === 'Prompt Engineering' ? initialMessages : [{ role: 'user', text: chat }])
      setChatUsageCount(1)
      setActiveChat(chat)
    }
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  const openQuiz = () => {
    navigate('/dashboard/quiz')
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
      setActiveChat((current) => current === chat ? name : current)
    }
    setEditingChat(null)
  }

  const requestDeleteChat = (chat) => {
    setOpenMenu(null)
    setChatToDelete(chat)
  }

  const deleteChat = () => {
    const chat = chatToDelete
    if (!chat) return
    setChats((current) => current.filter((item) => item !== chat))
    setExpandedChats((current) => current.filter((item) => item !== chat))
    if (chat === activeChat) {
      setMessages([])
      setChatUsageCount(0)
      setActiveChat(null)
    }
    setOpenMenu(null)
    setChatToDelete(null)
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
          <div className="recent-list">
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
                  <button type="button" role="menuitem" onClick={() => requestDeleteChat(chat)}><DeleteOutlineRoundedIcon />Delete</button>
                </div>
              )}
              {expandedChats.includes(chat) && (
                <div className="recent-children">
                  <button className={`recent-child ${view === 'chat' ? 'active' : ''}`} type="button" onClick={() => openChat(chat)}>Chat</button>
                  {quizUnlocked && (
                    <button className={`recent-child ${view === 'quiz' ? 'active' : ''}`} type="button" onClick={openQuiz}>Quiz</button>
                  )}
                </div>
              )}
              </div>
            ))}
          </div>
        </section>
        <div className="profile-menu-wrap" ref={profileMenuRef}>
          {profileMenuOpen && (
            <div className="profile-menu" role="menu" aria-label="Profile options">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileMenuOpen(false)
                  setSettingsOpen(true)
                }}
              >
                <SettingsOutlinedIcon />
                <span>Settings</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileMenuOpen(false)
                  setLogoutDialogOpen(true)
                }}
              >
                <LogoutRoundedIcon />
                <span>Log out</span>
              </button>
            </div>
          )}
          <button
            className="profile-pill"
            type="button"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            onClick={() => setProfileMenuOpen((open) => !open)}
          >
            <span className="profile-avatar" aria-hidden="true">K</span>
            <span>{username}</span>
          </button>
        </div>
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
        {view === 'quiz' ? (
          <ConversationQuiz />
        ) : (
          <ConversationChat
            messages={messages}
            prompt={prompt}
            onPromptChange={(event) => setPrompt(event.target.value)}
            onSubmit={submitPrompt}
            onUpdateMessage={updateMessage}
          />
        )}
      </section>

      <ResourcesPanel isOpen={resourcesOpen} hasMessages={messages.length > 0} onClose={() => setResourcesOpen(false)} />

      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} username={username} onUsernameChange={setUsername} />

      {chatToDelete && (
        <div className="delete-chat-backdrop" role="presentation" onMouseDown={() => setChatToDelete(null)}>
          <div
            className="delete-chat-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-chat-title"
            aria-describedby="delete-chat-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="delete-chat-title">Delete chat?</h2>
            <p id="delete-chat-description">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="delete-chat-actions">
              <button type="button" onClick={() => setChatToDelete(null)}>Cancel</button>
              <button className="delete-chat-confirm" type="button" autoFocus onClick={deleteChat}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {logoutDialogOpen && (
        <div className="delete-chat-backdrop" role="presentation" onMouseDown={() => setLogoutDialogOpen(false)}>
          <div
            className="delete-chat-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="logout-title">Log out?</h2>
            <p id="logout-description">Are you sure you want to log out?</p>
            <div className="delete-chat-actions">
              <button type="button" onClick={() => setLogoutDialogOpen(false)}>Cancel</button>
              <button className="logout-confirm" type="button" autoFocus onClick={() => navigate('/')}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Dashboard
