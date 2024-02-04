
Cypress.Commands.add('authenticate', () => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8081/login',
        body: {
            username: 'test2@test.fr',
            password: 'testtest',
        },
        followRedirect: false,
    }).then((response) => {
        expect(response.status).to.eq(200);
        const authToken = response.body.token;
        expect(authToken).to.exist.and.not.be.empty;
        Cypress.env('authToken', authToken);
    });
});








