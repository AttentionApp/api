const { Router } = require('express');
const reservationRepo = require('../../models/reservation');
const auth = require('../../middleware/auth');
const reservationRouter = Router();

/**
 * @swagger
 * /api/v1/reservations:
 *   get:
 *     tags:
 *       - reservations
 *     description: Returns all reservations
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
reservationRouter.get('/',auth.verifyToken,(req,res) => {
    reservationRepo.findAll((err,rows) => {
        if(err) throw err;
        res.status(200).send({ success: true, numRows: rows.length, rows});
    });
});

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   get:
 *     tags:
 *       - reservations
 *     description: Returns reservation by id
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
reservationRouter.get('/:id',auth.verifyToken,(req,res) => {
    const id = parseInt(req.params.id);
    reservationRepo.findById(id,(err,reservation) => {
        let numRows = 0;
        if(err) throw err;
        if(reservation) numRows++;
        res.status(200).send({ success: true, numRows, data: reservation});
    });
});


/**
 * @swagger
 * /api/v1/reservations/:
 *   post:
 *     tags:
 *       - reservations
 *     description: Add a reservation
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
reservationRouter.post('/',auth.verifyToken, (req,res) => {
    let reservationData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    reservationData = Object.assign(reservationData,commonProps);
    reservationRepo.save(reservationData,(err,insertId) => {
        if(err) throw err;
        res.status(201).send({success: true ,insertId});
    });
});

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   put:
 *     tags:
 *       - reservations
 *     description: Update a reservation
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
reservationRouter.put('/:id', auth.verifyToken, (req,res) => {
    let reservationData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date()
    };
    reservationData = Object.assign(reservationData,commonProps);
    reservationRepo.update(id,reservationData,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    })
});

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   delete:
 *     tags:
 *       - reservations
 *     description: Delete a reservation
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
reservationRouter.delete('/:id', auth.verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    const payload = {
        active: false,
        deleted_by: req.userData.email,
        delete_date: new Date()
    };
    reservationRepo.delete(id,payload,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    });
});

module.exports = reservationRouter;