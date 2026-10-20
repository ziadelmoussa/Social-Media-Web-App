import { useState, useEffect } from 'react'

function App() {
  const [posts, setPosts] = useState([])
  const [newContent, setNewContent] = useState('')
  
  // States for tracking editing
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/posts/')
      .then(response => response.json())
      .then(data => setPosts(data))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const postData = { author: 1, content: newContent }

    fetch('http://127.0.0.1:8000/api/posts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(newPost => {
        setPosts([newPost, ...posts])
        setNewContent('')
      })
  }

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: 'DELETE',
    }).then(() => {
      setPosts(posts.filter(post => post.id !== id))
    })
  }

  // Start editing mode for a post
  const startEdit = (post) => {
    setEditingId(post.id)
    setEditContent(post.content)
  }

  // Save the updated post (PUT request)
  const handleUpdate = (id) => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 1, content: editContent })
    })
      .then(response => response.json())
      .then(updatedPost => {
        // Swap out the old post with the updated one in state
        setPosts(posts.map(p => p.id === id ? updatedPost : p))
        setEditingId(null)
      })
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>DevPulse Feed</h1>

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
      
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {editingId === post.id ? (
            /* Editing view */
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
            /* Standard view */
            <div>
              <p style={{ margin: '0 0 10px 0' }}>{post.content}</p>
              <small style={{ color: 'gray' }}>Author ID: {post.author}</small>
            </div>
          )}

          {editingId !== post.id && (
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