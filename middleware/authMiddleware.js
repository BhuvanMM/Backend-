import jwt from 'jsonwebtoken'

export const authenticate = async(req,res,next)=>{
    try{
        const token = req.headers['authorization']?.split(' ')[1]
        if(!token){
            return res.status(400).json({message:"Token not found!"});
        }
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return res.status(400).json({message:"Inavlid token"})
            }
            req.user = user;
            next()
        })
    }
    catch(error){
        return res.status(500).json({message:"Failed! Something went wrong."})
    }
}