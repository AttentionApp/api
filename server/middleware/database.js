const mysql = require('mysql');
const options = {
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'db_attentionapp'
};
const pool = mysql.createPool(options);

module.exports = pool