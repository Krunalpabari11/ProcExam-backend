import user from "../models/login.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'




export async function login(req,res)
{
    const {username,email,password}=req.body;
    try{
        const newPassword=await bcrypt.hash(password,10)
        const newUser=new user({
            username,
            password:newPassword
        })
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, username: username }, 
            'playpowerlabs_backend', 
            { expiresIn: '6h' } 
        );

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000*6 
        });
        res.status(200).json({message:"user created successfully",token})
    }
    catch(e){
        res.status(500).json({error:"problem in siginup",e})
    }

}

