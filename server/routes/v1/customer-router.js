const { Router } = require('express');
const customerRepo = require('../../models/customer');
const auth = require('../../middleware/auth');
const customerRouter = Router();


/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     tags:
 *       - customers
 *     description: Returns all customers
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
customerRouter.get('/',auth.verifyToken,(req,res) => {
    customerRepo.findAll((err,rows) => {
        if(err) throw err;
        res.status(200).send({ success: true, numRows: rows.length, rows});
    });
});


/**
 * @swagger
 * /api/v1/customers/{id}:
 *   get:
 *     tags:
 *       - customers
 *     description: Returns customer by id
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
customerRouter.get('/:id',auth.verifyToken,(req,res) => {
    const id = parseInt(req.params.id);
    customerRepo.findById(id,(err,customer) => {
        let numRows = 0;
        if(err) throw err;
        if(customer) numRows++;
        res.status(200).send({ success: true, numRows, data: customer});
    });
});


/**
 * @swagger
 * /api/v1/customers/:
 *   post:
 *     tags:
 *       - customers
 *     description: Add a customer
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

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   put:
 *     tags:
 *       - customers
 *     description: Update a customer
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
 *         required: true
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
customerRouter.put('/:id', auth.verifyToken, (req,res) => {
    let customerData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date()
    };
    customerData = Object.assign(customerData,commonProps);
    customerRepo.update(id,customerData,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    })
});

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   delete:
 *     tags:
 *       - customers
 *     description: Delete a customer
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
customerRouter.delete('/:id', auth.verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    const payload = {
        active: false,
        deleted_by: req.userData.email,
        delete_date: new Date()
    };
    customerRepo.delete(id,payload,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    });
});

module.exports = customerRouter;