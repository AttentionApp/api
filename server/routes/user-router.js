const { Router } = require('express');
const userRepo = require('../models/user');
const { verifyToken } = require('../middleware/auth');
const userRouter = Router();

userRouter.get('/', verifyToken, (req,res) => {
    userRepo.findAll((err,rows) => {
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send(rows);
    });
});

userRouter.get('/:id', verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    userRepo.findById(id,(err,user) => {
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send(user);
    });
});

module.exports = userRouter;