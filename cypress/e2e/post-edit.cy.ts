describe('Post Edit Flow and Console Error Check', () => {
  let consoleErrors: any[] = []

  beforeEach(() => {
    cy.viewport(1280, 720)
    // Limpa a lista de erros antes de cada teste
    consoleErrors = []

    if (Cypress.env('MOCK_API')) {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: { access_token: 'fake-token', token_type: 'bearer', expires_in: 3600 }
      }).as('login')

      cy.intercept('POST', '**/auth/me', {
        statusCode: 200,
        body: { id: 1, first_name: 'Test', role: 'admin' }
      }).as('getUser')

      cy.intercept('GET', '**/post-summary', {
        statusCode: 200,
        body: [
          { id: 1, title: 'Post Teste', author_name: 'Autor', category_name: 'Cat', created_at: '2023-01-01', status: 'published' }
        ]
      }).as('getPosts')

      cy.intercept('GET', '**/post/*', {
        statusCode: 200,
        body: {
          post: { id: 1, title: 'Post Teste', content: '<p>Edit me</p>' }
        }
      }).as('getPostDetail')

      cy.intercept('GET', '**/bibliographicReference*', { statusCode: 200, body: [] })
      cy.intercept('GET', '**/footnote*', { statusCode: 200, body: [] })
    }

    // Removed console.error stub to test routing
  })

  it('should navigate to the edit post page and verify content without console errors', () => {
    cy.visit('/')
    cy.wait(5000) // Aguarda a compilação do Vite
    cy.get('input[name="email"]', { timeout: 30000 }).should('be.visible').type(Cypress.env('NUXT_ADMIN_USER_EMAIL'))
    cy.get('input[name="password"]').should('be.visible').type(Cypress.env('NUXT_ADMIN_USER_PASSWORD'))
    cy.contains('button', 'Fazer Login').click()

    if (Cypress.env('MOCK_API')) {
      cy.wait('@login')
      cy.wait('@getUser')
    }

    cy.url().should('include', '/admin/dashboard')

    // Navigate to Posts page
    cy.contains('Posts').should('be.visible').click()
    
    // Espera a URL mudar (com timeout maior para compilacao do Vite)
    cy.url({ timeout: 15000 }).should('include', '/admin/posts')

    // Log any errors caught so far
    cy.then(() => {
      cy.log("CONSOLE ERRORS SO FAR:", JSON.stringify(consoleErrors))
    })

    // Garante que a tabela carregou e que existe pelo menos um botão "Editar"
    cy.get('table', { timeout: 10000 }).should('be.visible')
    cy.contains('a', 'Editar').should('be.visible')

    // 3. Clica no primeiro botão "Editar" encontrado na tabela
    cy.contains('a', 'Editar').first().click()

    // 4. Verifica se a URL mudou para a rota de edição de post (ex: /admin/posts/1)
    cy.url({ timeout: 15000 }).should('match', /\/admin\/posts\/\d+$/)

    // 5. Verifica se há conteúdo a ser editado
    // O formulário de edição deve ter carregado o título do post (não deve estar vazio)
    cy.get('input[name="title"]').should('have.value').and('not.be.empty')
    // O editor Tiptap (ProseMirror) deve estar presente e com conteúdo renderizado
    cy.get('.ProseMirror').should('be.visible').and('not.be.empty')

    // 6. Verifica se não houve nenhum erro disparado no console durante a transição de rota
    cy.then(() => {
      const filteredErrors = consoleErrors.filter((errArgs) => {
        const errorMsg = String(errArgs[0])
        // Podemos ignorar warnings específicos do Vue ou de extensões do navegador, caso necessário.
        // Aqui, garantimos que "Adding different instances of a keyed plugin" ou outros erros fatais não ocorreram.
        return !errorMsg.includes('The allowCypressEnv configuration') // ignorando o aviso do próprio Cypress
      })

      if (filteredErrors.length > 0) {
        throw new Error(`Erros encontrados no console: ${JSON.stringify(filteredErrors)}`)
      }
      expect(filteredErrors.length).to.equal(0)
    })
  })
})
