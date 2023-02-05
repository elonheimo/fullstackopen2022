import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
const AddAnecdote = () => {
  const dispatch = useDispatch()
  const createAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
  }
  return (
    <form onSubmit={createAnecdote}>
      <input name="anecdote" />
      <button type="submit">add</button>
    </form>
  )
}

export default AddAnecdote