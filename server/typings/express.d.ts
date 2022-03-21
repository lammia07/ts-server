// TODO @mlamprecht: Does only work when in one typing file

declare global {
    namespace Express {
        interface Request {
            user?: JwtUser;
        }
    }
}
export type TokenResult = {
    accessToken: string;
    refreshToken?: string;
};

export type JwtUser = {
    userId: number;
    role: string;
};

export type Login = { username: string; password: string };

export type AuthOptions = {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    saltRounds: number;
};

export type User = {
    id: number;
    username: string;
    passwordHash: string;
    role: string;
};

export type Measurement = {
    id: number;
    timestamp: number;
    temperature: number;
    humidity: number;
    measurementType: number;
}
