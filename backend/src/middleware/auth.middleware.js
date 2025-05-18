import jwt from 'jsonwebtoken';
import User from '../models/auth.model.js';
export const protectedRoute = async (req,res,next) => {
    
    try{
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized"});
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({message: "Unauthorized"});
        }  
        
        const user = await User.findById(decoded.userId).select('-password');

        if(!user) return res.status(404).json({message: "User not found"});

        req.user = user;
        next();
    }

    catch(err){
        console.log("Error in auth middleware", err);
        return res.status(500).json({message: "Internal server error"});
    }

}