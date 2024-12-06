import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";


export const getUserForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 50; // Adjust based on your preference
        const skip = (page - 1) * limit;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
            .select("-password")
            .skip(skip)
            .limit(limit);

        if (filteredUsers.length === 0) {
            return res.status(404).json({ message: "No users available" });
        }

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUserForSideBar:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;

        // Validate senderId and receiverId
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid senderId or receiverId format" });
        }

        // Find messages
        const messages = await Message.find({
            senderId,
            receiverId,
        }).sort({ timeStamp: -1 });

        res.status(200).json({ messages });
        console.log(messages)
    } catch (error) {
        console.error("Error in getMessages controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
};
export const sendMessage = async (req, res) => {
    try {
        const {text, image, video} = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id 

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        const receiverIdSocketId = getReceiverSocketId(receiverId)
        if(receiverIdSocketId){
          io.to(receiverIdSocketId).emit("newMessage", newMessage)  
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({error: "Internal server error"})
        
    }
}