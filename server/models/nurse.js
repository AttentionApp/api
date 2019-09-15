const { escape } = require('mysql');
const pool = require('../middleware/database');

module.exports = {
    findById: (id,callback) => {
        const sql = `SELECT * FROM nurses WHERE idnurse = ${escape(id)} AND active=1`;
        pool.query(sql,(err,rows) => {
            if(err){
                callback(err,null);
            }
            callback(err,rows[0]);
        });
    },
    findAll: callback => {
        const sql = 'SELECT * FROM nurses WHERE active=1';
        pool.query(sql,(err,rows) => {
            if(err){
                callback(err,null);
            }
            callback(err,rows);
        });
    },
    save: (nurseData,callback) => {
        const sql = 'INSERT INTO nurses SET ?';
        pool.query(sql,nurseData,(err,results) => {
            if(err){
                callback(err,null);
            }
            console.log(`Affected rows: ${results.affectedRows}`);
            callback(err,results.insertId);
        });
    },
    update: (id,nurseData,callback) => {
        const sql = `UPDATE nurses SET ? WHERE idnurse = ?`;
        pool.query(sql,[nurseData,id],(err,results) => {
            if(err){
                callback(err,null);
            }
            const message = `Changed ${results.changedRows} row(s)`;
            console.log(message);
            callback(err,message);
        });
    },
    delete: (id,payload,callback) => {
        const sql = `UPDATE nurses SET ? WHERE idnurse = ?`;
        pool.query(sql,[payload,id],(err,results) => {
            if(err){
                callback(err,null);
            }
            const message = `Deleted ${results.affectedRows} rows`;
            console.log(message);
            callback(err,message);
        });
    }
}