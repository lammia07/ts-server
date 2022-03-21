import express from 'express';
import { decorateRouter } from '@awaitjs/express';
import MeasurementService, { isMeasurement } from './measurementService';
import { BadRequestError, NotFoundError } from '../../infrastructure/errors';

const router = decorateRouter(express.Router());
const measurementService = new MeasurementService();

// GET /api/measurements -> Get all measurements
router.getAsync('/', async (req: express.Request, res: express.Response) => {
    let measurements = await measurementService.get();
    res.send(measurements);
});

// GET /api/measurements/id -> Get one measurement
router.getAsync('/:id', async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    if (id !== NaN) {
        const measurement = await measurementService.find(id);
        if (measurement) {
            res.json(measurement);
            return;
        }
    }

    throw new NotFoundError();
});

// POST /api/measurements -> Add new measurement
router.postAsync('/', async (req: express.Request, res: express.Response) => {
    if (isMeasurement(req.body, false)) {
        let measurement = await measurementService.insert(req.body);
        if (measurement) {
            res.status(201).json(measurement);
            return;
        }
    }

    throw new BadRequestError('No measurement for insert found.');
});

// PUT /api/measurements/id -> Update one measurement
router.putAsync('/:id', async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);

    if (id !== NaN && isMeasurement(req.body)) {
        const measurement = await measurementService.update(id, req.body);
        if (measurement) {
            res.status(200).json(measurement);
            return;
        }
    }

    throw new NotFoundError();
});

// DELETE /api/measurements/id -> delete one measurement
router.deleteAsync(
    '/:id',
    async (req: express.Request, res: express.Response) => {
        const id = parseInt(req.params.id);
        if (id !== NaN) {
            const measurementId = await measurementService.delete(
                parseInt(req.params.id)
            );
            if (measurementId) {
                res.status(204).json(measurementId);
                return;
            }
        }
        throw new NotFoundError();
    }
);

export default router;
