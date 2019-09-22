const { Router } = require('express');
const userRepo = require('../../models/user');
const { verifyToken } = require('../../middleware/auth');
const userRouter = Router();
const { CollectionResponse, DataResponse } = require('../../responses/common/Responses');

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - users
 *     description: CollectionResponse - Returns all users
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *       401:
 *         description: Unauthorized
 */
userRouter.get('/', verifyToken, (req,res,next) => {
    userRepo.findAll((err,rows) => {
        if(err) next(err);
        res.status(200).send(new CollectionResponse(true,rows.length,rows));
    });
});


/**
 * @swagger
 * /api/v1/users/:id:
 *   get:
 *     tags:
 *       - users
 *     description: DataResponse - Returns user by id
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer Token
 *         type: string
 *       - name: id
 *         description: User Id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A user
 *       401:
 *         description: Unauthorized
 */
userRouter.get('/:id', verifyToken, (req,res,next) => {
    const id = parseInt(req.params.id);
    userRepo.findById(id,(err,user) => {
        let numRows = 0;
        if(err) next(err);
        if(user) numRows++;
        res.status(200).send(new DataResponse(true,numRows,user));
    });
});

module.exports = userRouter;