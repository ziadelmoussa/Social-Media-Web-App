import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [newContent, setNewContent] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(null)
  
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser') || '')
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  // Fetch posts (Global Feed or Specific User Profile)
  const fetchPosts = () => {
    const url = selectedProfile 
      ? `http://127.0.0.1:8000/api/posts/?author=${selectedProfile}`
      : 'http://127.0.0.1:8000/api/posts/'

    fetch(url, {
      headers: token ? { 'Authorization': `Token ${token}` } : {}
    })
      .then(response => response.json())
      .then(data => setPosts(data))
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedProfile, token])

  const handleLogin = (e) => {
    e.preventDefault()
    fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid credentials')
        return res.json()
      })
      .then(data => {
        setToken(data.token)
        setCurrentUser(username)
        localStorage.setItem('token', data.token)
        localStorage.setItem('currentUser', username)
        setUsername('')
        setPassword('')
      })
      .catch(err => alert(err.message))
  }

  const handleRegister = (e) => {
    e.preventDefault()
    fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          setToken(data.token)
          setCurrentUser(data.username)
          localStorage.setItem('token', data.token)
          localStorage.setItem('currentUser', data.username)
          setUsername('')
          setPassword('')
        }
      })
      .catch(err => alert(err.message))
  }

  const handleLogout = () => {
    setToken('')
    setCurrentUser('')
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch('http://127.0.0.1:8000/api/posts/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ content: newContent })
    })
      .then(response => response.json())
      .then(newPost => {
        if (!selectedProfile || selectedProfile === currentUser) {
          setPosts([newPost, ...posts])
        }
        setNewContent('')
      })
  }

  const handleLike = (id) => {
    if (!token) return alert('Please log in to like posts.')

    fetch(`http://127.0.0.1:8000/api/posts/${id}/like/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(updatedPost => {
        setPosts(posts.map(p => p.id === id ? updatedPost : p))
      })
  }

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(res => {
      if (res.ok) {
        setPosts(posts.filter(post => post.id !== id))
      } else {
        alert("You are not authorized to delete this post.")
      }
    })
  }

  const startEdit = (post) => {
    setEditingId(post.id)
    setEditContent(post.content)
  }

  const handleUpdate = (id) => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ content: editContent })
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized to edit this post")
        return res.json()
      })
      .then(updatedPost => {
        setPosts(posts.map(p => p.id === id ? updatedPost : p))
        setEditingId(null)
      })
      .catch(err => alert(err.message))
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 onClick={() => setSelectedProfile(null)} style={{ cursor: 'pointer' }}>
          DevPulse
        </h1>
        {token && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span 
              className="status-badge" 
              onClick={() => setSelectedProfile(currentUser)}
              style={{ cursor: 'pointer' }}
            >
              ● @{currentUser}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        )}
      </header>

      {/* Profile Header / Navigation Banner */}
      {selectedProfile && (
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Viewing Posts by @{selectedProfile}</h2>
          <button onClick={() => setSelectedProfile(null)} className="btn btn-secondary">
            ← Back to Feed
          </button>
        </div>
      )}

      {/* Auth Form (Login or Register) */}
      {!token && (
        <div className="card auth-card">
          <h3>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h3>
          <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                className="input-field"
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                style={{ flexGrow: 1 }}
              />
              <input 
                className="input-field"
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ flexGrow: 1 }}
              />
              <button type="submit" className="btn btn-primary">
                {isRegistering ? 'Register' : 'Login'}
              </button>
            </div>
          </form>
          <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span 
              onClick={() => setIsRegistering(!isRegistering)} 
              style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegistering ? 'Log In' : 'Sign Up'}
            </span>
          </p>
        </div>
      )}

      {/* Create Post Form */}
      {token && !selectedProfile && (
        <div className="card">
          <form onSubmit={handleSubmit} className="post-form">
            <input 
              className="input-field"
              type="text" 
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Share what you are building..." 
              required
            />
            <button type="submit" className="btn btn-primary">Post</button>
          </form>
        </div>
      )}

      {/* Feed List */}
      {posts.length === 0 ? (
        <div className="card"><p style={{ color: 'var(--text-muted)', margin: 0 }}>No posts found.</p></div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="card post-card">
            {editingId === post.id ? (
              <div className="edit-box">
                <input 
                  className="input-field"
                  type="text" 
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="action-buttons">
                  <button onClick={() => handleUpdate(post.id)} className="btn btn-primary">Save</button>
                  <button onClick={() => setEditingId(null)} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="post-content">
                  <p>{post.content}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span 
                      className="post-author" 
                      onClick={() => setSelectedProfile(post.author)}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Posted by @{post.author}
                    </span>
                    <button 
                      onClick={() => handleLike(post.id)} 
                      className="btn btn-secondary"
                      style={{ padding: '2px 8px', fontSize: '0.85rem' }}
                    >
                      {post.is_liked ? '❤️' : '🤍'} {post.likes_count}
                    </button>
                  </div>
                </div>

                {token && post.author === currentUser && (
                  <div className="action-buttons">
                    <button onClick={() => startEdit(post)} className="btn btn-secondary">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="btn btn-danger">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default App