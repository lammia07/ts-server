import express from 'express';
import { decorateRouter } from '@awaitjs/express';
import MeasurementService, { isMeasurement } from './measurementService';
import { BadRequestError, NotFoundError } from '../../infrastructure/errors';

const router = decorateRouter(express.Router());
const measurementService = new MeasurementService();

/**
 * @openapi
 * definitions:
 *   DummyV1:
 *     required:
 *       - identifier
 *       - identifierType
 *       - name
 *       - description
 *     properties:
 *       identifier:
 *         type: string
 *       identifierType:
 *         type: string
 *         enum:
 *           - ean13
 *           - custom
 *       name:
 *         type: string
 *       description:
 *         type: string
 */

// GET /api/measurements -> Get all measurements
/**
 * @openapi
 * /api/measurements:
 *   get:
 *     tags:
 *       - Dummy V1
 *     produces:
 *       - application/json
 *     description: This is a dummy entry.
 *     summary: Read dummy entries.
 *     responses:
 *       200:
 *         description: A list of articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DummyV1'
 */
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
