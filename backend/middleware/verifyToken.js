import jwt from 'jsonwebtoken'

export const verifyToken = (req , res , next) =>{
    const token = req.cookies.token;
    try{
       if(!token){
           return res.status(401).json({message:"Unauthorized"})
       }
       const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
       if(!decoded){
           return res.status(401).json({message:"Unauthorized"})
       }
       req.userId = decoded.userId;
       next();
   }catch(e){
    console.log(e);
    return res.status(500).json({message:"severe error" , status:false});
   }
}