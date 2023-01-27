import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'block'
  }
  const pStyle = {
    margin : 0,
    paddingTop:0,
    marginLeft:10
  }

  const deleteButton = () => {
    if (user && user.username === blog.user.username) {
      return <button onClick={() =>
      {window.confirm(`are u certain you want to delete ${blog.title} by ${blog.author}`)
          && deleteBlog(blog.id)}}>Remove</button>
    }
    return null
  }
  const [showDetails, setShowDetails] = useState(false)
  return(
    <div style={blogStyle} className='blog' data-cy={`blog-info-${blog.title.split(' ').join('') }`}>
      {blog.title}
      {
        showDetails  === false
          ?
          <button onClick={() => setShowDetails(!showDetails)}>show</button>
          :
          <button onClick={() => setShowDetails(!showDetails)}>hide</button>
      }
      {
        showDetails &&
        <div>
          <p style={pStyle}>{blog.url}</p>
          <p style={pStyle}>
            {blog.likes}
            <button onClick={() => likeBlog(blog.id)}>like</button>
          </p>
          <p style={pStyle}>{blog.author}</p>
          {deleteButton()}
        </div>
      }
    </div>
  )
}

export default Blog