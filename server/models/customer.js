const { escape } = require('mysql');
const pool = require('../middleware/database');

module.exports = {
    findById: (id,callback) => {
        const sql = `SELECT * FROM customers WHERE idcustomer = ${escape(id)} AND active=1`;
        pool.query(sql,(err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows[0]);
        });
    },
    findAll: callback => {
        const sql = 'SELECT * FROM customers WHERE active=1';
        pool.query(sql, (err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows);
        });
    },
    save: (customerData, callback) => {
        const sql = 'INSERT INTO customers SET ?';
        pool.query(sql,customerData,(err,results) => {
            if (err){
                callback(err,null);
            }
            console.log(`Affected rows: ${results.affectedRows}`);
            callback(err,results.insertId);
        });
    },
    update: (id,customerData,callback) => {
        const sql = 'UPDATE customers SET ? WHERE idcustomer = ?';
        pool.query(sql,[customerData,id],(err,results) => {
            if (err){
                callback(err,null);
            }
            const message = `Changed ${results.changedRows} row(s)`;
            console.log(message);
            callback(err,message);
        });
    },
    delete: (id,payload, callback) => {
        const sql = 'UPDATE customers SET ? WHERE idcustomer = ?';
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