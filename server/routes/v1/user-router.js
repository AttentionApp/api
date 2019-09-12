const { Router } = require('express');
const userRepo = require('../../models/user');
const { verifyToken } = require('../../middleware/auth');
const userRouter = Router();


/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - users
 *     description: Returns all users
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
userRouter.get('/', verifyToken, (req,res) => {
    userRepo.findAll((err,rows) => {
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send(rows);
    });
});


/**
 * @swagger
 * /api/v1/users/:id:
 *   get:
 *     tags:
 *       - users
 *     description: Returns user by id
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
userRouter.get('/:id', verifyToken, (req,res) => {
    const id = parseInt(req.params.id);
    userRepo.findById(id,(err,user) => {
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send(user);
    });
});

module.exports = userRouter;