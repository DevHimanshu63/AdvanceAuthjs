import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (res, userId) => {
    try {
      console.log("generateTokenAndSetCookie function called", res, userId);
      const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",  // Adjust based on environment
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      console.log("token------->", token);
      return token;
    } catch (error) {
      console.error("Error generating token and setting cookie", error);
    }
  };
  











// export const generateTokenAndSetCookie =(res , userId)=>{
//     const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
//     res.cookie("token",token,{
//         httpOnly:true,
//         secure:process.env.NODE_ENV === "development",
//         sameSite:"lax",
//         maxAge:7 * 24 * 60 * 60 * 1000
//     })
//     return token;
// }