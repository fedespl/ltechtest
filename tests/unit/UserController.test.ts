import 'reflect-metadata';
const request = require('supertest');
const app = require('../../src/index');
const { User } = require('../../src/entity/User');

describe('UserController', () => {
    let testUser;

    beforeAll(async () => {
        // Create a test user before running the tests
        testUser = await User.create({ name: 'Test User', email: 'test@example.com' }).save();
    });

    afterAll(async () => {
        // Clean up: Delete the test user after all tests are complete
        if (testUser) {
            await User.delete({ id: testUser.id });
        }
    });

    it('should return a user by ID', async () => {
        try {
            // Make a GET request to fetch the test user by ID
            const response = await request(app).get(`/users/${testUser.id}`);

            // Check the response status code
            expect(response.status).toBe(200);

            // Check the response body for the user's name and email
            expect(response.body.name).toBe('Test User');
            expect(response.body.email).toBe('test@example.com');
        } catch (error) {
            fail(error);
        }
    });
});


