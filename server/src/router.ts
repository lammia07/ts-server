import * as express from 'express';
import { decorateRouter } from '@awaitjs/express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import authRouter, {
    authorizationHandler,
} from './features/auth/authenticationRouter';
import articleRouter from './features/articles/articleRouter';
import measurementRouter from './features/measurement/measurementRouter';

const options: swaggerJSDoc.OAS3Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dummy API',
            version: '1.0.0',
        },
    },
    // we need the ** glob here so the spec works with TS (https://github.com/Surnet/swagger-jsdoc/issues/168)
    apis: ['**/features/**/*Router.ts'], // files containing annotations as above
};

const spec = swaggerJSDoc(options);

// Create async router
const router = decorateRouter(express.Router());

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

router.use('/api/articles', authorizationHandler, articleRouter);
router.use('/api/measurements', authorizationHandler, measurementRouter);
router.use('/', authRouter);

export default router;
