import '../../support/commands';

describe('API Tests', () => {
    beforeEach(() => {
        // login avant passer le test
        cy.authenticate();
    });

    it('should add a product to the cart if available in stock', () => {
        const yourAuthToken = Cypress.env('authToken');
        expect(yourAuthToken).to.exist.and.not.be.empty;
        cy.request({
            method: 'GET',
            url: 'http://localhost:8081/products',
            headers: {
                Authorization: `Bearer ${yourAuthToken}`,
            },
        }).then((productsResponse) => {
            expect(productsResponse.status).to.eq(200);
            const availableProduct = productsResponse.body.find((product) => product.availableStock > 0);
            if (availableProduct) {
                const productId = availableProduct.id;
                const quantity = 1;
                cy.request({
                    method: 'PUT',
                    url: 'http://localhost:8081/orders/add',
                    headers: {
                        Authorization: `Bearer ${yourAuthToken}`,
                    },
                    body: {
                        product: productId,
                        quantity: quantity,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.error).to.not.exist;
                    cy.log(`Product added to the cart: ID - ${productId},AvailableStock - ${availableProduct.availableStock}, Quantity - ${quantity}`);
                });
            } else {
                cy.log('No product available in stock');
            }
        });
    });
});
