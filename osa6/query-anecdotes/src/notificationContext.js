import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  if (action.type === 'NOTIFY') {
    return action.payload
  }
  return state
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotifcationValue = () => useContext(NotificationContext)[0]

export const useNotificationDispatch = () => useContext(NotificationContext)[1]

export default NotificationContext