const mysql = require('mysql');
const options = {
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'db_attentionapp'
};
const pool = mysql.createPool("mysql://udm1bwpybxtsbyvw:JgNKhwqSVu213JMDcf9d@bbnv9jwejwgt0rmpt5nb-mysql.services.clever-cloud.com:3306/bbnv9jwejwgt0rmpt5nb");

module.exports = pool