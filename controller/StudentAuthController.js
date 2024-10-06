import  Student  from '../models/StudentExamModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function studentRegister(req,res)
{
    const { name, email, password, phone } = req.body;
    try {

        const existingCompany = await Student.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        const newPassword = await bcrypt.hash(password, 10);
        const student = new Student({
            name,
            email,
            phone,
            password: newPassword
        });

        await student.save();

        const token = jwt.sign(
            { id: student._id, name: name },
            process.env.JWT_SECRET || 'procexam_backend',
            { expiresIn: '6h' }
        );
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000*6 
        });


        res.status(201).json({ message:'registerd successfully',token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

}

