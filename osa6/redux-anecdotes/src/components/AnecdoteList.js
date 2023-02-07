import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer'
const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    console.log('filter', filter, 'anecdotes', anecdotes)
    return (filter === ''
      ? anecdotes
      : anecdotes.filter(
        anecdote => anecdote.content.includes(filter)
      )
    )
  })
  const dispatch = useDispatch()
  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(voteAnecdote(anecdote.id))
    dispatch(notificationChange(`voted ${anecdote.content}`))
    setTimeout(() => {
      dispatch(notificationChange(''))
    }, 5000)
  }

  return (
    <div>

      <h2>Anecdotes</h2>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        )}
    
    </div>
  )
}

export default AnecdoteList