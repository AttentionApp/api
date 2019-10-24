const { Router } = require('express');
const nurseRepo = require('../../models/nurse');
const auth = require('../../middleware/auth');
const nurseRouter = Router();
const { CollectionResponse, DataResponse, StatusResponse, PostResponse } = require('../../responses/common/Responses');

/**
 * @swagger
 * /api/v1/nurses:
 *   get:
 *     tags:
 *       - nurses
 *     description: CollectionResponse - Returns all nurses
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
nurseRouter.get('/',auth.verifyToken, (req,res,next) => {
    nurseRepo.findAll((err,rows) => {
        if(err) next(err);
        res.status(200).send(new CollectionResponse(true,rows.length,rows));
    });
});

/**
 * @swagger
 * /api/v1/nurses/filter:
 *   get:
 *     tags:
 *       - nurses
 *     description: CollectionResponse - Returns all available nurses who don't have reservations for the given start and end datetime
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: start_date
 *         type: string
 *         in: formData
 *       - name: end_date
 *         type: string
 *         in: formData
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of nurses
 *       401:
 *         description: Unauthorized
 */
nurseRouter.get('/filter',auth.verifyToken, (req,res,next) => {
    nurseRepo.findByReservations((err,rows) => {
        if(err) next(err);
        res.status(200).send(new CollectionResponse(true,rows.length,rows));
    });
});

/**
 * @swagger
 * /api/v1/nurses/{id}:
 *   get:
 *     tags:
 *       - nurses
 *     description: DataResponse - Returns nurse by id
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
nurseRouter.get('/:id',auth.verifyToken,(req,res,next) => {
    const id = parseInt(req.params.id);
    nurseRepo.findById(id,(err,nurse) => {
        let numRows = 0;
        if(err) next(err);
        if(nurse) numRows++;
        res.status(200).send(new DataResponse(true,numRows,nurse));
    });
});


/**
 * @swagger
 * /api/v1/nurses/:
 *   post:
 *     tags:
 *       - nurses
 *     description: PostResponse - Add a nurse
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
nurseRouter.post('/',auth.verifyToken,(req,res,next) => {
    let nurseData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    nurseData = Object.assign(nurseData,commonProps);
    nurseRepo.save(nurseData,(err,insertId) => {
        if(err) next(err);
        res.status(201).send(new PostResponse(true,insertId));
    });
});

/**
 * @swagger
 * /api/v1/nurses/{id}:
 *   put:
 *     tags:
 *       - nurses
 *     description: StatusResponse - Update a nurse
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
nurseRouter.put('/:id', auth.verifyToken, (req,res,next) => {
    let nurseData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date()
    };
    nurseData = Object.assign(nurseData,commonProps);
    nurseRepo.update(id,nurseData,(err,message) => {
        if(err) next(err);
        res.status(200).send(new StatusResponse(true,message));
    });
});

/**
 * @swagger
 * /api/v1/nurses/{id}:
 *   delete:
 *     tags:
 *       - nurses
 *     description: StatusResponse - Delete a nurse
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
nurseRouter.delete('/:id',auth.verifyToken, (req,res,next) => {
    const id = parseInt(req.params.id);
    const payload = {
        active: false,
        deleted_by: req.userData.email,
        delete_date: new Date()
    }
    nurseRepo.delete(id,payload,(err,message) => {
        if(err) next(err);
        res.status(200).send(new StatusResponse(true,message));
    });
});

module.exports = nurseRouter;