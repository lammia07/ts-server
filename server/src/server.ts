import cors from 'cors';
import express, { json, Router } from 'express';
import http from 'http';
import path from 'path';

import Logger from './infrastructure/logger';
import DbConnection from './infrastructure/dbConnection';
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from './infrastructure/errors';
import { ServerOptions } from './infrastructure/serverOptions';

// Method for generating a express server
// Not in Server class because of testing reasons
export const generateExpress = (
    logger: Logger,
    router: Router,
    welcomeMessage: string
): express.Express => {
    // Express Server
    const server = express();
    server.set('view engine', 'html');

    // public server files
    server.use(express.static(path.join(__dirname, '..', 'build', 'public')));

    server.use(json()); // parse application/json
    server.use(cors());

    // router links
    server.use('/', router);

    server.get('/', (req: express.Request, res: express.Response) => {
        res.send(welcomeMessage);
    });

    server.use('/*', (_: express.Request, res: express.Response) => {
        res.status(404).send('path not found');
    });

    // Global error handling for the complete application
    // All 4 parameters have to be specified. Otherwise the route would not be called
    server.use(
        (
            error: Error,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            logger.error(error);
            switch (error.constructor) {
                case BadRequestError:
                    return res.status(400).send(error.message);
                case UnauthorizedError:
                    return res.status(401).send(error.message);
                case ForbiddenError:
                    return res.status(403).send(error.message);
                case NotFoundError:
                    return res.status(404).send(error.message);
                default:
                    throw error;
            }
        }
    );
    return server;
};

class Server {
    private _dbConnection: DbConnection;
    private _express: express.Express;
    private _logger: Logger;
    private _running: boolean;
    private _options: ServerOptions;
    // TODO: use this for https
    // private _server: https.Server;
    private _server: http.Server;

    public constructor(
        dbConnection: DbConnection,
        logger: Logger,
        router: Router,
        serverOptions: ServerOptions
    ) {
        // Assign parameters
        this._dbConnection = dbConnection;
        this._logger = logger;
        this._running = false;
        this._options = serverOptions;
        this._express = generateExpress(
            logger,
            router,
            serverOptions.welcomeMessage
        );

        // TODO: use this for https
        // this._server = https.createServer(
        //     {
        //         key: fs.readFileSync(this._options.key),
        //         cert: fs.readFileSync(this._options.cert),
        //     },
        //     this._express
        // );
        this._server = http.createServer(this._express);
    }

    public async start() {
        if (this._running) {
            this._logger.info('Server already started');
            return;
        }

        this._running = true;

        this._server.listen(this._options.port, () => {
            this._logger.info(
                '\n\n------------------------------SERVER STARTING------------------------------'
            );
            this._logger.info(
                `Express server listening on port ${this._options.port}`
            );
            // TODO: use this for https
            // this._logger.info(`https://localhost:${this._options.port}`);
            this._logger.info(`http://localhost:${this._options.port}`);
        });

        this._server.on('connection', (socket) => {
            const client = socket.remoteAddress + ':' + socket.remotePort;
            this._logger.info('Client established connection: ' + client);
            socket.on('close', () => {
                this._logger.info('Socket ' + client + ' closed connection');
            });
        });

        this._server.on('error', (err) => {
            this._dbConnection.close();
            this._logger.info(
                '\n------------------------------SERVER CLOSED------------------------------'
            );
            this._logger.error(err.message);
        });

        process.on('SIGINT', () => {
            this._dbConnection.close();
            this._logger.info(
                '\n------------------------------SERVER CLOSED------------------------------'
            );
            process.exit(0);
        });
    }

    public stop() {
        this._server.close();
    }
}

export default Server;
