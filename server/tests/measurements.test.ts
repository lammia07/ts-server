import supertest from 'supertest';
import { Measurement, TokenResult } from '../typings/express';
import config from 'config';
import { generateExpress } from '../src/server';
import router from '../src/router';
import ConsoleLogger from '../src/infrastructure/consoleLogger';

const logger = new ConsoleLogger();
logger.active = false;

describe('Measurement Integration Tests => api/measurements', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let token: string = '';

    beforeEach(async () => {
        const server = generateExpress(logger, router, '');
        request = supertest(server);
        const response = await request
            .post('/login')
            .send(config.get('testUser'));
        const tokenResult = JSON.parse(response.text) as TokenResult;
        token = tokenResult.accessToken;
    });

    it('GET /api/measurements - all measurements', async () => {
        const response = await request
            .get('/api/measurements')
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);

        const json = JSON.parse(response.text);

        expect(json).toEqual(
            // expect an array
            expect.arrayContaining([
                // with objects
                expect.objectContaining({
                    // that contain the following properties
                    id: expect.any(Number),
                    timestamp: expect.any(Number),
                    temperature: expect.any(Number),
                    humidity: expect.any(Number),
                    measurementType: expect.any(Number),
                }),
            ])
        );

        // save to convert because we already checked compatibility
        const measurements = json as Measurement[];

        const measurement = measurements.find((value) => value.id == 1)!;
        expect(measurement.humidity).toEqual(64.2);
        expect(measurement.id).toEqual(1);
        expect(measurement.measurementType).toEqual(0);
        expect(measurement.temperature).toEqual(25.4);
        expect(measurement.timestamp).toEqual(1621158665);
    });

    it('GET /api/measurements/1 - get one measurement by id', async () => {
        const response = await request
            .get('/api/measurements/1')
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);

        const json = JSON.parse(response.text);

        expect(json).toEqual(
            // expect one object
            expect.objectContaining({
                // that contains the following properties
                id: expect.any(Number),
                timestamp: expect.any(Number),
                temperature: expect.any(Number),
                humidity: expect.any(Number),
                measurementType: expect.any(Number),
            })
        );

        // save to convert because we already checked compatibility
        const measurement = json as Measurement;

        expect(measurement.humidity).toEqual(64.2);
        expect(measurement.id).toEqual(1);
        expect(measurement.measurementType).toEqual(0);
        expect(measurement.temperature).toEqual(25.4);
        expect(measurement.timestamp).toEqual(1621158665);
    });

    it('GET /api/measurements/-1 - get not existing id', async () => {
        const response = await request
            .get('/api/measurements/-1')
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(404);
        expect(response.text).toEqual('Not Found');
    });

    it('GET /api/measurements/abc - get not a number', async () => {
        const response = await request
            .get('/api/measurements/abc')
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(404);
        expect(response.text).toEqual('Not Found');
    });

    it('POST /api/measurements - insert a new measurement', async () => {
        const measurement = {
            humidity: 80,
            measurementType: 0,
            temperature: 23,
            timestamp: 1621158700,
        };

        const response = await request
            .post('/api/measurements')
            .send(measurement)
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch(/json/);

        const json = JSON.parse(response.text);

        expect(json).toEqual(
            // expect one object
            expect.objectContaining({
                // that contains the following properties
                id: expect.any(Number),
                timestamp: expect.any(Number),
                temperature: expect.any(Number),
                humidity: expect.any(Number),
                measurementType: expect.any(Number),
            })
        );

        // save to convert because we already checked compatibility
        const newMeasurement = json as Measurement;

        expect(newMeasurement.humidity).toEqual(measurement.humidity);
        expect(newMeasurement.id).not.toEqual(0);
        expect(newMeasurement.measurementType).toEqual(
            measurement.measurementType
        );
        expect(newMeasurement.temperature).toEqual(measurement.temperature);
        expect(newMeasurement.timestamp).toEqual(measurement.timestamp);
    });

    it('POST /api/measurements - insert null', async () => {
        const response = await request
            .post('/api/measurements')
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(400);
    });

    it('PUT /api/measurements - update a measurement', async () => {
        const measurement = {
            humidity: 80,
            measurementType: 0,
            temperature: 23,
            timestamp: 1621158700,
        };

        let response = await request
            .post('/api/measurements')
            .send(measurement)
            .set('authorization', `Bearer ${token}`);

        const newMeasurement = JSON.parse(response.text) as Measurement;

        newMeasurement.humidity = 90;
        newMeasurement.measurementType = 1;
        newMeasurement.temperature = 25;
        newMeasurement.timestamp = 1621158705;

        response = await request
            .put('/api/measurements/' + newMeasurement.id)
            .send(newMeasurement)
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);

        const json = JSON.parse(response.text);

        expect(json).toEqual(
            // expect one object
            expect.objectContaining({
                // that contains the following properties
                id: expect.any(Number),
                timestamp: expect.any(Number),
                temperature: expect.any(Number),
                humidity: expect.any(Number),
                measurementType: expect.any(Number),
            })
        );

        // save to convert because we already checked compatibility
        const updatedMeasurement = json as Measurement;

        expect(updatedMeasurement.humidity).toEqual(newMeasurement.humidity);
        expect(updatedMeasurement.id).toEqual(newMeasurement.id);
        expect(updatedMeasurement.measurementType).toEqual(
            newMeasurement.measurementType
        );
        expect(updatedMeasurement.temperature).toEqual(
            newMeasurement.temperature
        );
        expect(updatedMeasurement.timestamp).toEqual(newMeasurement.timestamp);
    });

    it('PUT /api/measurements - update a measurement', async () => {
        const response = await request
            .put('/api/measurements/-1')
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(404);
    });

    it('DELETE /api/measurements - delete a measurement', async () => {
        const measurement = {
            humidity: 80,

            measurementType: 0,
            temperature: 23,
            timestamp: 1621158700,
        };

        let response = await request
            .post('/api/measurements')
            .send(measurement)
            .set('authorization', `Bearer ${token}`);

        const newMeasurement = JSON.parse(response.text) as Measurement;
        response = await request
            .delete('/api/measurements/' + newMeasurement.id)
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(204);
    });

    it('DELETE /api/measurements - try delete a measurement a second time', async () => {
        const measurement = {
            humidity: 80,

            measurementType: 0,
            temperature: 23,
            timestamp: 1621158700,
        };

        let response = await request
            .post('/api/measurements')
            .send(measurement)
            .set('authorization', `Bearer ${token}`);

        const newMeasurement = JSON.parse(response.text) as Measurement;
        response = await request
            .delete('/api/measurements/' + newMeasurement.id)
            .set('authorization', `Bearer ${token}`);

        response = await request
            .delete('/api/measurements/' + newMeasurement.id)
            .set('authorization', `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(404);
    });
});
