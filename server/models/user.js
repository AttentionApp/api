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
        const values = Object.keys(userData).map(key => {
            return escape(userData[key]);
        });
        const sql = `INSERT INTO users (email,password,active,created_by,create_date,modified_by,modify_date,modify_reason) 
        VALUES(${values})`;
        pool.query(sql,(err,results) => {
            console.log(`Affected rows: ${results.affectedRows}`);
            callback(err,results.insertId);
        });
    }
}