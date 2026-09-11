import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import mentoraOwlLogo from '../../assets/mentora-owl-logo.png'
import ConversationChat from '../../components/dashboard/ConversationChat'
import ResourcesPanel from '../../components/dashboard/ResourcesPanel'
import { NewChatIcon, SidebarIcon } from '../../components/dashboard/DashboardIcons'
import { Settings } from '../Settings'
import {fetchGetChatSessions,fetchGetChatHistoryApi,updateChatTitleApi,deleteChatApi,fetchInitializeChatApi,fetchSendMessageApi,
} from '../../api/chatApi'
import './Dashboard.css'
import { useAuth } from '../../context/AuthContext'
import { getUser } from '../../api/userApi'

function Dashboard() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { chatId: activeChatId } = useParams()

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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [username, setUsername] = useState(user?.name || 'Kira')
  const [userInfo, setUserInfo] = useState(null)

  const menuRef = useRef(null)
  const profileMenuRef = useRef(null)

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

  useEffect(() => {
  let isMounted = true

  const fetchUserProfile = async () => {
    try {
      const data = await getUser()
      if (isMounted && data) {
        setUserInfo(data)
        const fetchedName =  data.name
        if (fetchedName) {
          setUsername(fetchedName)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  fetchUserProfile()

  return () => {
    isMounted = false
  }
}, [])
  const handleLogout = async () => {
    setProfileMenuOpen(false)
    await logout()
  }

  // Fetch recent chat sessions list
  const loadChatSessions = async () => {
    try {
      const data = await fetchGetChatSessions()
      if (!data) return

      const sessionObjects = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            title: item.title || item.name || 'Untitled Chat',
          }))
        : []

      setChats(sessionObjects)
    } catch (error) {
      console.error('Failed to load chat sessions:', error)
    }
  }

  // 1. Fetch recent chat sessions list on mount
  useEffect(() => {
    let isMounted = true

    const initSessions = async () => {
      if (isMounted) await loadChatSessions()
    }

    initSessions()

    return () => {
      isMounted = false
    }
  }, [])

  // 2. Fetch active chat message history directly when activeChatId changes in URL
  useEffect(() => {
    if (!activeChatId) {
      setMessages([])
      setPrompt('')
      return
    }

    let isMounted = true
    const loadChatHistory = async () => {
      try {
        const data = await fetchGetChatHistoryApi(activeChatId)
        if (!isMounted || !data) return

        const rawMessages = Array.isArray(data) ? data : data.messages || []
        setMessages(rawMessages)
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }

    loadChatHistory()

    return () => {
      isMounted = false
    }
  }, [activeChatId])

  // Context menu click backdrop handler
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

  // Responsive sidebar toggle
  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 720px)')
    const handleViewportChange = (event) => {
      setSidebarOpen(!event.matches)
      if (!event.matches) setResourcesOpen(false)
    }

    mobileQuery.addEventListener('change', handleViewportChange)
    return () => mobileQuery.removeEventListener('change', handleViewportChange)
  }, [])

  
  // Handle submitting prompts for both new and existing chats
  const submitPrompt = async (event) => {
    event.preventDefault()
    const text = prompt.trim()
    if (!text) return

    // Add user message to UI immediately
    setMessages((current) => [...current, { role: 'user', content: text }])
    setPrompt('')

    try {
      if (!activeChatId) {
        // 1. INITIALIZE NEW CHAT
        const data = await fetchInitializeChatApi(text)

        const newChatId = data.id || data.chat_id || data.chatId
        const assistantReply = data.response || data.message || data.reply

        if (assistantReply) {
          setMessages((current) => [
            ...current,
            { role: 'assistant', content: assistantReply },
          ])
        }

        // Refresh recent chats list in sidebar
        await loadChatSessions()

        // Navigate to the newly created chat session
        if (newChatId) {
          setExpandedChats([newChatId])
          navigate(`/app/${newChatId}`)
        }
      } else {
        // 2. SEND MESSAGE TO EXISTING CHAT
        const data = await fetchSendMessageApi(activeChatId, text)

        const assistantReply =
          data.response || data.message || data.reply || data.content

        if (assistantReply) {
          setMessages((current) => [
            ...current,
            { role: 'assistant', content: assistantReply },
          ])
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ])
    }
  }

  const startNewChat = () => {
    setMessages([])
    setPrompt('')
    setExpandedChats([])
    navigate('/app')
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  // Select chat from Recent list
  const openChat = (chatId) => {
    navigate(`/app/${chatId}`)
    setExpandedChats([chatId])
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  const openQuiz = (chatId) => {
    navigate(`/app/quiz/${chatId}`)
    if (window.matchMedia('(max-width: 720px)').matches) setSidebarOpen(false)
  }

  // Accordion toggle: opening one group closes all others
  const toggleChat = (chatId) => {
    setExpandedChats((current) =>
      current.includes(chatId) ? [] : [chatId]
    )
  }

  // Start editing mode for title
  const beginEditing = (chat) => {
    setEditingChatId(chat.id)
    setEditValue(chat.title)
    setOpenMenu(null)
  }

  // 5. UPDATE CHAT TITLE
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

  // 6. DELETE CHAT SESSION
  const deleteChat = async (chatId) => {
    try {
      await deleteChatApi(chatId)

      // Update sidebar state
      setChats((current) => current.filter((item) => item.id !== chatId))
      setExpandedChats((current) => current.filter((id) => id !== chatId))

      // If active chat was deleted, reset back to new chat screen
      if (String(activeChatId) === String(chatId)) {
        startNewChat()
      }
    } catch (error) {
      console.error('Failed to delete chat session:', error)
    } finally {
      setOpenMenu(null)
    }
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
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats"
            aria-label="Search chats"
          />
        </label>
        <section className="recent-chats" aria-labelledby="recent-title">
          <h2 id="recent-title">Recent</h2>
          {visibleChats.map((chat) => (
            <div
              className={`recent-group ${activeChatId === String(chat.id) ? 'active' : ''}`}
              key={chat.id}
              ref={openMenu === chat.id ? menuRef : null}
            >
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
                  <button type="button" role="menuitem" onClick={() => beginEditing(chat)}>
                    <EditOutlinedIcon /> Edit
                  </button>
                  <button type="button" role="menuitem" onClick={() => deleteChat(chat.id)}>
                    <DeleteOutlineRoundedIcon /> Delete
                  </button>
                </div>
              )}

              {expandedChats.includes(chat.id) && (
                <div className="recent-children">
                  <button className="recent-child" type="button" onClick={() => openChat(chat.id)}>
                    Chat
                  </button>
                  <button className="recent-child" type="button" onClick={() => openQuiz(chat.id)}>
                     Quiz
                  </button>
                </div>
              )}
            </div>
          ))}
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
              <button type="button" role="menuitem" onClick={handleLogout}>
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

      <section className="dashboard-main" aria-label="Chat with Mentora">
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
        <ConversationChat
          messages={messages}
          prompt={prompt}
          onPromptChange={(event) => setPrompt(event.target.value)}
          onSubmit={submitPrompt}
        />
      </section>

      <ResourcesPanel
        isOpen={resourcesOpen}
        hasMessages={messages.length > 0}
        onClose={() => setResourcesOpen(false)}
      />

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        username={username}
        onUsernameChange={setUsername}
      />
    </main>
  )
}

export default Dashboard