import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer'
import anecdoteServise from '../services/anecdotes'
const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const createAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    await anecdoteServise.createNew(content)
    dispatch(addAnecdote(content))
    dispatch(notificationChange(
      `created new anecdote ${content}`
    ))
    setTimeout(() => {
      dispatch(notificationChange(''))
    }, 5000)
  }
  return (
    <>
    <h2>create new</h2>
    <form onSubmit={createAnecdote}>
      <input name="anecdote" />
      <button type="submit">add</button>
    </form>
    </>
  )
}

export default AnecdoteForm