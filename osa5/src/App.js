import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogUser')
    if (userJSON) {
      const userObj = JSON.parse(userJSON)
      setUser(userObj)
      blogService.setAuthToken(userObj.token)
    }
  }, [])
  const newNotification = message => {
    setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
  }
  const handleLogin = async (loginEvent) => {
    loginEvent.preventDefault()
    try {
      const user = await loginService.login(
        {username, password}
      )
      console.log(JSON.stringify(user))
      setUser(user)
      blogService.setAuthToken(user.token)
      window.localStorage.setItem(
        'blogUser', JSON.stringify(user)
      )
      setUsername("")
      setPassword("")
    } catch {
      setErrorMessage('ERROR: wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 1000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
      </div>
      password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
      <div>
        <button type="submit">LOGIN</button>
      </div>
    </form> 
  )

  const handleLogout = async (logoutEvent) => {
    setUser(null)
    window.localStorage.clear()
  }

  const logoutButton = () => (
    <div>
      <button onClick={handleLogout}>LOGOUT</button>
    </div>
  )
  
  const addBlog = (addBlogEvent) => {
    addBlogEvent.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url,
      likes: likes,
      user: JSON.stringify(user.id)
    }
    blogService
      .create(newBlog)
      .then(returnedBlog => {
        const data = returnedBlog.data
        newNotification(`Added new blog. ${data.title} by ${data.author}` )
        console.log(`${JSON.stringify(returnedBlog.data)}`)
        setTitle('')
        setAuthor('')
        setUrl('')
        setLikes(0)
      })
      .catch(err => {
        newNotification('fill all fields')
      })
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
      </div>
      <div>
        author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
      </div>
      <div>
        url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
      </div>
      <div>
        likes:
          <input
            type="number"
            value={likes}
            name="likes"
            onChange={({ target }) => setLikes(target.value)}
          />
      </div>
      <button type="submit">save</button>
    </form>
  )

  const Notification = ({ message }) => {
    return message === null
      ? null
      : (
        <div className='notification'>
          {message}
        </div>
        )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />

      {user === null 
        ? loginForm() 
        : <div>
            <p>{user.name} logged in</p>
            {blogForm()}
            {logoutButton()}
           </div>
      }

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
