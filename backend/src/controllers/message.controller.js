import cloudinary from "../lib/cloudinary.js";
import User from "../models/auth.model.js";
import { Message } from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers)
    }
    catch(err){
        console.log("Error in getUsersForSidebar", err);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export const getMessages = async (req, res) => {
    try{
        const conversationId = req.params.id;
        const senderId = req.user._id;

        const messages = await Message.find({conversationId})
        .sort({createdAt: 1})
        .populate('senderId', 'name email')
        .populate('receiverId', 'name email');
        
        res.status(200).json(messages);
    }
    catch(err){
        console.log('Error in getMessages controllers', err);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

export const sendMessage = async (req, res) => {
    try{
        const receiverId = req.params.id;
        const {text, image} = req.body;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage =  new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    }
    catch(err){
        console.log('Error in sendMessage controller', e);
        res.status(500).json({message: "Internal Server Error"});
    }
}