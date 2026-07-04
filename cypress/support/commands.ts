Cypress.Commands.add('loginAdmin', () => {
  cy.visit('/');
  cy.get('input[type="email"]').type(Cypress.env('NUXT_ADMIN_USER_EMAIL'));
  cy.get('input[type="password"]').type(Cypress.env('NUXT_ADMIN_USER_PASSWORD'));
  cy.get('button[type="submit"]').click();
  
  // Wait until we reach the dashboard (meaning login was successful)
  cy.url().should('include', '/admin');
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginAdmin(): Chainable<void>;
    }
  }
}
