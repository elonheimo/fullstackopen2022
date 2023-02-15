import { useMutation, useQueryClient } from "react-query"
import { createAnecdote } from "../requests"

const AnecdoteForm = () => {
  
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation(
    createAnecdote,{
      onSuccess: (newAnecdote) => {
        const anecdotes = queryClient.getQueryData('anecdotes')
        queryClient.setQueryData(
          'anecdotes',
          anecdotes.concat(newAnecdote)
        )
      }}
  )    

  const asObject = (anecdote) => {
    const getId = () => (100000 * Math.random()).toFixed(0)
    return {
      content: anecdote,
      id: getId(),
      votes: 0
    }
  }

  const onCreate = (event) => {
    event.preventDefault()
    const newAnecdote = asObject(event.target.anecdote.value)
    console.log(newAnecdote)
    console.log('current anecdotes', queryClient.getQueryData('anecdotes'))
    newAnecdoteMutation.mutate(newAnecdote)
    event.target.anecdote.value = ''
    console.log('new anecdote')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
