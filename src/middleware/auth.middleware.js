import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { checkAuth } from "../controller/auth.controller.js";

// export const protectRoute = async (req, res, next) => {
//     try{
//         const token = req.jwt
//         if(!token){
//             return res.status(401).json({message: "Unauthorized - No Token Provided"})              
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         if(!decoded){
//            return res.status(401).json({message: "Unauthorized - Invalid Token"}) 
//         }
//         const user = await User.findById(decoded.userId).select("-password");
//         if(!user){
//             return res.status(404).json({message: "User not found"})
//         }
//         req.user = user
//         next()
//     }catch(error){
//         console.log("Error in protectRoute middleware:", error.message)
//         res.status(500).json({message: "Internal server error"})
//     }
// }



// export const protectRoute = async (req, res, next) => {
//     try {
//         const token = req.cookies.jwt
//         if (!token) {
//             return res.status(401).json({ message: "Unauthorized - No Token Provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded JWT:', decoded);  // Inspect the token content

//         if (!decoded) {
//             return res.status(401).json({ message: "Unauthorized - Token decoding failed" });
//         }

//         console.log('Decoded userId:', decoded.userId);  // Log the userId

//         const user = await User.findById(decoded.userId).select("-password");
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         if (error.name === "JsonWebTokenError") {
//             return res.status(401).json({ message: "Unauthorized - Invalid Token" });
//         }
//         if (error.name === "TokenExpiredError") {
//             return res.status(401).json({ message: "Unauthorized - Token Expired" });
//         }

//         console.error("Error in protectRoute middleware:", error.stack);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };



export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; 
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);  
        const userId = decoded.id; 
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - No User ID in Token" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; 
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token Expired" });
        }

        console.error("Error in protectRoute middleware:", error.stack);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export default protectRoute;

