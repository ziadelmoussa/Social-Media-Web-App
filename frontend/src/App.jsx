import { useState, useEffect } from 'react'

function App() {
  const [posts, setPosts] = useState([])
  const [newContent, setNewContent] = useState('')
  
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  // Load posts on startup
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/posts/')
      .then(response => response.json())
      .then(data => setPosts(data))
  }, [])

  // Handle User Login
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
        localStorage.setItem('token', data.token)
        setUsername('')
        setPassword('')
      })
      .catch(err => alert(err.message))
  }

  // Handle Logout
  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
  }

  // Create Post (Requires Token)
  const handleSubmit = (e) => {
    e.preventDefault()

    fetch('http://127.0.0.1:8000/api/posts/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}` // Token attached here
      },
      body: JSON.stringify({ content: newContent }) // Notice: no hardcoded author needed!
    })
      .then(response => response.json())
      .then(newPost => {
        setPosts([newPost, ...posts])
        setNewContent('')
      })
  }

  // Delete Post (Requires Token)
  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(() => {
      setPosts(posts.filter(post => post.id !== id))
    })
  }

  const startEdit = (post) => {
    setEditingId(post.id)
    setEditContent(post.content)
  }

  // Update Post (Requires Token)
  const handleUpdate = (id) => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ content: editContent })
    })
      .then(response => response.json())
      .then(updatedPost => {
        setPosts(posts.map(p => p.id === id ? updatedPost : p))
        setEditingId(null)
      })
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>DevPulse Feed</h1>

      {/* Authentication Bar */}
      {!token ? (
        <form onSubmit={handleLogin} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3>Log In</h3>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ marginRight: '10px', padding: '5px' }}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ marginRight: '10px', padding: '5px' }}
            required 
          />
          <button type="submit" style={{ padding: '5px 15px' }}>Login</button>
        </form>
      ) : (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Logged In</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
        </div>
      )}

      {/* Create Post Form (Only shown if logged in) */}
      {token && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What's on your mind?" 
            style={{ width: '70%', padding: '8px' }}
            required
          />
          <button type="submit" style={{ padding: '8px 16px', marginLeft: '10px' }}>
            Post
          </button>
        </form>
      )}

      {/* Posts Feed */}
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {editingId === post.id ? (
            <div style={{ flexGrow: 1, marginRight: '10px' }}>
              <input 
                type="text" 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)}
                style={{ width: '90%', padding: '5px' }}
              />
              <button onClick={() => handleUpdate(post.id)} style={{ marginLeft: '5px', padding: '5px 10px' }}>Save</button>
              <button onClick={() => setEditingId(null)} style={{ marginLeft: '5px', padding: '5px 10px' }}>Cancel</button>
            </div>
          ) : (
            <div>
              <p style={{ margin: '0 0 10px 0' }}>{post.content}</p>
              <small style={{ color: 'gray' }}>Author ID: {post.author}</small>
            </div>
          )}

          {token && editingId !== post.id && (
            <div>
              <button onClick={() => startEdit(post)} style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(post.id)} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', padding: '5px 10px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  )
}

export default App