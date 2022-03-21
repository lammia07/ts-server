import supertest from 'supertest';
import { generateExpress } from '../src/server';
import router from '../src/router';
import ConsoleLogger from '../src/infrastructure/consoleLogger';
import main from '../src/main';
import DbConnection from '../src/infrastructure/dbConnection';

const logger = new ConsoleLogger();
logger.active = false;

describe('server tests', () => {
    it('start server second time', () => {
        main.start();
    });

    it('stop server', () => {
        main.stop();
    });

    it('close dbConnection', () => {
        DbConnection.getInstance().close();
    });

    it('log info', () => {
        new ConsoleLogger().info('My info');
    });
});

describe('GET / - a simple api endpoint', () => {
    it('Hello API Request', async () => {
        const welcomeMessage = 'Hello Tests';
        const server = generateExpress(
            new ConsoleLogger(),
            router,
            welcomeMessage
        );

        const result = await supertest(server).get('/');
        expect(result.text).toEqual(welcomeMessage);
        expect(result.statusCode).toEqual(200);
    });

    it('Not Found path', async () => {
        const welcomeMessage = 'Hello Tests';
        const server = generateExpress(
            new ConsoleLogger(),
            router,
            welcomeMessage
        );

        const result = await supertest(server).get('/iwillnotbefound');
        expect(result.statusCode).toEqual(404);
    });
});
