// Cannot user ES6 import statement because node needs CommonJS
const bcrypt = require('bcrypt');
const config = require('config');
const mysql = require('mysql2/promise');

// Load configuration from json files
const dbConnectionCnfig = config.get('MySqlConnectionPool');
const users = config.get('defaultUsers');
const saltRounds = config.get('authOptions.saltRounds');

// Method is written like this '(()=>{})();' because we want to execute the code now and await keyword cannot be used on top-level
(async () => {
    // Insert Query with value placeholder for preventing db injection
    let insertQuery =
        'INSERT INTO UserData (id,username, passwordHash,role) VALUES ?';

    // values have to be in special format for insert so they have to be mapped => [[value1,value2],[value3,value4]]
    const usersForInsert = await Promise.all(
        users.map(async (item) => {
            const passwordHash = await bcrypt.hash(item.password, saltRounds);
            return [item.id, item.user, passwordHash, item.role];
        })
    );

    // check the sql and value format in the console
    console.log(insertQuery);
    console.log(usersForInsert);

    // create a db connection, execute the insert statement and close the connection again
    const connection = await mysql.createConnection(dbConnectionCnfig);
    await connection.query(insertQuery, [usersForInsert]);
    await connection.end();
})();
