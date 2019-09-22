const { Router } = require('express');
const scheduleRepo = require('../../models/schedule');
const auth = require('../../middleware/auth');
const scheduleRouter = Router();
const { CollectionResponse, DataResponse, StatusResponse, PostResponse } = require('../../responses/common/Responses');

/**
 * @swagger
 * /api/v1/schedules:
 *   get:
 *     tags:
 *       - schedules
 *     description: CollectionResponse - Returns all schedules
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of schedules
 *       401:
 *         description: Unauthorized
 */
scheduleRouter.get('/',auth.verifyToken,(req,res,next) => {
    scheduleRepo.findAll((err,rows) => {
        if(err) next(err);
        res.status(200).send(new CollectionResponse(true,rows.length,rows));
    });
});

/**
 * @swagger
 * /api/v1/schedules/{id}:
 *   get:
 *     tags:
 *       - schedules
 *     description: DataResponse - Returns schedule by id
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         description: Schedule Id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A schedule
 *       401:
 *         description: Unauthorized
 */
scheduleRouter.get('/:id',auth.verifyToken,(req,res,next) => {
    const id = parseInt(req.params.id);
    scheduleRouter.findById(id,(err,schedule) => {
        let numRows = 0;
        if(err) next(err);
        if(schedule) numRows++;
        res.status(200).send(new DataResponse(true,numRows,schedule));
    });
});

/**
 * @swagger
 * /api/v1/schedules/:
 *   post:
 *     tags:
 *       - schedules
 *     description: PostResponse - Add a schedule
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: idnurse
 *         in: formData
 *         type: integer
 *         required: true
 *       - name: idday
 *         in: formData
 *         type: integer
 *         required: true
 *       - name: idreservation
 *         in: formData
 *         type: integer
 *         required: true
 *       - name: start_hour
 *         in: formData
 *         type: string
 *         required: true
 *       - name: end_hour
 *         in: formData
 *         type: string
 *         required: true
 *       - name: avalaible
 *         in: formData
 *         type: boolean
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Insert Id
 *       401:
 *         description: Unauthorized
 */
scheduleRouter.post('/',auth.verifyToken, (req,res,next) => {
    let scheduleData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    scheduleData = Object.assign(scheduleData,commonProps);
    scheduleRepo.save(scheduleData,(err,insertId) => {
        if(err) next(err);
        res.status(201).send(new PostResponse(true,insertId));
    });
});

/**
 * @swagger
 * /api/v1/schedules/{id}:
 *   put:
 *     tags:
 *       - schedules
 *     description: StatusResponse - Update a schedule
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: idnurse
 *         in: formData
 *         type: integer
 *         required: true
 *       - name: idday
 *         in: formData
 *         type: integer
 *         required: true
 *       - name: idreservation
 *         in: formData
 *         type: integer
 *         required: true
 *       - name: start_hour
 *         in: formData
 *         type: string
 *         required: true
 *       - name: end_hour
 *         in: formData
 *         type: string
 *         required: true
 *       - name: avalaible
 *         in: formData
 *         type: boolean
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A message if completes successfully
 *       401:
 *         description: Unauthorized
 */
scheduleRouter.put('/:id', auth.verifyToken, (req,res,next) => {
    let scheduleData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date()
    };
    scheduleData = Object.assign(scheduleData,commonProps);
    scheduleRepo.update(id,scheduleData,(err,message) => {
        if(err) next(err);
        res.status(200).send(new StatusResponse(true,message));
    })
});

/**
 * @swagger
 * /api/v1/schedules/{id}:
 *   delete:
 *     tags:
 *       - schedules
 *     description: StatusResponse - Delete a schedule
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
scheduleRouter.delete('/:id', auth.verifyToken, (req,res,next) => {
    const id = parseInt(req.params.id);
    const payload = {
        active: false,
        deleted_by: req.userData.email,
        delete_date: new Date()
    };
    scheduleRepo.delete(id,payload,(err,message) => {
        if(err) next(err);
        res.status(200).send(new StatusResponse(true,message));
    });
});

module.exports = scheduleRouter;