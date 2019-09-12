const { Router } = require('express');
const nurseRepo = require('../models/nurse');
const auth = require('../middleware/auth');

const nurseRouter = Router();

nurseRouter.get('/',auth.verifyToken, (req,res) => {
    nurseRepo.findAll((err,rows) => {
        if(err) throw err;
        res.status(200).send({success: true, numRows: rows.length, rows});
    });
});

nurseRouter.get('/:id',auth.verifyToken,(req,res) => {
    const id = parseInt(req.params.id);
    nurseRepo.findById(id,(err,nurse) => {
        if(err) throw err;
        res.status(200).send({ success: true, numRows: 1, nurse});
    });
});

nurseRouter.post('/',auth.verifyToken,(req,res) => {
    let nurseData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    nurseData = Object.assign(nurseData,commonProps);
    nurseRepo.save(nurseData,(err,insertId) => {
        if(err) throw err;
        res.status(201).send({success: true, insertId});
    });
});

nurseRouter.put('/:id', auth.verifyToken, (req,res) => {
    let nurseData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date(),
        modify_reason: 'UPDATE'
    };
    nurseData = Object.assign(nurseData,commonProps);
    nurseRepo.update(id,nurseData,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    });
});

nurseRouter.delete('/:id',auth.verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    nurseRepo.delete(id,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    });
});

module.exports = nurseRouter;