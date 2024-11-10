import  Student  from '../models/StudentExamModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function studentRegister(req, res) {
    const { name, email, password, phone } = req.body;
    try {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student already exists' });
      }
  
      const newPassword = await bcrypt.hash(password, 10);
      const student = new Student({
        name,
        email,
        phone,
        password: newPassword,
        // Don't initialize exams_given here
      });
  
      await student.save();
  
      const token = jwt.sign(
        { id: student._id, name: student.name },
        process.env.JWT_SECRET
      );
  
      res.status(201).json({ message: 'Registered successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
export async function studentLogin(req,res){

    const { email, password } = req.body;

    try {
        const student = await Student.findOne ({ email });   
        if (!student) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, student.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log(isPasswordCorrect)
        const token = jwt.sign(
            { id: student._id, name: student.name },
            process.env.JWT_SECRET,
        );

        res.cookie('token', token, {
            httpOnly: true, 
            secure:false,
            sameSite:"None",
            maxAge: 3600000*6 
        });
        res.status(200).json({ message:'login successfully',token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function updatePassword(req,res)
{
    const { email, password } = req.body;
    try {
        const student = await Student.findOneAndUpdate(
          {email},
          {password:await bcrypt.hash(password, 10)},
          {new:true}
        )
        if (!student) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
  
} 

