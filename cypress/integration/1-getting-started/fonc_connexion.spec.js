describe('conection', () => {
    it('should successfully authenticate', () => {
        cy.visit('http://localhost:8080/#/login');

        const username = 'test2@test.fr';
        const password = 'testtest';

        cy.get('[data-cy="login-input-username"]').should('exist').should('be.visible').type(username);
        cy.get('[data-cy="login-input-password"]').should('exist').should('be.visible').type(password);
        cy.get('[data-cy="login-submit"]').should('exist').should('be.visible').click();
        cy.get('[data-cy="nav-link-cart"]').should('be.visible').contains('Mon panier');
    });
});