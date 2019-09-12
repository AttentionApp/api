const { Router } = require('express');
const customerRepo = require('../models/customer');
const auth = require('../middleware/auth');
const customerRouter = Router();

customerRouter.get('/',auth.verifyToken,(req,res) => {
    customerRepo.findAll((err,rows) => {
        if(err) throw err;
        res.status(200).send({ success: true, numRows: rows.length, rows});
    });
});

customerRouter.get('/:id',auth.verifyToken,(req,res) => {
    const id = parseInt(req.params.id);
    customerRepo.findById(id,(err,customer) => {
        if(err) throw err;
        res.status(200).send({ success: true, numRows: 1, customer});
    });
});

customerRouter.post('/',auth.verifyToken, (req,res) => {
    let customerData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    customerData = Object.assign(customerData,commonProps);
    customerRepo.save(customerData,(err,insertId) => {
        if(err) throw err;
        res.status(201).send({success: true ,insertId});
    });
});

customerRouter.put('/:id', auth.verifyToken, (req,res) => {
    let customerData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date(),
        modify_reason: 'UPDATE'
    };
    customerData = Object.assign(customerData,commonProps);
    customerRepo.update(id,customerData,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    })
});

customerRouter.delete('/:id', auth.verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    customerRepo.delete(id,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    });
});

module.exports = customerRouter;