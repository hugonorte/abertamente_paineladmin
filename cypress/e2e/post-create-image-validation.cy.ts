describe('Post Create - Image Validation', () => {
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

  it('should prevent uploading a GIF image due to backend constraints', () => {
    cy.visit('/')
    cy.wait(3000)
    
    // Perform login
    cy.get('input[name="email"]', { timeout: 30000 }).should('be.visible').type('admin@abertamente.com')
    cy.get('input[name="password"]').should('be.visible').type('password123')
    cy.contains('button', 'Fazer Login').click()
    
    cy.wait('@login')
    cy.wait('@getUser')

    // Navigate to Create Post page via client-side routing
    cy.contains('Posts').should('be.visible').click()
    cy.url({ timeout: 15000 }).should('include', '/admin/posts')
    cy.contains('a', 'Criar Novo post').should('be.visible').click()
    cy.url({ timeout: 15000 }).should('include', '/admin/posts/create')

    // Fill minimum required fields except image
    cy.get('input[name="title"]').type('Post with GIF')
    cy.get('textarea[name="tldr"]').type('This is a summary')

    // For the file upload, we mock a file drop or use cypress-file-upload if installed.
    // Instead of actual upload, since it's a UFileUpload (input type="file"), we can use selectFile
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake image content'),
      fileName: 'moeda.gif',
      mimeType: 'image/gif'
    }, { force: true })

    // Try to submit the form
    cy.contains('button', 'Salvar Post').click() // Assuming the submit button is there or maybe it's onSubmit trigger

    cy.contains('Formato de imagem não permitido').scrollIntoView().should('be.visible')
  })
})
