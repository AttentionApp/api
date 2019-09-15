const { escape } = require('mysql');
const pool = require('../middleware/database');

module.exports = {
    findById: (id,callback) => {
        const sql = `SELECT * FROM schedules WHERE idschedule = ${escape(id)} AND active=1`;
        pool.query(sql,(err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows[0]);
        });
    },
    findAll: callback => {
        const sql = 'SELECT * FROM schedules WHERE active=1';
        pool.query(sql, (err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows);
        });
    },
    save: (scheduleData, callback) => {
        const sql = 'INSERT INTO schedules SET ?';
        pool.query(sql,scheduleData,(err,results) => {
            if (err){
                callback(err,null);
            }
            console.log(`Affected rows: ${results.affectedRows}`);
            callback(err,results.insertId);
        });
    },
    update: (id,scheduleData,callback) => {
        const sql = 'UPDATE schedules SET ? WHERE idschedule = ?';
        pool.query(sql,[scheduleData,id],(err,results) => {
            if (err){
                callback(err,null);
            }
            const message = `Changed ${results.changedRows} row(s)`;
            console.log(message);
            callback(err,message);
        });
    },
    delete: (id,payload,callback) => {
        const sql = 'UPDATE schedules SET ? WHERE idschedule = ?';
        pool.query(sql,[payload,id],(err,results) => {
            if (err){
                callback(err,null);
            }
            const message = `Deleted ${results.affectedRows} rows`;
            console.log(message);
            callback(err,message);
        });
    }
}