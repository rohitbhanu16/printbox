const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

//signup logic
exports.signup = async (req, res) => {
  try {
    const {name, username, email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({message: 'User already exists'})
    }

    //create new user
    const user = new User({name, username, email, password});
    await user.save();

    //Return token
    const token = generateToken(user._id);
    res.status(201).json({token, user })
  } 
  
  catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.login = async (req, res) => {
  try{
    const {email, password } = req.body

    //Find user by email
    const user = await User.findOne({ email })
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }

    //check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //Return token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '15d'})
    res.status(200).json({ id: user._id, email: user.email, name: user.name, token });
  }
  
  catch (error){
    res.status(500).json({ error: error.message });
  }
}