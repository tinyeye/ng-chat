describe('App E2E', () => {
  it('should display welcome message', () => {
    cy.visit('/');
    cy.contains('Welcome');
    cy.get('h1').should('contain', 'Welcome');
  });

  it('should have the correct title', () => {
    cy.visit('/');
    cy.title().should('include', 'MyAppAngularTest');
  });
});