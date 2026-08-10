describe('Post Create - Character Limit Validation', () => {
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

    cy.intercept('GET', '**/author', {
      statusCode: 200,
      body: []
    }).as('getAuthors')

    cy.intercept('GET', '**/category', {
      statusCode: 200,
      body: []
    }).as('getCategories')
  })

  it('should prevent submitting if a footnote or reference exceeds 255 characters', () => {
    cy.visit('/')
    cy.wait(1000)
    
    // Perform login
    cy.get('input[name="email"]', { timeout: 30000 }).should('be.visible').type('admin@abertamente.com')
    cy.get('input[name="password"]').should('be.visible').type('password123')
    cy.contains('button', 'Fazer Login').click()
    
    cy.wait('@login')
    cy.wait('@getUser')

    // Navigate to Create Post page
    cy.contains('Posts').should('be.visible').click()
    cy.url({ timeout: 15000 }).should('include', '/admin/posts')
    cy.contains('a', 'Criar Novo post').should('be.visible').click()
    cy.url({ timeout: 15000 }).should('include', '/admin/posts/create')

    // Add Reference and type > 255 characters
    cy.contains('button', 'Adicionar Nova Referência').click()
    const longText = 'a'.repeat(256)
    cy.get('textarea[name="description"]').eq(0).should('be.visible').type(longText, { delay: 0 })

    // Add Footnote and type > 255 characters
    cy.contains('button', 'Adicionar Nova Nota de Rodapé').click()
    cy.get('textarea[name="description"]').eq(1).should('be.visible').type(longText, { delay: 0 })

    // Try to submit the form
    cy.contains('button', 'Salvar Post').click()

    // Assert validation errors
    cy.contains('A referência não pode ter mais de 255 caracteres').should('be.visible')
    cy.contains('A nota de rodapé não pode ter mais de 255 caracteres').should('be.visible')
  })
})
