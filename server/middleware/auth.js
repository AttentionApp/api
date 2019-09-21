//Dependencies
const { verify } = require('jsonwebtoken');

let auth = {}
const { JWT_KEY } = require('../util/constants');

auth.verifyToken = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verify(token,JWT_KEY,{
            ignoreExpiration: true
        });
        req.userData = decoded;
        next();
    } catch(err) {
        console.log(err.message);
        return res.status(401).send({message: 'Unauthorized'});
    }
}

module.exports = auth;