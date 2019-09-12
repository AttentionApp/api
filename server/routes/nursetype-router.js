const { Router } = require('express');
const nurseTypeRepo = require('../models/nursetype');
const auth = require('../middleware/auth');

const nurseTypeRouter = Router();

nurseTypeRouter.get('/',auth.verifyToken, (req,res) => {
    nurseTypeRepo.findAll((err,rows) => {
        if(err) throw err;
        res.status(200).send({success: true, numRows: rows.length, rows});
    });
});

nurseTypeRouter.get('/:id',auth.verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    nurseTypeRepo.findById(id,(err,nursetype) => {
        if(err) throw err;
        res.status(200).send({sucess: true, numRows: 1, nursetype});
    })
});

nurseTypeRouter.post('/',auth.verifyToken,(req,res) => {
    let nurseTypeData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    nurseTypeData = Object.assign(nurseTypeData,commonProps);
    nurseTypeRepo.save(nurseTypeData,(err,insertId) => {
        if(err) throw err;
        res.status(201).send({success: true, insertId});
    });
});

nurseTypeRouter.put('/:id', auth.verifyToken, (req,res) => {
   let nurseTypeData = req.body;
   const id = parseInt(req.params.id);
   const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date(),
        modify_reason: 'UPDATE'
   };
   nurseTypeData = Object.assign(nurseTypeData,commonProps);
   nurseTypeRepo.update(id,nurseTypeData,(err,message) => {
       if(err) throw err;
       res.status(200).send({success:true, message});
   });
});

nurseTypeRouter.delete('/:id',auth.verifyToken,(req,res) => {
    const id = parseInt(req.params.id);
    nurseTypeRepo.delete(id,(err,message) => {
        if(err) throw err;
        res.status(200).send({sucess: true, message});
    });
});

module.exports = nurseTypeRouter;