//Dependencies
const { verify } = require('jsonwebtoken');

let auth = {}
const { JWT_KEY } = require('../util/constants');

const { StatusResponse } = require('../responses/common/Responses');

auth.verifyToken = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verify(token,JWT_KEY,{
            ignoreExpiration: true
        });
        req.userData = decoded;
        next();
    } catch(err) {
        return res.status(401).send(new StatusResponse(false,"Unauthorized"));
    }
}

module.exports = auth;