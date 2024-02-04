it('should receive an error when trying to access /orders without authentication', () => {
    const ordersEndpoint = 'http://localhost:8081/orders';
    cy.request({
        method: 'GET',
        url: ordersEndpoint,
        failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.be.eq(403);
    });
});











