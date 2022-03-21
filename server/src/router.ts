import * as express from 'express';
import { decorateRouter } from '@awaitjs/express';
import authRouter, {
    authorizationHandler,
} from './features/auth/authenticationRouter';
import measurementRouter from './features/measurement/measurementRouter';

// Create async router
const router = decorateRouter(express.Router());

router.use('/api/measurements', authorizationHandler, measurementRouter);
router.use('/', authRouter);

export default router;
