const jwt = require('jsonwebtoken')

const verifyCookies = (req, res, next) => {
    let token = req.cookies.jwt
    if (!token){
        return res.status(403).send()
    }
    req.token = token
    next()
}

module.exports = verifyCookies