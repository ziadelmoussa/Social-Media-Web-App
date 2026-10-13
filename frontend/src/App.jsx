import { useState, useEffect } from "react";

function App(){

  const [posts, setPosts] = useState([])

  useEffect(() =>{
    fetch('http://127.0.0.1:8000/api/posts/')
    .then(response => response.json())
    .then(data => setPosts(data))
  },[])

  return(
    <div>
      <h1>DevPulse Feed</h1>

      {posts.map(post => (
        <div key={post.id} style={{border: '1px solid gray', margin: '10px', padding: '10px'}}>
          <p>{post.content}</p>
          <small>Author ID: {posts.author}</small>
        </div>
            ))}
    </div>
  )
}

export default App