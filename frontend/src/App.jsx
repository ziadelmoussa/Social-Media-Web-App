import { useState, useEffect } from "react";

function App(){

  const [posts, setPosts] = useState([])
  const [newContent, setNewContent] = useState("")

  useEffect(() =>{
    fetch('http://127.0.0.1:8000/api/posts/')
    .then(response => response.json())
    .then(data => setPosts(data))
  },[])



  const handleSubmit = (e) => {
    e.preventDefault()

    const postData = {
      author: 1,
      content: newContent
    }


    fetch('http://127.0.0.1:8000/api/posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    setPosts(posts.filter(posts => posts.id !== id))
  })
  }




  return(
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>DevPulse Feed</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px'}}>
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
        <div key={post.id} style={{border: '1px solid gray', margin: '10px', padding: '10px'}}>
          <div>
            <p>{post.content}</p>
            <small>Author ID: {posts.author}</small>
          </div>

          <button 
            onClick={() => handleDelete(post.id)} 
            style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', padding: '5px 10px', cursor: 'pointer' }}
          >
            Delete
          </button>
        </div> 
      ))}
    </div>
  )
}

export default App