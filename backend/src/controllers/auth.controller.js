import { generateToken } from "../utils/generateToken.js";
import User from "../models/auth.model.js";

import cloudinary from "../lib/cloudinary.js";
import { hashedPasswordUtil, passwordMatchUtil } from "../utils/hashedPasswordUtils.js";
import { formatUserResponse } from "../utils/utils.js";

export const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({'email': email});
        if(!user) return res.status(404).json({message: "User not found"});

        const match = await passwordMatchUtil(password, user.password);

        if(!match) return res.status(401).json({message: "Invalid credentials"});

        generateToken(user._id, res);

        return res.status(200).json(formatUserResponse(user));
    }
    catch(err){
        console.log('Error in login controller', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const signup = async (req, res) => {
    // res.send('Login Route');
    const {fullName, email, password} = req.body;
    
    try{
        const user = await User.findOne({email});
        if (user) return res.status(409).json({message: 'User already exists'});

        const hashedPassword = await hashedPasswordUtil(password);

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        }); 

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json(formatUserResponse(newUser));
        } else {
            return res.status(400).json({
                message: 'User not created'
            });
        }
    }
    catch(err){
        console.log('Error in signup controller', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const logout = (req, res) => {
    try{
        res.clearCookie('token');
        return res.status(200).json({
            message: "Logged out successfully"
        });
    }
    catch(error){
        console.log('Error in logout controller', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const profileUpdate = async(req, res) => {
    try{
        const {profilePic, fullName} = req.body;
        const userId  = req.user._id;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        user.profilePic = profilePic || user.profilePic;
        user.fullName = fullName || user.fullName;

        const uploadResponse = await cloudinary.uploader.upload(user.profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            req.user_id,
            {
                profilePic: uploadResponse.secure_url, 
                fullName: user.fullName
            }, 
            {
                new: true
            }
        );
        
        if(!updatedUser) return res.status(404).json(
            {
                message: "User not found"
            });

        return res.status(200).json(formatUserResponse(updatedUser));
    }
    catch(err){
        console.log('Error in profile update controller', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const checkAuth = async (req, res) => {
    try{
        res.status(200).json(formatUserResponse(req.user));
    }
    catch(err) {
        console.log('Error in checkAuth controller', err);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const updatePassword = async (req, res) => {
    const {password, oldPassword} = req.body;
    try {
        const userId = req.user._id;

        const currentUser = await User.findOne({_id: userId});
        if(!currentUser) return res.status(404).json({message: "User not found"}); 

        const match = await passwordMatchUtil(oldPassword, currentUser.password);

        if(!match) {
            res.status(401).json({message: 'Invalid Password'})
        }

        const hashedPassword = await hashedPasswordUtil(password);
        updatedUser = await User.findByIdAndUpdate(userId,{password: hashedPassword}, {new:true});

        if(!updatedUser) return res.status(404).json(
        {
            message: "User not found"
        });

        return res.status(200).json(formatUserResponse(updatedUser));
    }
    catch(err){
        console.log('Error in updatePassword controller:', err)
        return res.status(500).json({message: "Internal Server Error"});
    }
}