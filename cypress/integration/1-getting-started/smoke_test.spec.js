
describe('Authentication and Product Test', () => {
    it('should successfully authenticate, navigate to the cart, add a product to the cart', () => {
        cy.visit('http://localhost:8080/#/');
        cy.get('[data-cy="nav-link-login"]').should('exist').should('be.visible').click();
        const username = 'test2@test.fr';
        const password = 'testtest';
        cy.get('[data-cy="login-input-username"]').should('exist').should('be.visible').type(username);
        cy.get('[data-cy="login-input-password"]').should('exist').should('be.visible').type(password);
        cy.get('[data-cy="login-submit"]').should('exist').should('be.visible').click();
        cy.wait(1000);
        cy.get('[data-cy="nav-link-cart"]').should('be.visible').contains('Mon panier');
        cy.visit('http://localhost:8080/#/products');
        cy.wait(1000);
        cy.url().should('include', '/products');
        cy.get('[data-cy="nav-link-products"]').should('exist').should('be.visible').contains('Produits');
        cy.get('[data-cy="product-link"]').should('exist').should('be.visible').first().click();
        cy.wait(1000);
        cy.get('[data-cy="detail-product-stock"]').should('exist').should('be.visible');
        cy.get('[data-cy="detail-product-add"]').should('exist').should('be.visible').wait(1000).click();
        cy.get('[data-cy="cart-total"]').should('exist').should('be.visible');
    });
});










