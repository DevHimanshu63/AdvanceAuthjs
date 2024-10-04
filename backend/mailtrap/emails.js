import { VERIFICATION_EMAIL_TEMPLATE ,  } from "./emailTemplate.js";
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