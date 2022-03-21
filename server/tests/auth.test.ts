import supertest from 'supertest';
import { generateExpress } from '../src/server';
import router from '../src/router';
import config from 'config';
import { Login, TokenResult } from '../typings/express';
import ConsoleLogger from '../src/infrastructure/consoleLogger';

const logger = new ConsoleLogger();
logger.active = false;

describe('Authorization Integration Tests', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let testUser = config.get('testUser') as Login;

    beforeEach(async () => {
        const server = generateExpress(logger, router, '');
        request = supertest(server);
    });

    it('POST /login => correct login', async () => {
        const response = await request.post('/login').send(testUser);
        expect(response.statusCode).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);

        const json = JSON.parse(response.text);
        expect(json).toEqual(
            // with objects
            expect.objectContaining({
                // that contain the following properties
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            })
        );
    });

    it('POST /login => wrong username and passwort', async () => {
        const login: Login = { username: 'wrong', password: 'wrong' };
        const response = await request.post('/login').send(login);
        expect(response.statusCode).toEqual(403);
    });

    it('POST /login => wrong passwort', async () => {
        const login: Login = { username: testUser.username, password: 'wrong' };
        const response = await request.post('/login').send(login);
        expect(response.statusCode).toEqual(403);
    });

    it('POST /token => refresh accesstoken', async () => {
        var response = await request.post('/login').send(testUser);
        const loginResult = JSON.parse(response.text) as TokenResult;
        response = await request
            .post('/token')
            .send({ token: loginResult.refreshToken });

        expect(response.statusCode).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);

        const json = JSON.parse(response.text);
        expect(json).toEqual(
            // with objects
            expect.objectContaining({
                // that contain the following properties
                accessToken: expect.any(String),
            })
        );
        expect(json).toEqual(
            // with objects
            expect.not.objectContaining({
                refreshToken: expect.any(String),
            })
        );
    });

    it('POST /token => refresh accesstoken without token error', async () => {
        var response = await request.post('/login').send(testUser);
        const loginResult = JSON.parse(response.text) as TokenResult;
        response = await request.post('/token');

        expect(response.statusCode).toEqual(401);
    });

    it('POST /token => refresh accesstoken with wrong token error', async () => {
        var response = await request.post('/login').send(testUser);
        const loginResult = JSON.parse(response.text) as TokenResult;
        response = await request
            .post('/token')
            .send({ token: 'NotAnAccessToken' });

        expect(response.statusCode).toEqual(401);
    });

    it('POST /secure => test authorization okay', async () => {
        var response = await request.post('/login').send(testUser);
        const { accessToken } = JSON.parse(response.text) as TokenResult;
        response = await request
            .get('/secure')
            .set('authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toEqual(200);
    });

    it('POST /secure => test authorization failed', async () => {
        const response = await request
            .get('/secure')
            .set('authorization', `Bearer NotAnAccessToken`);

        expect(response.statusCode).toEqual(403);
    });

    it('POST /secure => test authorization missing header', async () => {
        const response = await request.get('/secure');

        expect(response.statusCode).toEqual(401);
    });
});
