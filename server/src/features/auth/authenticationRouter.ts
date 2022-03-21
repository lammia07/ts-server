import express, { RequestHandler } from 'express';
import AuthenticationService from './authenticationService';
import { JwtUser, Login } from '../../../typings/express';
import { decorateRouter } from '@awaitjs/express';

//https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
const router = decorateRouter(express.Router());
const authService = new AuthenticationService();

// POST /token ->  route for refreshing the access token
router.post('/token', (req, res) => {
    const { token } = req.body as { token: string };
    const authResult = authService.refreshToken(token);
    res.json(authResult);
});

// POST /login -> route for log in user and requesting access and refresh token
router.postAsync('/login', async (req, res) => {
    const authResult = await authService.authenticate(req.body as Login);
    res.json(authResult);
});

// RequestHandler for providing authorization functionality to selected routes
export const authorizationHandler: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization as string;
    const result = authService.authorize(authHeader);
    req.user = result as JwtUser;
    next();
};

// GET /secure -> route for testing if authorized
router.get('/secure', authorizationHandler, async (req, res) => {
    res.send('You are authorized');
});

export default router;
