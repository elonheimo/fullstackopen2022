describe('Blog', function () {
  const user = {
    name: 'Johannes Elonheimo',
    username: 'johis',
    password: 'salainen'
  }
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    cy.request('POST', 'http://localhost:3003/api/users/', user)
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
      cy.get('input[name="Title"]').type("blog title")
      cy.get('input[name="author"]').type("blog author")
      cy.get('input[name="url"]').type("www.url.com")
      cy.get('input[name="likes"]').type(100)
      cy.contains('save').click()
      cy.contains('blog title')
    })
  })
})