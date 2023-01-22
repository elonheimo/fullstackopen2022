import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'
const blog = {
  title: 'test title',
  url:'www.testiurl.com',
  likes:10,
  author: 'test author',
  id:'someID1234'
}
test('renders content', () => {
  render(<Blog blog={blog}/>)

  expect(
    screen.getByText('test title')
  ).toBeDefined()

  expect(
    screen.queryByText('10')
  ).toBeNull()

  expect(
    screen.queryByText('www.testiurl.com')
  ).toBeNull()
})

test('Shows all content when "show" is clicked', () => {
  render(<Blog blog={blog}/>)
  userEvent.click(
    screen.getByText('show')
  )
  expect(
    screen.getByText('test title')
  ).toBeDefined()

  expect(
    screen.queryByText('10')
  ).toBeDefined()

  expect(
    screen.queryByText('www.testiurl.com')
  ).toBeDefined()
})

test('Clicking like 2 times calls eventHandle twice', async () => {
  const mockHandler = jest.fn()
  render(<Blog blog={blog} likeBlog={mockHandler} deleteBlog={null} user={null} />)
  await userEvent.click(screen.getByText('show'))
  const likeButton = await screen.findByText('like')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})