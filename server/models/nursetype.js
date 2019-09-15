const { escape } = require('mysql');
const pool = require('../middleware/database');

module.exports = {
    findById: (id,callback) => {
        const sql = `SELECT * FROM nursetypes WHERE idnursetype = ${escape(id)} AND active=1`;
        pool.query(sql,(err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows[0]);
        });
    },
    findAll: callback => {
        const sql = 'SELECT * FROM nursetypes WHERE active=1';
        pool.query(sql, (err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows);
        });
    }
}