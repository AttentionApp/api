const { Router } = require('express');
const nurseRepo = require('../../models/nurse');
const auth = require('../../middleware/auth');

const nurseRouter = Router();

/**
 * @swagger
 * /api/v1/nurses:
 *   get:
 *     tags:
 *       - nurses
 *     description: Returns all nurses
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of nurses
 *       401:
 *         description: Unauthorized
 */
nurseRouter.get('/',auth.verifyToken, (req,res) => {
    nurseRepo.findAll((err,rows) => {
        if(err) throw err;
        res.status(200).send({success: true, numRows: rows.length, rows});
    });
});

/**
 * @swagger
 * /api/v1/nurses/{id}:
 *   get:
 *     tags:
 *       - nurses
 *     description: Returns nurse by id
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         description: Nurse Id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Nurse Data
 *       401:
 *         description: Unauthorized
 */
nurseRouter.get('/:id',auth.verifyToken,(req,res) => {
    const id = parseInt(req.params.id);
    nurseRepo.findById(id,(err,nurse) => {
        let numRows = 0;
        if(err) throw err;
        if(nurse) numRows++;
        res.status(200).send({ success: true, numRows, data: nurse});
    });
});


/**
 * @swagger
 * /api/v1/nurses/:
 *   post:
 *     tags:
 *       - nurses
 *     description: Add a nurse
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: first_name
 *         type: string
 *         in: formData
 *         required: true
 *       - name: last_name
 *         type: string
 *         in: formData
 *         required: true
 *       - name: short_name
 *         type: string
 *         in: formData
 *         required: true
 *       - name: code_identification
 *         type: string
 *         in: formData
 *         required: true
 *       - name: gender
 *         type: string
 *         in: formData
 *         required: true
 *       - name: qualification
 *         type: number
 *         in: formData
 *         required: false
 *       - name: thumbnail_image
 *         type: string
 *         in: formData
 *         required: false
 *       - name: comment
 *         type: string
 *         in: formData
 *         required: false
 *       - name: description
 *         type: string
 *         in: formData
 *         required: false
 *       - name: idnursetype
 *         type: integer
 *         in: formData
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Insert Id
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/v1/nurses/{id}:
 *   put:
 *     tags:
 *       - nurses
 *     description: Update a nurse
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: first_name
 *         type: string
 *         in: formData
 *         required: true
 *       - name: last_name
 *         type: string
 *         in: formData
 *         required: true
 *       - name: short_name
 *         type: string
 *         in: formData
 *         required: true
 *       - name: code_identification
 *         type: string
 *         in: formData
 *         required: true
 *       - name: gender
 *         type: string
 *         in: formData
 *         required: true
 *       - name: qualification
 *         type: number
 *         in: formData
 *         required: false
 *       - name: thumbnail_image
 *         type: string
 *         in: formData
 *         required: false
 *       - name: comment
 *         type: string
 *         in: formData
 *         required: false
 *       - name: description
 *         type: string
 *         in: formData
 *         required: false
 *       - name: idnursetype
 *         type: integer
 *         in: formData
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A message if complete successfully
 *       401:
 *         description: Unauthorized
 */
nurseRouter.put('/:id', auth.verifyToken, (req,res) => {
    let nurseData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date()
    };
    nurseData = Object.assign(nurseData,commonProps);
    nurseRepo.update(id,nurseData,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    });
});

/**
 * @swagger
 * /api/v1/nurses/{id}:
 *   delete:
 *     tags:
 *       - nurses
 *     description: Delete a nurse
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A message if complete successfully
 *       401:
 *         description: Unauthorized
 */
nurseRouter.delete('/:id',auth.verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    const payload = {
        active: false,
        deleted_by: req.userData.email,
        delete_date: new Date()
    }
    nurseRepo.delete(id,payload,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    });
});

module.exports = nurseRouter;