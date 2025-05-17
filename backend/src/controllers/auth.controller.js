import { generateToken } from "../lib/utils.js";
import User from "../models/auth.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";

export const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({'email': email});
        if(!user) return res.status(404).json({message: "User not found"});

        const match = await bcrypt.compare(password, user.password);

        if(!match) return res.status(401).json({message: "Invalid credentials"});

        generateToken(user._id, res);

        return res.status(200).json({
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        })
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        }); 

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
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

        return res.status(200).json({
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
        });
    }
    catch(err){
        console.log('Error in profile update controller', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}