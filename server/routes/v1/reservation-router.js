const { Router } = require('express');
const reservationRepo = require('../../models/reservation');
const auth = require('../../middleware/auth');
const reservationRouter = Router();
const { CollectionResponse, DataResponse, StatusResponse, PostResponse } = require('../../responses/common/Responses');

/**
 * @swagger
 * /api/v1/reservations:
 *   get:
 *     tags:
 *       - reservations
 *     description: CollectionResponse - Returns all reservations
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of reservations
 *       401:
 *         description: Unauthorized
 */
reservationRouter.get('/',auth.verifyToken,(req,res,next) => {
    reservationRepo.findAll((err,rows) => {
        if(err) next(err);
        res.status(200).send(new CollectionResponse(true,rows.length,rows));
    });
});

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   get:
 *     tags:
 *       - reservations
 *     description: DataResponse - Returns reservation by id
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         description: Reservation Id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A reservation
 *       401:
 *         description: Unauthorized
 */
reservationRouter.get('/:id',auth.verifyToken,(req,res,next) => {
    const id = parseInt(req.params.id);
    reservationRepo.findById(id,(err,reservation) => {
        let numRows = 0;
        if(err) next(err);
        if(reservation) numRows++;
        res.status(200).send(new DataResponse(true,numRows,reservation));
    });
});


/**
 * @swagger
 * /api/v1/reservations/:
 *   post:
 *     tags:
 *       - reservations
 *     description: PostResponse - Add a reservation
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: idcustomer
 *         type: integer
 *         in: formData
 *         required: true
 *       - name: idnurse
 *         type: integer
 *         in: formData
 *         required: true
 *       - name: idcard
 *         type: integer
 *         in: formData
 *         required: true
 *       - name: location
 *         type: string
 *         in: formData
 *         required: false
 *       - name: start_date
 *         type: string
 *         in: formData
 *         required: true
 *       - name: end_date
 *         type: string
 *         in: formData
 *         required: true
 *       - name: amount
 *         type: number
 *         in: formData
 *         required: false
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Insert Id
 *       401:
 *         description: Unauthorized
 */
reservationRouter.post('/',auth.verifyToken, (req,res,next) => {
    let reservationData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    reservationData = Object.assign(reservationData,commonProps);
    reservationRepo.save(reservationData,(err,insertId) => {
        if(err) next(err);
        res.status(201).send(new PostResponse(true,insertId));
    });
});

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   put:
 *     tags:
 *       - reservations
 *     description: StatusResponse - Update a reservation
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: idcustomer
 *         type: integer
 *         in: formData
 *         required: true
 *       - name: idnurse
 *         type: integer
 *         in: formData
 *         required: true
 *       - name: idcard
 *         type: integer
 *         in: formData
 *         required: true
 *       - name: location
 *         type: string
 *         in: formData
 *         required: false
 *       - name: start_date
 *         type: string
 *         in: formData
 *         required: true
 *       - name: end_date
 *         type: string
 *         in: formData
 *         required: true
 *       - name: amount
 *         type: number
 *         in: formData
 *         required: false
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A message if completes successfully
 *       401:
 *         description: Unauthorized
 */
reservationRouter.put('/:id', auth.verifyToken, (req,res,next) => {
    let reservationData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date()
    };
    reservationData = Object.assign(reservationData,commonProps);
    reservationRepo.update(id,reservationData,(err,message) => {
        if(err) next(err);
        res.status(200).send(new StatusResponse(true,message));
    })
});

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   delete:
 *     tags:
 *       - reservations
 *     description: StatusResponse - Delete a reservation
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
 *         description: A message if completes successfully
 *       401:
 *         description: Unauthorized
 */
reservationRouter.delete('/:id', auth.verifyToken, (req,res,next) => {
    const id = parseInt(req.params.id);
    const payload = {
        active: false,
        deleted_by: req.userData.email,
        delete_date: new Date()
    };
    reservationRepo.delete(id,payload,(err,message) => {
        if(err) next(err);
        res.status(200).send(new StatusResponse(true,message));
    });
});

module.exports = reservationRouter;