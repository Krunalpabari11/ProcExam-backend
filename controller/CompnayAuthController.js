import Company from '../models/CompanyExamModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function companyRegister(req, res) {
    const { name, email, password, phone } = req.body;
    try {

        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        const newPassword = await bcrypt.hash(password, 10);
        const company = new Company({
            name,
            email,
            phone,
            password: newPassword
        });

        await company.save();

        const token = jwt.sign(
            { id: company._id, name: name },
            process.env.JWT_SECRET ,
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
export async function companyLogin(req,res){

    const { email, password } = req.body;
    try {
        const company = await Company.findOne ({ email });
        if (!company) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, company.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: company._id, name: company.name },
            process.env.JWT_SECRET,
        );
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000*6 
        });
        res.status(200).json({ message: 'Login successful', token }); 
        }
    catch (error) { 
        res.status(500).json({ message: 'Server error', error });
    }
}