const { Router } = require('express');
const customerRepo = require('../../models/customer');
const auth = require('../../middleware/auth');
const customerRouter = Router();
const { CollectionResponse, DataResponse, StatusResponse, PostResponse } = require('../../responses/common/Responses');

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     tags:
 *       - customers
 *     description: CollectionResponse - Returns all customers
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of customers
 *       401:
 *         description: Unauthorized
 */
customerRouter.get('/',auth.verifyToken,(req,res,next) => {
    customerRepo.findAll((err,rows) => {
        if(err) next(err);
        res.status(200).send(new CollectionResponse(true,rows.length,rows));
    });
});


/**
 * @swagger
 * /api/v1/customers/{id}:
 *   get:
 *     tags:
 *       - customers
 *     description: DataResponse - Returns customer by id
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         description: Customer Id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A customer
 *       401:
 *         description: Unauthorized
 */
customerRouter.get('/:id',auth.verifyToken,(req,res,next) => {
    const id = parseInt(req.params.id);
    customerRepo.findById(id,(err,customer) => {
        let numRows = 0;
        if(err) next(err);
        if(customer) numRows++;
        res.status(200).send(new DataResponse(true,numRows,customer));
    });
});


/**
 * @swagger
 * /api/v1/customers/:
 *   post:
 *     tags:
 *       - customers
 *     description: PostResponse - Add a customer
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
 *       - name: gender
 *         type: string
 *         in: formData
 *         required: true
 *       - name: iduser
 *         type: integer
 *         in: formData
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Insert Id
 *       401:
 *         description: Unauthorized
 */
customerRouter.post('/',auth.verifyToken, (req,res,next) => {
    let customerData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    customerData = Object.assign(customerData,commonProps);
    customerRepo.save(customerData,(err,insertId) => {
        if(err) next(err);
        res.status(201).send(new PostResponse(true,insertId));
    });
});

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   put:
 *     tags:
 *       - customers
 *     description: StatusResponse - Update a customer
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
 *       - name: gender
 *         type: string
 *         in: formData
 *         required: false
 *       - name: iduser
 *         type: integer
 *         in: formData
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A message if completes successfully
 *       401:
 *         description: Unauthorized
 */
customerRouter.put('/:id', auth.verifyToken, (req,res,next) => {
    let customerData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date()
    };
    customerData = Object.assign(customerData,commonProps);
    customerRepo.update(id,customerData,(err,message) => {
        if(err) next(err);
        res.status(200).send(new StatusResponse(true,message));
    })
});

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   delete:
 *     tags:
 *       - customers
 *     description: StatusResponse - Delete a customer
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
customerRouter.delete('/:id', auth.verifyToken, (req,res,next) => {
    const id = parseInt(req.params.id);
    const payload = {
        active: false,
        deleted_by: req.userData.email,
        delete_date: new Date()
    };
    customerRepo.delete(id,payload,(err,message) => {
        if(err) next(err);
        res.status(200).send(new StatusResponse(true,message));
    });
});

module.exports = customerRouter;