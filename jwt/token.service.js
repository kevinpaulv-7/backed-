const jwt =require('jsonwebtoken')
const JWT_SECRET=process.env.jwt_secret
class TokenService{
    generateToken(payload){
        return jwt.sign(payload,JWT_SECRET,{expiresIn:"1h"})
    }
}
module.exports=new TokenService();