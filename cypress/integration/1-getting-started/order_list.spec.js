
import '../../support/commands';

describe('API Tests', () => {
    beforeEach(() => {
        cy.authenticate();
    });

    it('should get the list of products in the cart without adding', () => {
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
    });
});

