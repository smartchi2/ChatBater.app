// import jwt from "jsonwebtoken"


// export const generateToken = (userId, res) => {
//     console.log(process.env.JWT_SECRET)
//      const token = jwt.sign({userId}, process.env.JWT_SECRET, {
//         expiresIn:"7d",
// })

// res.cookie("jwt", token, {
//     maxAge: 7 * 24 * 60 * 60 * 1000, // MS
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development"
// });

// return token;

// }

import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, {
        
        httpOnly: true,
        secure: process.env.NODE_ENV !== "develpoment",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
    console.log(token)
};

// import jwt from "jsonwebtoken";

// export const createToken = (user) => {
//     return jwt.sign(
//         { userId: user._id }, // Change this to `id` if needed
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//     );

// };

