import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {

    const {fullName, phoneNumber, password, email} = req.body
 try{

    if(!fullName ||!phoneNumber ||!password ||!email){
        return res.status(400).json({message: "Fields must not be empty"})
    }

    if(password.length < 4){
        return res.status(400).json({message: "Password must be at least 4 characters"})
    }

    const user = await User.findOne({phoneNumber})

    if(user) return res.status(400).json({message: "Phone number already exists"});



    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
    fullName,
    phoneNumber,
    email,
    password:hashedPassword,
        
    })

    if(newUser){
    generateToken(newUser._id, res)
    await newUser.save();

    res.status(201).json({
        _id:newUser._id,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        profilePic: newUser.profilePic,
    });

    }else{
    res.status(400).json({message: "Invalid user data"});
    }

 }catch(error){
    console.log("Error in signup controller", error.message)
    res.status(500).json({message: "Internal Server Error"});
 }
 
};

export const login = async (req, res) => {
    const {phoneNumber, password} = req.body
    try{
        const user = await User.findOne({phoneNumber})
        if (!user) {
            return res.status(400).json({ message: "Invalid credential" });
        }
        
     const isPasswordValid = await bcrypt.compare(password , user.password)
     if(!isPasswordValid){
        return res.status(400).json({message: "Invalid credentials"})
     }
     console.log("no error 3:", isPasswordValid)
     generateToken(user._id, res)

     res.status(200).json({
        _id:user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,

     })

    }catch(error){
    console.log("Error in login controller", error.message)
    res.status(500).json({message: "Internal Server Error"})
    }
};

// export const logout = (req, res) => {
//     try{
//         res.cookie("jwt", "", {maxAge:0})
//         res.status(200).json({message: "Logged out successfully"})

//     }catch(error){
//         console.log("Error in login controller", error.message)
//         res.status(500).json({message: "Internal Server Error"})


//     }
// };
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { 
            maxAge: 0,           
            httpOnly: true,      
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict", 
            path: "/"           
        });
        
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateProfile = async(req, res) => {
    try{
    const {profilePic} = req.body;
    const userId =  req.user._id;
      

      if(!profilePic){
        return res.status(400).json({message: "Profile picture is required"});
      }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updateUser = await User.findByIdAndUpdate(
        userId,
        {profilePic:uploadResponse.secure_url}, 
        {new:true}
    )
    
    res.status(200).json(updateUser)

}catch(error){
    console.log("error in update profile:", error)
    res.status(500).json({message: "Internal server error"});

    }

};

export  const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }

}


// import { generateToken } from "../lib/utils.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import cloudinary from "../lib/cloudinary.js";

// export const signup = async (req, res) => {
//     const { fullName, phoneNumber, password, email } = req.body;

//     try {
//         if (!fullName || !phoneNumber || !password || !email) {
//             return res.status(400).json({ message: "Fields must not be empty" });
//         }

//         if (password.length < 4) {
//             return res.status(400).json({ message: "Password must be at least 4 characters" });
//         }

//         // Email validation
//         const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (!emailPattern.test(email)) {
//             return res.status(400).json({ message: "Invalid email format" });
//         }

//         const user = await User.findOne({ phoneNumber });
//         if (user) return res.status(400).json({ message: "Phone number already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new User({
//             fullName,
//             phoneNumber,
//             email,
//             password: hashedPassword,
//         });

//         if (newUser) {
//             generateToken(newUser._id, res);
//             await newUser.save();

//             res.status(201).json({
//                 _id: newUser._id,
//                 fullName: newUser.fullName,
//                 phoneNumber: newUser.phoneNumber,
//                 email: newUser.email,
//                 profilePic: newUser.profilePic,
//             });
//         } else {
//             res.status(400).json({ message: "Invalid user data" });
//         }
//     } catch (error) {
//         console.log("Error in signup controller", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// export const login = async (req, res) => {
//     const { phoneNumber, password } = req.body;
//     try {
//         const user = await User.findOne({ phoneNumber });

//         if (!user) return res.status(400).json({ message: "User not found" });
//         if (!phoneNumber || !password) {
//             return res.status(400).json({ message: "Phone number and password are required" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         generateToken(user._id, res);

//         res.status(200).json({
//             _id: user._id,
//             fullName: user.fullName,
//             phoneNumber: user.phoneNumber,
//             profilePic: user.profilePic,
//         });
//     } catch (error) {
//         console.log("Error in login controller", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// export const logout = (req, res) => {
//     try {
//         res.cookie("jwt", "", { maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production" });
//         res.status(200).json({ message: "Logged out successfully" });
//     } catch (error) {
//         console.log("Error in logout controller", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePic } = req.body;
//         const userId = req.user._id;

//         if (!profilePic) {
//             return res.status(400).json({ message: "Profile picture is required" });
//         }

//         const uploadResponse = await cloudinary.uploader.upload(profilePic);
//         if (!uploadResponse || !uploadResponse.secure_url) {
//             return res.status(500).json({ message: "Profile picture upload failed" });
//         }

//         const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

//         res.status(200).json(updateUser);
//     } catch (error) {
//         console.log("error in update profile:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const checkAuth = (req, res) => {
//     try {
//         res.status(200).json(req.user);
//     } catch (error) {
//         console.log("Error in checkAuth controller", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
