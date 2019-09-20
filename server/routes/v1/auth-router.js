const { Router } = require('express');
const userRepo = require('../../models/user');
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
 *     description: Register a user
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
 *       201:
 *         description: Returns a message - User registered successfully
 *       409:
 *         description: Returns a message - Email already in use
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
                    const userData = {
                        email: req.body.email,
                        password: hash,
                        active: true,
                        created_by: req.body.email,
                        create_date: new Date(),
                        modified_by: null,
                        modify_date: null,
                        modify_reason: null
                    };
                    userRepo.save(userData, (err,result) => {
                        console.log(result);
                    });
                    const payload = {
                        email: userData.email
                    };
                    const token = jwt.sign(
                        payload,
                        JWT_KEY,
                        {
                            expiresIn: '0'
                        }
                    );
                    res.status(201).send({success: true, message: "User registered successfully", token, userData: payload });
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
 *         description: Returns an error message - Unauthorized
 *       200:
 *         description: Returns a jwt token, payload and message - Auth completed successfully
 *       
 */
authRouter.post('/login', (req,res) => {
    userRepo.findByEmail(req.body.email, (err,rows) => {
        if(err) throw err;
        if(rows.length < 1)
            return res.status(401).send({ sucess:false, message: 'User doesn\'t exists.' });
        bcrypt.compare(req.body.password, rows[0].password, (err,result) => {
            if(err)
                return res.status(401).send({success: false, message: 'Invalid password'});
            if(result){
                const payload = {
                    uid: rows[0].id,
                    email: rows[0].email
                };
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

module.exports = authRouter;