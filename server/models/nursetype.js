const { escape } = require('mysql');
const pool = require('../middleware/database');

module.exports = {
    findById: (id,callback) => {
        const sql = `SELECT * FROM nursetypes WHERE idnursetype = ${escape(id)}`;
        pool.query(sql,(err,rows) => {
            callback(err,rows[0]);
        });
    },
    findAll: callback => {
        const sql = 'SELECT * FROM nursetypes WHERE active=1';
        pool.query(sql,(err,rows) => {
            console.log(rows);
            callback(err,rows);
        });
    },
    save: (nurseTypeData,callback) => {
        const sql = 'INSERT INTO nursetypes SET ?';
        pool.query(sql,nurseTypeData,(err,results) => {
            console.log(`Affected rows: ${results.affectedRows}`);
            callback(err,results.insertId);
        });
    },
    update: (id,nurseTypeData,callback) => {
        const sql = `UPDATE nursetypes SET ? WHERE idnursetype = ?`;
        pool.query(sql,[nurseTypeData,id],(err,results) => {
            const message = `Changed ${results.changedRows} row(s)`;
            console.log(message);
            callback(err,message);
        });
    },
    delete: (id,callback) => {
        const sql = `DELETE FROM nursetypes WHERE idnursetype=${escape(id)}`;
        pool.query(sql,(err,results) => {
            const message = `Deleted ${results.affectedRows} rows`;
            console.log(message);
            callback(err,message);
        });
    }
}