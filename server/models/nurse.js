const { escape } = require('mysql');
const pool = require('../middleware/database');

module.exports = {
    findById: (id,callback) => {
        const sql = `SELECT * FROM nurses WHERE idnurse = ${escape(id)} AND active=1`;
        pool.query(sql,(err,rows) => {
            callback(err,rows[0]);
        });
    },
    findAll: callback => {
        const sql = 'SELECT * FROM nurses WHERE active=1';
        pool.query(sql,(err,rows) => {
            callback(err,rows);
        });
    },
    save: (nurseData,callback) => {
        const sql = 'INSERT INTO nurses SET ?';
        pool.query(sql,nurseData,(err,results) => {
            console.log(`Affected rows: ${results.affectedRows}`);
            callback(err,results.insertId);
        });
    },
    update: (id,nurseData,callback) => {
        const sql = `UPDATE nurses SET ? WHERE idnurse = ?`;
        pool.query(sql,[nurseData,id],(err,results) => {
            const message = `Changed ${results.changedRows} row(s)`;
            console.log(message);
            callback(err,message);
        });
    },
    delete: (id,callback) => {
        const sql = `DELETE FROM nurses WHERE idnurse=${escape(id)}`;
        pool.query(sql,(err,results) => {
            const message = `Deleted ${results.affectedRows} rows`;
            console.log(message);
            callback(err,message);
        });
    }
}