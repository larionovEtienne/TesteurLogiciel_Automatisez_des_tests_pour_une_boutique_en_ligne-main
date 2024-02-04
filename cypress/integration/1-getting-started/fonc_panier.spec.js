import '../../support/commands';
describe('Authentication and Product Test', () => {
    beforeEach(() => {
        cy.authenticate();
    });
    it('should successfully authenticate, navigate to the cart, and find a product with stock > 1', () => {
        cy.visit('http://localhost:8080/#/login');

        const username = 'test2@test.fr';
        const password = 'testtest';

        cy.get('[data-cy="login-input-username"]').should('exist').should('be.visible').type(username);
        cy.get('[data-cy="login-input-password"]').should('exist').should('be.visible').type(password);
        cy.get('[data-cy="login-submit"]').should('exist').should('be.visible').click();
        cy.get('[data-cy="nav-link-cart"]').should('be.visible').contains('Mon panier');
        cy.visit('http://localhost:8080/#/products');

        function findProduct(index) {
            // Find product links
            cy.get('[data-cy="product-link"]').then(($products) => {
                if (index >= $products.length) {
                    // No more products to check
                    cy.log('No more products with stock greater than 1 found.');
                    return;
                }
                cy.wrap($products[index]).click();
                cy.wait(1000); // Adjust the wait time as needed
                cy.get('[data-cy="detail-product-stock"]').then(($stock) => {
                    const stockValue = parseInt($stock.text());
                    if (stockValue > 1) {
                        // Perform additional actions, e.g., add the product to the cart
                        cy.log('Product found with stock greater than 1. Adding to cart.');
                        cy.get('[data-cy="detail-product-add"]').click();

                        // Capture the product ID after adding to the cart
                        cy.url().then((url) => {
                            const productId = url.split('/').pop();
                            // Store the product ID for later use
                            Cypress.env('productId', productId);
                            // Get the initial stock value
                            const initialStock = stockValue;
                            cy.visit('http://localhost:8080/#/cart');
                            cy.wait(2000);
                            // Perform assertions on the cart page
                            cy.get('[data-cy="cart-line-image"]').should('exist');
                            // Return to the product page using the captured product ID
                            cy.visit(`http://localhost:8080/#/products/${Cypress.env('productId')}`);
                            // Check that the stock on the product page has decreased by 1
                            cy.contains('[data-cy="detail-product-stock"]', /\d+ en stock/).invoke('text').then((stockText) => {
                                const matchResult = stockText.match(/\d+/);
                                if (matchResult) {
                                    const currentStock = parseInt(matchResult[0]);
                                    cy.log('Current Stock:', currentStock);
                                    cy.log('Expected Stock:', initialStock - 1);
                                    cy.wrap(currentStock).should('eq', initialStock - 1);
                                    let currentUrl;
                                    cy.location().then((loc) => {
                                        currentUrl = loc.href;
                                    });
                                    cy.get('[data-cy="detail-product-quantity"]').clear().type('-1');
                                    cy.get('[data-cy="detail-product-add"]').click();
                                    cy.location().should((loc) => {
                                        expect(loc.href).to.equal(currentUrl);
                                    });
                                    cy.get('[data-cy="detail-product-quantity"]').clear().type('22');
                                    cy.get('[data-cy="detail-product-add"]').click();
                                    cy.contains('Validez votre commande').should('exist');

                                        const yourAuthToken = Cypress.env('authToken');
                                        expect(yourAuthToken).to.exist.and.not.be.empty;

                                        cy.request({
                                            method: 'GET',
                                            url: 'http://localhost:8081/orders',
                                            headers: {
                                                Authorization: `Bearer ${yourAuthToken}`,
                                            },
                                        }).then((cartResponse) => {
                                            expect(cartResponse.status).to.eq(200);
                                            expect(cartResponse.body).to.have.property('orderLines').that.is.an('array');
                                            expect(cartResponse.body.orderLines).to.not.be.empty;

                                            cartResponse.body.orderLines.forEach((orderLine, index) => {
                                                const productId = orderLine.product.id;
                                                const productName = orderLine.product.name;
                                                const quantity = orderLine.quantity;
                                                cy.log(`Product ${index + 1}: ID - ${productId}, Name - ${productName}, Quantity - ${quantity}`);
                                            });
                                        });

                                } else {
                                    cy.log('Stock information not found on the page.');
                                }
                            });

                        });
                        return;
                    }
                    // If stock is not greater than 1, go back to the products page
                    cy.go('back').then(() => {
                        // Call the function recursively with the next index
                        findProduct(index + 1);
                    });
                });
            });
        }
        findProduct(0);
    });
});

