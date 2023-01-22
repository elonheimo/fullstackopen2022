import '@testing-library/jest-dom/extend-expect'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const addBlog = jest.fn()

  render(<BlogForm addBlog={addBlog} />)
  screen.debug()
  const getInputField = (text) => {
    const view = screen.getByText(text)
    return within(view).getByRole('textbox')
  }

  await userEvent.type(
    getInputField('title:'),
    'test title'
  )
  await userEvent.type(
    getInputField('author:'),
    'test author'
  )
  await userEvent.type(
    getInputField('url:'),
    'www.testurl.com'
  )
  await userEvent.type(
    screen.getByRole('spinbutton'),
    '10'
  )
  const sendButton = screen.getByText('save')
  await userEvent.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  console.log(
    addBlog.mock.calls[0][0]
  )
  expect(addBlog.mock.calls[0][0]).toStrictEqual({
    title: 'test title',
    author: 'test author',
    url: 'www.testurl.com',
    likes: '10'
  })
})