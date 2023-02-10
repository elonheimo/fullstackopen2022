/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
import { asObject } from '../reducers/anecdoteReducer'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const response = await axios.post(
    baseUrl,
    asObject(content)
  )
  return response.data
}

const vote = async anecdote => {
  const response = await axios.put(
    `${baseUrl}/${anecdote.id}`,
    {...anecdote, votes : anecdote.votes+1}
  )
  return response.data
} 

export default { getAll, createNew, vote}