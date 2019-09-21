const pool = require('../middleware/database');

module.exports = {
    registerUserCustomer: (email,password,first_name,last_name,short_name,callback) => {
        const sql = 'CALL sp_insert_user_customer(?,?,?,?,?)';
        pool.query(sql,[email,password,first_name,last_name,short_name],(err,rows) => {
            if (err){
                callback(err,null);
            }
            callback(err,rows[0]);
        });
    },
    getCustomerLogin: (email,callback) => {
        const sql = 'CALL sp_get_user_customer_login(?)';
        pool.query(sql,[email],(err,rows) => {
            if(err){
                callback(err,null);
            }
            callback(err,rows[0]);
        });
    },
    getProfileData: (email, callback) => {
        const sql = 'CALL sp_get_user_customer(?)';
        pool.query(sql,[email],(err,rows) => {
            if(err){
                callback(err,null);
            }
            callback(err,rows[0]);
        });
    }
}