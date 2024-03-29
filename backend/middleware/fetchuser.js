const jwt = require('jsonwebtoken');
const JWT_SECRET =  process.env.JWT_SECRET;

const fetchuser = (req,res,next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).json({success: false, error:'Authenticate with valid Token'});
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(data);
        next();
    }catch(err){
        res.status(401).json({success: false, error: 'Authenticate with a valid token'});
    }
}

module.exports = fetchuser;