
describe('Avis Depassement Test', () => {
    it('should successfully authenticate, create avis', () => {
        cy.visit('http://localhost:8080/#/login');

        const username = 'test2@test.fr';
        const password = 'testtest';

        cy.get('[data-cy="login-input-username"]').should('exist').should('be.visible').type(username);
        cy.get('[data-cy="login-input-password"]').should('exist').should('be.visible').type(password);
        cy.get('[data-cy="login-submit"]').should('exist').should('be.visible').click();
        cy.get('[data-cy="nav-link-cart"]').should('be.visible').contains('Mon panier');
        cy.visit('http://localhost:8080/#/reviews');
        cy.get('[data-cy="review-input-rating-images"] img').eq(2).click();
        const fiftyCharacters = 'a'.repeat(50);
        cy.get('[data-cy="review-input-title"]').type(fiftyCharacters);
        cy.get('[data-cy="review-input-comment"]').type(fiftyCharacters);
        cy.get('[data-cy="review-submit"]').click();
        cy.log('Monitoring the size of the title and comment relative to the block!');

    });
});
