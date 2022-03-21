import mysql from 'mysql2/promise';
import config from 'config';
import { OkPacket, PoolOptions, RowDataPacket } from 'mysql2/typings/mysql';

class DbConnection {
    private static instance: DbConnection;
    private connectionPool: mysql.Pool;

    // Singleton Pattern
    private constructor() {
        // Load Db config
        const poolConfig: PoolOptions = config.get('MySqlConnectionPool');

        // create the mysql connection pool from whom we will get our db connectionns
        this.connectionPool = mysql.createPool(poolConfig);
    }

    // Singleton Pattern
    public static getInstance(): DbConnection {
        if (DbConnection.instance) {
            return DbConnection.instance;
        }

        DbConnection.instance = new DbConnection();
        return DbConnection.instance;
    }

    // SELECT data from db and map to generic type T
    select = async <T>(query: string, params: any = null): Promise<T[]> => {
        let connection = await this.connectionPool.getConnection();
        let [results] = await connection.execute<(T & RowDataPacket)[]>(query, [
            params,
        ]);
        connection.release();
        return results;
    };

    // INSERT data into db and return generated ID
    insert = async (query: string, params: any): Promise<number> => {
        let connection = await this.connectionPool.getConnection();
        let [results] = await connection.query(query, params);
        connection.release();
        return (results as OkPacket).insertId;
    };

    // UPDATE db data and return successful or not
    update = async (query: string, params: any): Promise<boolean> => {
        let connection = await this.connectionPool.getConnection();
        let [results] = await connection.query(query, params);
        connection.release();
        return (results as OkPacket).affectedRows === 1;
    };

    // DELETE db data and return successful or not
    delete = async (query: string, params: any): Promise<boolean> => {
        let connection = await this.connectionPool.getConnection();
        let [results] = await connection.query(query, params);
        connection.release();
        return (results as OkPacket).affectedRows === 1;
    };

    // closes the connection to the database
    close = () => {
        this.connectionPool.end();
    };
}

export default DbConnection;
