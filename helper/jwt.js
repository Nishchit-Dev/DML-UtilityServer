const jwt = require('jsonwebtoken')

const jwtObj = {}

jwtObj.generateToken = (data)=>{
    var token = jwt.sign(data,process.env.TokenSecretKey,{expiresIn:'1d'})
    return token;
}

jwtObj.verifyToken = (token,wallet)=>{
    var decode = jwt.verify(token,TokenSecretKey||process.env.TokenSecretKey )
     if(decode.walletAd == wallet){
         return true
     }else{
         return false;
     }
}

module.exports  = jwtObj;