describe('Post Deletion', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)

    // Intercept login
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        access_token: 'fake-jwt-token',
        token_type: 'bearer',
        expires_in: 3600
      }
    }).as('login')

    cy.intercept('POST', '**/auth/me', {
      statusCode: 200,
      body: { id: 1, first_name: 'Test', role: 'admin' }
    }).as('getUser')

    // Mock initial posts list
    cy.intercept('GET', '**/post-summary', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Post 1', author_name: 'Author 1', category_name: 'Cat 1', created_at: '2026-07-29T12:00:00Z', status: 'published' },
        { id: 2, title: 'Post to Delete', author_name: 'Author 2', category_name: 'Cat 2', created_at: '2026-07-29T12:00:00Z', status: 'draft' }
      ]
    }).as('getPosts')
  })

  it('should delete a post after confirmation', () => {
    cy.visit('/')
    cy.wait(5000) // Aguarda a compilação do Vite
    
    // Perform login
    cy.get('input[name="email"]', { timeout: 30000 }).should('be.visible').type('admin@abertamente.com')
    cy.get('input[name="password"]').should('be.visible').type('password123')
    cy.contains('button', 'Fazer Login').click()
    
    cy.wait('@login')
    cy.wait('@getUser')

    cy.url().should('include', '/admin/dashboard')

    // Navigate to Posts page
    cy.contains('Posts').should('be.visible').click()
    cy.url({ timeout: 15000 }).should('include', '/admin/posts')
    cy.wait('@getPosts')

    cy.contains('tr', 'Post to Delete').contains('button', 'Deletar').click()

    // Double-verification modal should appear
    cy.contains('Tem certeza').should('be.visible')

    // Mock the delete request
    cy.intercept('DELETE', '**/post/2', {
      statusCode: 200,
      body: { success: true }
    }).as('deletePost')

    // Mock the refreshed list after deletion
    cy.intercept('GET', '**/post-summary', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Post 1', author_name: 'Author 1', category_name: 'Cat 1', created_at: '2026-07-29T12:00:00Z', status: 'published' }
      ]
    }).as('getPostsAfterDelete')

    // Confirm deletion
    cy.contains('button', 'Confirmar').click()

    cy.wait('@deletePost')
    cy.wait('@getPostsAfterDelete')

    // Assert that the post is removed from the table
    cy.contains('td', 'Post to Delete').should('not.exist')
  })
})
