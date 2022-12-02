const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    try {
        //console.log(req.headers)
        const token = req.headers.authorization.split(" ")[1];
        //const token = req.body.token;
        //console.log(7,token);
        const verify = jwt.verify(token,'secret')
        console.log(verify);
        next()
    } 
    catch (error) {
        console.log(error)
        return res.status(401).json({
            msg:'invalid token'
        })
    }
}
