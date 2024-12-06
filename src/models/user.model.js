// import mongoose from "mongoose";

// const useSchema = new mongoose.Schema(
//     {
//         phoneNumber: {
//             type: String,
//             required: true,
//             unique: true,
//         },
//         email:{
//          type: String,
//          reguired: true,
//         },
//         fullName: {
//             type: String,
//             required: true,
//         },
//         password: {
//           type: String,
//           required: true,
//           minlength: 4,
//         },
//         profilePic:{
//             type: String,
//             default: "",     
//         },
//         timeStamps:{ type: Date, default: Date.now },
        

//     },
// );
// const User = mongoose.model("User", useSchema);
// export default User;

import mongoose from "mongoose";

const useSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,  
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
        },
        profilePic: {
            type: String,
            default: "",     
        },
    },
    { timestamps: true } 
);


const User = mongoose.model("User", useSchema);
export default User;

