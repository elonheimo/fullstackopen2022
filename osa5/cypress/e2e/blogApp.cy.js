/* eslint-disable jest/expect-expect */
describe('Blog', function () {
  const user = {
    name: 'Johannes Elonheimo',
    username: 'johis',
    password: 'salainen'
  }
  let authToken
  const blogs = [{
    title: 'init title',
    author: 'init author',
    url: 'www.defaultURL.com',
    likes: '1337'
  }, {
    title: '3rd by likes',
    author: 'init author',
    url: 'www.defaultURL.com',
    likes: '2000'
  }, {
    title: '2nd by likes',
    author: 'init author',
    url: 'www.defaultURL.com',
    likes: '3000'
  }, {
    title: '1st by likes',
    author: 'init author',
    url: 'www.defaultURL.com',
    likes: '4000'
  }]
  const createBlogAndRefreshPage = (blogToCreate) => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3003/api/blogs/',
      auth: { bearer: authToken },
      body: blogToCreate
    })
    cy.visit('http://localhost:3000')
  }
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    cy.request('POST', 'http://localhost:3003/api/users/', user)
    // eslint-disable-next-line no-unused-vars
    const { name, ...loginParams } = blogs[0]
    cy.request('POST', 'http://localhost:3003/api/login/',
      { username: user.username, password: user.password }
    ).then(
      (response) => {
        // response.body is automatically serialized into JSON
        authToken = response.body.token // true
      }
    )

    cy.visit('http://localhost:3000')
  })
  it('login form is open', function () {
    cy.contains('username')
    cy.contains('password')
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name="Username"]').type(user.username)
      cy.get('input[name="Password"]').type(user.password)
      cy.contains('LOGIN').click()
      cy.contains('Johannes Elonheimo logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input[name="Username"]').type('adfads')
      cy.get('input[name="Password"]').type('adfdasfdasfas')
      cy.contains('LOGIN').click()
      cy.contains('ERROR: wrong credentials')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: user.username, password: user.password })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('input[name="Title"]').type('blog title')
      cy.get('input[name="author"]').type('blog author')
      cy.get('input[name="url"]').type('www.url.com')
      cy.get('input[name="likes"]').type(100)
      cy.contains('save').click()
      cy.contains('blog title')
    })

    describe('When a blogs are created', function () {
      beforeEach(function () {
        blogs.forEach(blog => createBlogAndRefreshPage(blog))
      })

      it('A blog can be liked', function () {
        const blog = blogs[0]
        cy.get(`[data-cy="blog-info-${blog.title.split(' ').join('')}"]`)
          .within(() => {
            cy.contains('show').click()
            cy.contains(blog.likes)
            cy.contains('like').click()
            cy.contains((parseInt(blog.likes)+1).toString())
          })
      })
      it('A blog can be deleted', function () {
        const blog = blogs[0]
        cy.get(`[data-cy="blog-info-${blog.title.split(' ').join('')}"]`)
          .within(() => {
            cy.contains('show').click()
            cy.contains('Remove').click()
          })
        cy.get(`[data-cy="blog-info-${blog.title.split(' ').join('')}"]`).should('not.exist')
      })
      it('Blogs are ordered by likes', function () {
        cy.get('.blog').eq(0).should('contain', blogs[3].title)
        cy.get('.blog').eq(1).should('contain', blogs[2].title)
        cy.get('.blog').eq(2).should('contain', blogs[1].title)
      })
    })
  })
})