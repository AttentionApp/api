const { escape } = require('mysql');
const pool = require('../middleware/database');

module.exports = {
    findById: (id,callback) => {
        const sql = `SELECT * FROM reservations WHERE idreservation = ${escape(id)} AND active=1`;
        pool.query(sql,(err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows[0]);
        });
    },
    findByCustomerId: (idcustomer,callback) => {
        const sql = `SELECT * FROM reservations WHERE idcustomer = ${escape(idcustomer)} AND active=1`;
        pool.query(sql,(err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows);
        });
    },
    findAll: callback => {
        const sql = 'SELECT * FROM reservations WHERE active=1';
        pool.query(sql, (err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows);
        });
    },
    save: (reservationData, callback) => {
        const sql = 'INSERT INTO reservations SET ?';
        pool.query(sql,reservationData,(err,results) => {
            if (err){
                callback(err,null);
            }
            console.log(`Affected rows: ${results.affectedRows}`);
            callback(err,results.insertId);
        });
    },
    update: (id,reservationData,callback) => {
        const sql = 'UPDATE reservations SET ? WHERE idreservation = ?';
        pool.query(sql,[reservationData,id],(err,results) => {
            if (err){
                callback(err,null);
            }
            const message = `Changed ${results.changedRows} row(s)`;
            console.log(message);
            callback(err,message);
        });
    },
    delete: (id,payload,callback) => {
        const sql = 'UPDATE reservations SET ? WHERE idreservation = ?';
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