const { Router } = require('express');
const nursetypeRepo = require('../../models/nursetype');
const auth = require('../../middleware/auth');
const nursetypeRouter = Router();

/**
 * @swagger
 * /api/v1/nursetypes:
 *   get:
 *     tags:
 *       - nursetypes
 *     description: Returns all nursetypes
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of nursetypes
 *       401:
 *         description: Unauthorized
 */
nursetypeRouter.get('/',auth.verifyToken,(req,res) => {
    nursetypeRepo.findAll((err,rows) => {
        if(err) throw err;
        res.status(200).send({ success: true, numRows: rows.length, rows});
    });
});

/**
 * @swagger
 * /api/v1/nursetypes/{id}:
 *   get:
 *     tags:
 *       - nursetypes
 *     description: Returns nursetype by id
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         description: Nurse Type Id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A nursetype
 *       401:
 *         description: Unauthorized
 */
nursetypeRouter.get('/:id',auth.verifyToken,(req,res) => {
    const id = parseInt(req.params.id);
    nursetypeRepo.findById(id,(err,nursetype) => {
        let numRows = 0;
        if(err) throw err;
        if(nursetype) numRows++;
        res.status(200).send({ success: true, numRows, nursetype });
    });
});

module.exports = nursetypeRouter;