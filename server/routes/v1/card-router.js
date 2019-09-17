const { Router } = require('express');
const cardRepo = require('../../models/card');
const auth = require('../../middleware/auth');
const cardRouter = Router();

/**
 * @swagger
 * /api/v1/cards:
 *   get:
 *     tags:
 *       - cards
 *     description: Returns all cards
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of cards
 *       401:
 *         description: Unauthorized
 */
cardRouter.get('/',auth.verifyToken,(req,res) => {
    cardRepo.findAll((err,rows) => {
        if(err) throw err;
        res.status(200).send({ success: true, numRows: rows.length, rows});
    });
});

/**
 * @swagger
 * /api/v1/cards/{id}:
 *   get:
 *     tags:
 *       - cards
 *     description: Returns card by id
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         description: Card Id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A card
 *       401:
 *         description: Unauthorized
 */
cardRouter.get('/:id',auth.verifyToken,(req,res) => {
    const id = parseInt(req.params.id);
    cardRepo.findById(id,(err,card) => {
        let numRows = 0;
        if(err) throw err;
        if(card) numRows++;
        res.status(200).send({ success: true, numRows, data: card});
    });
});

/**
 * @swagger
 * /api/v1/cards/:
 *   post:
 *     tags:
 *       - cards
 *     description: Add a card
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: idcustomer
 *         type: integer
 *         in: formData
 *         required: true
 *       - name: bank_name
 *         type: string
 *         in: formData
 *         required: true
 *       - name: account_number
 *         type: string
 *         in: formData
 *         required: true
 *       - name: discount
 *         type: boolean
 *         in: formData
 *         required: false
 *       - name: response
 *         type: string
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
cardRouter.post('/',auth.verifyToken, (req,res) => {
    let cardData = req.body;
    const commonProps = {
        created_by: req.userData.email,
        create_date: new Date(),
        active: true
    };
    cardData = Object.assign(cardData,commonProps);
    cardRepo.save(cardData,(err,insertId) => {
        if(err) throw err;
        res.status(201).send({success: true ,insertId});
    });
});

/**
 * @swagger
 * /api/v1/cards/{id}:
 *   put:
 *     tags:
 *       - cards
 *     description: Update a card
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
 *       - name: bank_name
 *         type: string
 *         in: formData
 *         required: true
 *       - name: account_number
 *         type: string
 *         in: formData
 *         required: true
 *       - name: discount
 *         type: boolean
 *         in: formData
 *         required: false
 *       - name: response
 *         type: string
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
cardRouter.put('/:id', auth.verifyToken, (req,res) => {
    let cardData = req.body;
    const id = parseInt(req.params.id);
    const commonProps = {
        modified_by: req.userData.email,
        modify_date: new Date()
    };
    cardData = Object.assign(cardData,commonProps);
    cardRepo.update(id,cardData,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    })
});

/**
 * @swagger
 * /api/v1/cards/{id}:
 *   delete:
 *     tags:
 *       - cards
 *     description: Delete a card
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
cardRouter.delete('/:id', auth.verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    const payload = {
        active: false,
        deleted_by: req.userData.email,
        delete_date: new Date()
    };
    cardRepo.delete(id,payload,(err,message) => {
        if(err) throw err;
        res.status(200).send({success: true, message});
    });
});

module.exports = cardRouter;