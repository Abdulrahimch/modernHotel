const angularAuth  = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')

    if (!token){
        return res.status(403).send()
    }
    req.token = token
    next()
}

module.exports = angularAuth