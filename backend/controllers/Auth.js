 import User from '../model/User.model.js'
 import bcrypt from 'bcryptjs';
 import { verificationToken } from '../utils/generateVarificationCode.js'
 const signup = async(req , res)=>{
    const {name , email , password} = req.body;
    try {
        if(!email || !password || !name){
            throw new Error(`All fields must be required`);
        }
        const userAlreadyExists = await User.findone({ email:email});
        if(userAlreadyExists){
            return res.status(400).json({message:`User with this email already exists` , success:false});
        }
        const hashPassword = await bcrypt(password , 10);
        const verificationToken = verificationToken()
        const newUser = new User({
            name,
            email,
            password:hashPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
        });
       await newUser.save()
       //jwt generate token and set cookie
       

    //    return res.status(200).json({message:`user created successfully` , success:true});
    } catch (error) {
        console.log(error);
        
    }
    res.send("sign up routes")
}

 const login = async(req , res)=>{
    res.send("login routes")
}

 const logout = async(req , res)=>{
    res.send("logout routes")
}


export {
    signup,
    login,
    logout,
}