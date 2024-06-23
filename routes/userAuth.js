const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null){
        return res.status(401).json({message:"Authentication Token Required"})
    }

    jwt.verify(token, "BookStore146",(err, user) => {
        if (err) {
            return res.status(403).json({message: "Token Expired. SignIn Again"})
        }
        req.user = user;
        next();
        })
}

module.exports = { authToken }


    
