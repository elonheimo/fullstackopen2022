import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)

  const handleAddBlog = (event) => {
    event.preventDefault()
    addBlog({
      title: title,
      author: author,
      url: url,
      likes: likes,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes(0)
  }
  return (
    <form onSubmit={handleAddBlog}>
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
}
export default BlogForm