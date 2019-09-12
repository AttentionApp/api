const { escape } = require('mysql');
const pool = require('../middleware/database');

module.exports = {
    findById: (id,callback) => {
        const sql = `SELECT * FROM users WHERE iduser = ${escape(id)}`;
        pool.query(sql,(err,rows) => {
            callback(err,rows[0]);
        });
    },
    findAll: callback => {
        const sql = 'SELECT * FROM users';
        pool.query(sql,(err,rows) => {
            callback(err,rows);
        });
    },
    findByEmail: (email,callback) => {
        const sql = `SELECT * FROM users WHERE email=${escape(email)}`;
        pool.query(sql,(err,rows) => {
            callback(err,rows);
        });
    },
    save: (userData, callback) => {
        const sql = 'INSERT INTO users SET ?';
        pool.query(sql,userData,(err,results) => {
            console.log(`Affected rows: ${results.affectedRows}`);
            callback(err,results.insertId);
        });
    }
}