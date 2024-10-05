import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";
import { mailTrapclient , sender } from "./mailtrap.config.js";

export const sendVerificationEmail= async (email , name ,verificationToken)=>{
    const recipients = [{email}]
    try{
        
        const response = await mailTrapclient.send({
            from: sender,
            to: recipients,
            subject: "Verify your email",
            text: `Your verification token is: ${verificationToken}`,
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken).replace("{name}",name),
            category: "Account Verification",
        });
        console.log("Email sent successfully", response);
    }catch(error){
        console.log("Error sending email",error)
     throw new Error(`Error sending email: ${error}`)
    }
}

export const sendwelcomeEmail = async (email , name)=>{
    const recipients = [{email}];
    try{
        let response = await mailTrapclient.send({
            from: sender,
            to: recipients,
            subject: "Welcome to our platform",
            text: `Welcome to our platform ${name}, we're thrilled to have you!`,
            html: `Welcome to our platform ${name}, we're thrilled to have you!`,
            category: "Welcome Email",
        })
        console.log("Email sent successfully", response);
    }catch(err){
        console.log(err);
        
    }
}

export const sendResetPasswordEmail=async(email , resetURL) => {
    const recipients =[{email}];
    try{
        const response  = await mailTrapclient.send({
            from: sender ,
            to: recipients,
            subject: "Reset Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Reset Password",
        })
        console.log('forgot password link sent successfully', response);
    }catch(err){
        console.log(err);
        throw new Error(`Error sending forgot password email: ${err}`)  
    }

}

export const sendResetSuccessEmail = async(email)=>{
    const participants = [{email}];
    try{
        const response  = await mailTrapclient.send({
            from: sender,
            to: participants,
            subject: "Password Reset Successful",
            text: "Your password has been reset successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Password Success",
        })
        console.log('Password reset success email sent successfully', response);
    }
    catch(err){
        console.log(err);
        throw new Error(`Error sending password reset success email: ${err}`)
    }
}