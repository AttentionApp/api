const { Router } = require('express');
const userRepo = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_KEY } = require('../../util/constants');

const authRouter = Router();

authRouter.post('/signup', (req,res) => {
    userRepo.findByEmail(req.body.email, (err,rows) => {
        if (rows.length >= 1)
            return res.status(409).send({message: 'Email already in use'});
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
                    res.status(201).send({message: "User registered successfully"});
                }
            });
        }
    });
});

authRouter.post('/login', (req,res) => {
    userRepo.findByEmail(req.body.email, (err,rows) => {
        if(err) throw err;
        if(rows.length < 1)
            return res.status(401).send({ message: 'User doesn\'t exists.' });
        bcrypt.compare(req.body.password, rows[0].password, (err,result) => {
            if(err)
                return res.status(401).send({message: 'Invalid password'});
            if(result){
                const payload = {
                    uid: rows[0].id,
                    email: rows[0].email
                };
                //Create token
                const token = jwt.sign(
                    payload,
                    JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                );
                return res.status(200).send({
                    message: 'Auth completed successfully',
                    userData: payload,
                    token: token
                });
            }
            return res.status(401).send({message:'Auth failed'});
        });
    })
});

module.exports = authRouter;