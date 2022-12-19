import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
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
  const blogFormRef = useRef()
  
  const likeBlog = id => {
    const blog = blogs.find(blog => blog.id === id)
    const likedBlog = {...blog, likes: blog.likes+1}
    likedBlog.user = likedBlog.user.id
    blogService
      .update(id, likedBlog)
      .then(() => {
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        ) 
      })
  }

  const deleteBlog = id => {
    blogService
      .remove(id)
      .then(() => {
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        ) 
      })
  }

  const addBlog = (newBlog) => {
    newBlog.user = JSON.stringify(user.id)
    blogService
    .create(newBlog)
    .then(returnedBlog => {
        const data = returnedBlog.data
        newNotification(`Added new blog. ${data.title} by ${data.author}` )
        console.log(`${JSON.stringify(returnedBlog.data)}`)
        blogFormRef.current.toggleVisibility()

        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        ) 
      })
      .catch(err => {
        newNotification('fill all fields')
        return false
      })
    return true
  }

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
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm addBlog={addBlog} />
            </Togglable>
            {logoutButton()}
           </div>
      }
      {console.log(JSON.stringify(user))}
      {blogs.sort((a,b) => a.likes >= b.likes ? -1 : 1).map(blog =>
        <Blog 
        key={blog.id} 
        blog={blog} 
        likeBlog={likeBlog} 
        deleteBlog={deleteBlog} 
        user={(user)}
        />
      )}
    </div>
  )
}

export default App
