import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

var user;
try{
 user = mongoose.model('user');
}
catch(e){
    user = mongoose.model('user',userSchema);
}
export default user
