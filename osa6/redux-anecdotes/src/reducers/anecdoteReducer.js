import { createSlice } from "@reduxjs/toolkit"

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
      state.push(asObject(action.payload))
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { setAnecdotes, voteAnecdote, addAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer