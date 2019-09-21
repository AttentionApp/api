const { Router } = require('express');
const userRepo = require('../../models/user');
const authRepo = require('../../models/auth');
const auth = require('../../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_KEY } = require('../../util/constants');

const authRouter = Router();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - auth
 *     description: Register a customer's user
 *     parameters:
 *          - name: email
 *            in: formData
 *            type: string
 *            required: true
 *          - name: password
 *            in: formData
 *            type: string
 *            required: true
 *          - name: first_name
 *            in: formData
 *            type: string
 *            required: true
 *          - name: last_name
 *            in: formData
 *            required: true
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Returns jwt, message
 *       409:
 *         description: Returns a message - Email already in use
 *       500:
 *         description: Returns an error message
 */
authRouter.post('/signup', (req,res) => {
    userRepo.findByEmail(req.body.email, (err,rows) => {
        if (rows.length >= 1)
            return res.status(409).send({sucess: false, message: 'Email already in use'});
        else {
            bcrypt.hash(req.body.password, 10, (err,hash) => {
                if(err) {
                    throw err;
                } else {
                    const {email,first_name,last_name} = req.body;
                    const short_name = `${first_name} ${last_name}`;
                    authRepo.registerUserCustomer(email,hash,first_name,last_name,short_name,(err,rows) => {
                        if(err){
                            throw err;
                        }
                        let payload = {};
                        payload = Object.assign(payload,rows[0]);
                        const token = jwt.sign(
                            payload,
                            JWT_KEY,
                            {
                                expiresIn: '0'
                            }
                        );
                        res.status(201).send({success: true, message: "User registered successfully", token, userData: payload });
                    });
                }
            });
        }
    });
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     description: Authenticate using user credentials
 *     parameters:
 *          - name: email
 *            in: formData
 *            type: string
 *            required: true
 *          - name: password
 *            in: formData
 *            type: string
 *            required: true
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *         description: Returns an error message - User doesn't exists, Invalid Password
 *       200:
 *         description: Returns a jwt token and message - Auth Completed Successfully
 *       500:
 *         description: Returns an error message
 */
authRouter.post('/login', (req,res) => {
    authRepo.getCustomerLogin(req.body.email, (err,rows) => {
        if(err) throw err;
        if(rows.length < 1){
            return res.status(401).send({ sucess:false, message: 'User doesn\'t exists.' });
        }
        bcrypt.compare(req.body.password, rows[0].password, (err,result) => {
            if(err){
                return res.status(401).send({success: false, message: 'Invalid password'});
            }
            if(result){
                let payload = {};
                delete rows[0].password;
                payload = Object.assign(payload,rows[0]);
                const token = jwt.sign(
                    payload,
                    JWT_KEY,
                    {
                        expiresIn: '0'
                    }
                );
                return res.status(200).send({
                    sucess: true,
                    message: 'Auth completed successfully',
                    userData: payload,
                    token: token
                });
            }
            return res.status(401).send({sucess: false, message:'Auth failed'});
        });
    })
});

/**
 * @swagger
 * /api/v1/auth/self:
 *   get:
 *     tags:
 *       - auth
 *     description: Retrieves user data
 *     parameters:
 *          - in: header
 *            name: Authorization
 *            description: Bearer Token
 *            type: string
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *         description: Returns an error message - Unauthorized
 *       200:
 *         description: Returns user data
 *       500:
 *         description: Returns an error message - Exception
 */
authRouter.get('/self',auth.verifyToken,(req,res) => {
    console.log(req.userData);
    authRepo.getProfileData(req.userData.email,(err,rows) => {
        let numRows = 0;
        if(err) throw err;
        if(rows[0]) numRows++;
        return res.status(200).send({
            success: true,
            numRows,
            data: rows[0]
        });
    });
});

module.exports = authRouter;