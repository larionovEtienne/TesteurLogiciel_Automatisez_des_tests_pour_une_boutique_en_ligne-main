describe('API Tests', () => {
    it('should return 401 for login with unknown user', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login',
            body: {
                username: 'utilisateurinconnu',
                password: 'nopassword',
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it('should return 200 for login with known user', () => {
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
        });
    });
});


