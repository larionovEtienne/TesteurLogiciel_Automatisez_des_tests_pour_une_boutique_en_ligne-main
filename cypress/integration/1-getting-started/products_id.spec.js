import '../../support/commands';

describe('API Tests', () => {
    let productId;
    beforeEach(() => {
        cy.authenticate();
        productId = 8;
    });

    it('should get information about a specific product', () => {
        const yourAuthToken = Cypress.env('authToken');
        expect(yourAuthToken).to.exist.and.not.be.empty;

        cy.request({
            method: 'GET',
            url: `http://localhost:8081/products/${productId}`,
            headers: {
                Authorization: `Bearer ${yourAuthToken}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);

            const productInfo = response.body;
            cy.log(`Product ID: ${productInfo.id}`);
            cy.log(`Product Name: ${productInfo.name}`);
            cy.log(`Product Price: ${productInfo.price}`);
            cy.log(`Product AvailableStock ${productInfo.availableStock}`);
        });
    });
});
