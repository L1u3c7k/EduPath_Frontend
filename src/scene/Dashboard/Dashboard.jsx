import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

import mentoraOwlLogo from '../../assets/mentora-owl-logo.png'
import ConversationChat from '../../components/dashboard/ConversationChat'
import ResourcesPanel from '../../components/dashboard/ResourcesPanel'
import ConversationQuiz from '../../components/dashboard/ConversationQuiz'
import { NewChatIcon, SidebarIcon } from '../../components/dashboard/DashboardIcons'
import Settings  from "../Settings/Settings"
import {
  fetchGetChatSessions,
  fetchGetChatHistoryApi,
  updateChatTitleApi,
  deleteChatApi,
  fetchInitializeChatApi,
  fetchSendMessageApi,
} from '../../api/chatApi'
import './Dashboard.css'
import { useAuth } from '../../context/AuthContext'
import { getUser } from '../../api/userApi'

const QUIZ_CHAT_THRESHOLD = 5

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const { chatId: activeChatId } = useParams()

  const isQuizMode = location.pathname.includes('/quiz/')

  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 720)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [search, setSearch] = useState('')

  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [expandedChats, setExpandedChats] = useState([])

  const [openMenu, setOpenMenu] = useState(null)
  const [editingChatId, setEditingChatId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [chatToDelete, setChatToDelete] = useState(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [username, setUsername] = useState(user?.name || 'Kira')
  const [, setUserInfo] = useState(null)

  const menuRef = useRef(null)
  const profileMenuRef = useRef(null)

  const userMessageCount = useMemo(
    () => messages.filter((m) => m.role === 'user').length,
    [messages]
    
  )
  const quizUnlocked =  userMessageCount >= QUIZ_CHAT_THRESHOLD

  const visibleChats = useMemo(
    () =>
      chats.filter(
        (chat) =>
          chat &&
          typeof chat.title === 'string' &&
          chat.title.toLowerCase().includes(search.toLowerCase())
      ),
    [chats, search]
  )

  // 1. Defined at component level so it is accessible in JSX
  const loadChatHistory = useCallback(async () => {
    if (!activeChatId) return
    try {
      const data = await fetchGetChatHistoryApi(activeChatId)
      if (!data) return
      const rawMessages = Array.isArray(data) ? data : data.messages || []
      setMessages(rawMessages)
      console.log(messages)
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }, [activeChatId])

  useEffect(() => {
    let isMounted = true
    const fetchUserProfile = async () => {
      try {
        const data = await getUser()
        if (isMounted && data) {
          setUserInfo(data)
          if (data.name) setUsername(data.name)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      }
    }
    fetchUserProfile()
    return () => { isMounted = false }
  }, [])

  const handleLogout = async () => {
    setProfileMenuOpen(false)
    setLogoutDialogOpen(false)
    await logout()
    navigate('/')
  }

  const loadChatSessions = async () => {
    try {
      const data = await fetchGetChatSessions()
      if (!data) return
      const sessionObjects = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id || item._id,
            title: item.title || item.name || 'Untitled Chat',
          }))
        : []
      setChats(sessionObjects)
    } catch (error) {
      console.error('Failed to load chat sessions:', error)
    }
  }

  useEffect(() => {
    let isMounted = true
    const initSessions = async () => {
      if (isMounted) await loadChatSessions()
    }
    initSessions()
    return () => { isMounted = false }
  }, [])

  // 2. Clear state or trigger history reload when activeChatId changes
  useEffect(() => {
    if (!activeChatId) {
      setMessages([])
      setPrompt('')
      return
    }
    loadChatHistory()
  }, [activeChatId, loadChatHistory])

  useEffect(() => {
    const closeMenu = (event) => {
      if (
        event.key === 'Escape' ||
        (event.type === 'pointerdown' && !menuRef.current?.contains(event.target))
      ) {
        setOpenMenu(null)
      }
      if (
        event.key === 'Escape' ||
        (event.type === 'pointerdown' && !profileMenuRef.current?.contains(event.target))
      ) {
        setProfileMenuOpen(false)
      }
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

  const submitPrompt = async (event) => {
  event.preventDefault()
  const text = prompt.trim()
  if (!text) return

  const tempId = `temp-${Date.now()}`
  const tempUserMsg = { id: tempId, role: 'user', text: text, content: text }
  
  // Optimistically show the user's message
  setMessages((current) => [...current, tempUserMsg])
  setPrompt('')

  try {
    if (!activeChatId) {
      // 1. Initialize the new chat on the backend
      const data = await fetchInitializeChatApi(text)
      const newChatId = data.id || data.chat_id || data.chatId

      if (newChatId) {
        setExpandedChats([newChatId])
        
        // 2. Fetch the updated sidebar list so the new chat shows up immediately
        await loadChatSessions()

        // 3. Navigate to the new chat route
        navigate(`/app/${newChatId}`)
      } else {
        await loadChatSessions()
      }
    } else {
      // Logic for existing chats
      await fetchSendMessageApi(activeChatId, text)
      await loadChatHistory()
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

  const startNewChat = () => {
    setMessages([])
    setPrompt('')
    setExpandedChats([])
    navigate('/app')
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  const openChat = (chatId) => {
    navigate(`/app/${chatId}`)
    setExpandedChats([chatId])
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  const openQuiz = (chatId) => {
    if (!quizUnlocked) return
    navigate(`/app/quiz/${chatId}`)
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  const toggleChat = (chatId) => {
    setExpandedChats((current) => (current.includes(chatId) ? [] : [chatId]))
  }

  const beginEditing = (chat) => {
    setEditingChatId(chat.id)
    setEditValue(chat.title)
    setOpenMenu(null)
  }

  const saveChatName = async (event, chatId) => {
    event.preventDefault()
    const newTitle = editValue.trim()
    if (newTitle) {
      try {
        await updateChatTitleApi(chatId, newTitle)
        setChats((current) =>
          current.map((item) => (item.id === chatId ? { ...item, title: newTitle } : item))
        )
      } catch (error) {
        console.error('Failed to update chat title:', error)
      }
    }
    setEditingChatId(null)
  }

  const requestDeleteChat = (chat) => {
    setOpenMenu(null)
    setChatToDelete(chat)
  }

  const deleteChat = async () => {
    if (!chatToDelete) return

    const targetId = chatToDelete.id

    try {
      // 1. Call API endpoint to delete on backend
      await deleteChatApi(targetId)

      // 2. Remove chat from sidebar state list
      setChats((current) => current.filter((item) => item.id !== targetId))
      setExpandedChats((current) => current.filter((id) => id !== targetId))

      // 3. If currently viewing the deleted chat, reset state and navigate back
      if (String(activeChatId) === String(targetId)) {
        setMessages([])
        navigate('/app')
      }
    } catch (error) {
      console.error('Failed to delete chat session:', error)
    } finally {
      // 4. Cleanup modal and selection states
      setOpenMenu(null)
      setChatToDelete(null)
    }
  }

  return (
    <main className={`dashboard ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className="dashboard-sidebar" aria-label="Chat navigation">
        <div className="dashboard-brand-row">
          <div className="dashboard-brand-lockup">
            <span className="dashboard-logo-crop">
              <img src={mentoraOwlLogo} alt="Mentora owl logo" />
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
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats"
            aria-label="Search chats"
          />
        </label>
        <section className="recent-chats" aria-labelledby="recent-title">
          <h2 id="recent-title">Recent</h2>
          <div className="recent-list">
            {visibleChats.map((chat) => (
            <div className="recent-group" key={chat} ref={openMenu === chat ? menuRef : null}>
              <div className="recent-group-title">
                {editingChatId === chat.id ? (
                  <form className="chat-name-form" onSubmit={(event) => saveChatName(event, chat.id)}>
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(event) => setEditValue(event.target.value)}
                      onBlur={(event) => saveChatName(event, chat.id)}
                      aria-label="Chat name"
                    />
                  </form>
                ) : (
                  <button type="button" onClick={() => openChat(chat.id)}>
                    {chat.title}
                  </button>
                )}

                <button
                  className="chat-expand-button"
                  type="button"
                  aria-label={`${expandedChats.includes(chat.id) ? 'Collapse' : 'Expand'} ${chat.title}`}
                  aria-expanded={expandedChats.includes(chat.id)}
                  onClick={() => toggleChat(chat.id)}
                >
                  <KeyboardArrowDownRoundedIcon />
                </button>

                <button
                  className="chat-options-button"
                  type="button"
                  aria-label={`Options for ${chat.title}`}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === chat.id}
                  onClick={() => setOpenMenu((current) => (current === chat.id ? null : chat.id))}
                >
                  <MoreHorizRoundedIcon />
                </button>
              </div>

              {openMenu === chat.id && (
                <div className="chat-options-menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => beginEditing(chat)}><EditOutlinedIcon />Edit</button>
                  <button type="button" role="menuitem" onClick={() => requestDeleteChat(chat)}><DeleteOutlineRoundedIcon />Delete</button>
                </div>
              )}

              {expandedChats.includes(chat.id) && (
                <div className="recent-children">
                  <button className={`recent-child ${!isQuizMode ? 'active' : ''}`} type="button" onClick={() => openChat(chat.id)}>
                    Chat
                  </button>
                  {quizUnlocked && (
                    <button className={`recent-child ${isQuizMode ? 'active' : ''}`} type="button" onClick={() => openQuiz(chat.id)}>
                      Quiz
                    </button>
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
            <span className="profile-avatar" aria-hidden="true">
              {username.charAt(0).toUpperCase()}
            </span>
            <span>{username}</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="dashboard-main" aria-label="Main content area">
        {!sidebarOpen && (
          <button
            className="dashboard-icon-button floating-menu"
            type="button"
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <SidebarIcon />
          </button>
        )}
        <button
          className="resources-mobile-button"
          type="button"
          onClick={() => setResourcesOpen(true)}
        >
          Resources
        </button>

        {isQuizMode ? (
          <ConversationQuiz chatId={activeChatId} />
        ) : (
          <ConversationChat
            messages={messages}
            setMessages={setMessages}
            prompt={prompt}
            onPromptChange={(event) => setPrompt(event.target.value)}
            refetchHistory={loadChatHistory}
            onSubmit={submitPrompt}
          />
        )}
      </section>

      <ResourcesPanel
        isOpen={resourcesOpen}
        hasMessages={messages.length > 0}
        onClose={() => setResourcesOpen(false)}
      />

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
              <button className="logout-confirm" type="button" autoFocus onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Dashboard