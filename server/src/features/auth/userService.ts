import bcrypt from 'bcrypt';
import { User } from '../../../typings/express';
import DbConnection from '../../infrastructure/dbConnection';

const getUserByNameQuery = 'SELECT * FROM UserData WHERE username = ?';

class UserService {
    private dbConnection: DbConnection;
    constructor() {
        this.dbConnection = DbConnection.getInstance();
    }
    get = async (
        username: string,
        password: string
    ): Promise<User | undefined> => {
        // get the user only by username, because we can not compare password with passwordhash.
        const users = await this.dbConnection.select<User>(
            getUserByNameQuery,
            username
        );

        if (!users || !users[0]) {
            return undefined;
        }

        // compare the password and passwordhash with brypt
        const samePW = await bcrypt.compare(password, users[0].passwordHash);
        if (samePW) return users[0];

        return undefined;
    };
}
export default UserService;
