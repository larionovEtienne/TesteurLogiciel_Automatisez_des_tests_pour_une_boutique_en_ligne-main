import '../../support/commands';

describe('API Tests', () => {
    beforeEach(() => {
        cy.authenticate();
    });

    it('should leave a review', () => {
        const yourAuthToken = Cypress.env('authToken');
        expect(yourAuthToken).to.exist.and.not.be.empty;

        const reviewData = {
            title: 'Great Product',
            comment: 'I really loved this product. It exceeded my expectations.',
            rating: 5,
        };
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/reviews',
            headers: {
                Authorization: `Bearer ${yourAuthToken}`,
            },
            body: reviewData,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id');
            cy.log(`Review added successfully. Review ID: ${response.body.id}`);
        });
    });
});
