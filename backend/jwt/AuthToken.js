import jwt from "jsonwebtoken";
//import {} from "../models/user.model.js";
import { User } from "../models/user.model.js";

const createTokenAndSaveCookies = async (userId, res) => {
   const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY,{
    expiresIn: "30d",
   });
   res.cookie("jwt", token, {
     httpOnly: false, // True se false kiye in production nhi krne par production me back aur front connect nhi hoga
     secure: false,
     sameSite: "none",// lax se none kiye
    path: "/", // Ensure the cookie is available throughout the site
   });
  await User.findByIdAndUpdate(userId, {token});
  return token;
};

 export default createTokenAndSaveCookies;
