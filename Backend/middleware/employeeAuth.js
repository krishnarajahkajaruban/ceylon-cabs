const jwt =require("jsonwebtoken");


const employeeAuth =   (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
            if (err){
                return res.status(401).json({
                    message: "User is not authorized"
                  });
            }
            req.user = decoded;
            next();
        })
        if(!token){
            return res.status(401).json({
                message: "User is not authorized or token is missing"
              });
        }
    } else {
        return res.status(403).json({
            message: "Please give authHeader"
          });
    }
  }

  module.exports = employeeAuth;