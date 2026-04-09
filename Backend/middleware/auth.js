const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    let token=req.headers.authorization;

    if(! token){
        return res.status(401).json({message:"No token"});
    }

    try{
        if (token.startsWith('Bearer ')) token = token.split(' ')[1];
        
        if (!token || token === "" || token === "undefined") {
            return res.status(401).json({message:"Malformed token"});
        }

        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (err) {
        res.status(401).json({message:"Invalid token"});
    }
};