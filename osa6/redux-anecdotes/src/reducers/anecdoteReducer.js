import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state.map((anecdote) => {
        return (anecdote.id === action.payload
          ? {
            ...anecdote,
            votes: anecdote.votes + 1
          }
          : anecdote)
      })
    },
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const castVoteAnecdote = anecdote => {
  return async dispatch => {
    try {
      const votedAnecdote = await anecdoteService.vote(anecdote)
      dispatch(voteAnecdote(votedAnecdote.id))
    } catch (error){
      console.log('failed voting :', error)
    }
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addAnecdote(newAnecdote))
  }
}

export const { setAnecdotes, voteAnecdote, addAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer