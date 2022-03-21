import config from 'config';
import {
    AuthOptions,
    JwtUser,
    Login,
    TokenResult,
} from '../../../typings/express';

import UserService from './userService';
import jwt from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from '../../infrastructure/errors';

class AuthenticationService {
    private accessTokenSecret: string;
    private refreshTokens: string[];
    private refreshTokenSecret: string;
    private userService: UserService;

    public constructor() {
        this.refreshTokens = [] as string[];

        var authOptions = config.get('authOptions') as AuthOptions;
        this.accessTokenSecret = authOptions.accessTokenSecret;
        this.refreshTokenSecret = authOptions.refreshTokenSecret;
        this.userService = new UserService();
    }

    // checks if the username and password is correct and sends back an access and refresh token
    authenticate = async (login: Login): Promise<TokenResult> => {
        const { username, password } = login;
        const user = await this.userService.get(username, password);

        if (user) {
            const jwtUser: JwtUser = {
                userId: user.id,
                role: user.role,
            };

            // Generate an access token
            const accessToken = jwt.sign(jwtUser, this.accessTokenSecret, {
                expiresIn: '20m',
            });
            const refreshToken = jwt.sign(jwtUser, this.refreshTokenSecret);
            this.refreshTokens.push(refreshToken);

            return { accessToken, refreshToken };
        }
        throw new ForbiddenError('Username or password incorrect');
    };

    // tries to get the access token from the header and tries to verify it
    authorize = (authHeader: string): JwtUser => {
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            try {
                const payload = jwt.verify(token, this.accessTokenSecret);
                return payload as JwtUser;
            } catch (error) {
                throw new ForbiddenError();
            }
        }
        throw new UnauthorizedError();
    };

    // will try to generate a new access token with the provided refresh token
    refreshToken = (token: string): TokenResult => {
        if (!token) {
            throw new UnauthorizedError();
        }

        if (!this.refreshTokens.includes(token)) {
            throw new UnauthorizedError();
        }

        try {
            const payload = jwt.verify(token, this.refreshTokenSecret);
            const user = payload as JwtUser;

            const accessToken = jwt.sign(user, this.accessTokenSecret, {
                expiresIn: '20m',
            });

            return {
                accessToken,
            };
        } catch (error) {
            throw new UnauthorizedError();
        }
    };
}
export default AuthenticationService;
