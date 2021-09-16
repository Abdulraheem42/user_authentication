const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const headerToken = req.headers.authorization
    if(!headerToken){
        res.status(401).json({
            status: 401,
            data: null,
            error: "user not authorized"
        })
    }
    try{
        let verified = jwt.verify(headerToken, process.env.TOKEN_KEY)
        // req.body = verified
        next()

    }catch(error){
        res.status(400).send({
            status: 400,
            data: null,
            error: error
        })
    }
}

module.exports = verifyToken