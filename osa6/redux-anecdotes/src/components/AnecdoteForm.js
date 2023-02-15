import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const handleCreateAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(notify(content,5))
  }
  return (
    <>
    <h2>create new</h2>
    <form onSubmit={handleCreateAnecdote}>
      <input name="anecdote" />
      <button type="submit">add</button>
    </form>
    </>
  )
}

export default AnecdoteForm