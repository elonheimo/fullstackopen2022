import { useSelector, useDispatch } from 'react-redux'
import { castVoteAnecdote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'
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
    dispatch(castVoteAnecdote(anecdote))
    dispatch(notify(`voted ${anecdote.content}`, 5))
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