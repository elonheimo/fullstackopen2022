import axios from 'axios'
const baseUrl = '/api/blogs'

let authToken = null

const setAuthToken = newAuthToken => {
  authToken = `bearer ${newAuthToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: {Authorization: authToken}
  }
  try {
    
    const response = await axios.post(
      baseUrl, newBlog, config
    )
    return response
  } catch (err) {
    console.log(err)
  }
}

const remove = (id) => {
  const config = {
    headers: {Authorization: authToken}
  }
  const request = axios.delete(
    `${baseUrl}/${id}`,
    config
  )
  return request.then(response => response.data)
}

const update = (id, newBlog) => {
  
  const request = axios.put(
    `${baseUrl}/${id}`,
    newBlog
  )
  return request.then(response => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setAuthToken, create, update, remove}