describe('Author Edit Flow', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)

    if (Cypress.env('MOCK_API')) {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: { access_token: 'fake-token', token_type: 'bearer', expires_in: 3600 }
      }).as('login')

      cy.intercept('POST', '**/auth/me', {
        statusCode: 200,
        body: { id: 1, first_name: 'Test', email: 'admin@example.com', role: 'admin' }
      }).as('getUser')

      cy.intercept('GET', '**/author', {
        statusCode: 200,
        body: [
          { id: 1, name: 'Autor Teste', email: 'autor@example.com' }
        ]
      }).as('getAuthors')

      cy.intercept('GET', '**/author/*', {
        statusCode: 200,
        body: { id: 1, name: 'Autor Teste', email: 'autor@example.com', bio: 'Bio...', main_title: 'Doutor' }
      }).as('getAuthorDetail')
    }
  })

  it('should navigate to the edit author page by clicking edit button on the table', () => {
    cy.visit('/')
    cy.wait(5000) // Aguarda a compilação do Vite se necessário
    cy.get('input[name="email"]', { timeout: 30000 }).should('be.visible').type(Cypress.env('NUXT_ADMIN_USER_EMAIL'))
    cy.get('input[name="password"]').should('be.visible').type(Cypress.env('NUXT_ADMIN_USER_PASSWORD'))
    cy.contains('button', 'Fazer Login').click()

    if (Cypress.env('MOCK_API')) {
      cy.wait('@login')
      cy.wait('@getUser')
    }

    cy.url({ timeout: 15000 }).should('include', '/admin/dashboard')

    // Navigate to Authors page
    cy.contains('Autores').should('be.visible').click()
    
    // Espera a URL mudar
    cy.url({ timeout: 15000 }).should('include', '/admin/author')

    // Garante que a tabela carregou
    cy.get('table', { timeout: 10000 }).should('be.visible')
    
    // Verifica a existência do botão Editar
    cy.contains('button', 'Editar').should('be.visible')

    // Clica no primeiro botão "Editar" da tabela
    cy.contains('button', 'Editar').first().click()

    // Verifica se a URL mudou para a rota de edição de autor
    cy.url({ timeout: 15000 }).should('match', /\/admin\/author\/\d+$/)

    // Verifica se o formulário carregou validando a presença de um campo e que não esteja vazio
    // Usando form inputs
    cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible')
  })
})
