 import User from '../model/User.model.js'
 import bcrypt from 'bcrypt';
 import { verificationToken } from '../utils/generateVarificationCode.js'
import { generateTokenAndSetCookie } from '../utils/generateTokenandSetCookie.js';
import { sendVerificationEmail, sendwelcomeEmail } from '../mailtrap/emails.js';
 const signup = async(req , res)=>{
    const {name , email , password} = req.body;
    console.log(req.body);
    try {
        if(!email || !password || !name){
            throw new Error(`All fields must be required`);
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({message:`User with this email already exists` , success:false});
        }
        const hashPassword = await bcrypt.hash(password , 10);
        const verificationTokencode = verificationToken()
        const newUser = new User({
            name,
            email,
            password:hashPassword,
            verificationToken:verificationTokencode,
            verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
        });
       await newUser.save()
       //jwt generate token and set cookie
       generateTokenAndSetCookie(res , newUser._id)
       await sendVerificationEmail(newUser.email , newUser.name , verificationTokencode);
       return res.status(200).json({message:`user created successfully` , success:true , user:{
        ...newUser._doc,
        password:undefined,
       }});
    } catch (error) {
        console.log(error);
    }
   
}


const verifyEmail= async (req , res)=>{
    const { code } = req.body;
    console.log("code-------->",req.body);
    try{
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            res.status(404).json({message: 'Invalid verification code'})
        }
        user.isVarified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendwelcomeEmail(user.email, user.name);
        res.status(200).json({message: 'Email verified successfully', success: true ,user:{...user._doc , password:undefined}});
    }catch(err){
        console.log(err);
    }
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
    verifyEmail
}