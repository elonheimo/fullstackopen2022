import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'
import anecdoteServise from './services/anecdotes'
import { setAnecdotes } from './reducers/anecdoteReducer'
const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    anecdoteServise
      .getAll()
      .then(anecdotes => {
        dispatch(setAnecdotes(anecdotes))
      })
  }, [dispatch])
  return (
    <div>
      <Notification />
      <AnecdoteForm />
      <Filter />
      <AnecdoteList />
    </div>
  )
}

export default App