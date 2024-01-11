const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const User = require('./models/user');

const FormDataModel = require ('./FormData');
const secretKey = 'Thisissecretkey'; // Replace with a secure secret key


const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/mern');

app.post('/register', async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      type,
      phone,
      password,
      confirmPassword,
    } = req.body;
  
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
  
    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
  
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      const newUser = new User({
        firstName,
        lastName,
        email,
        type,
        phone,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post('/login', async (req, res) => {
    const { email, password, type } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ email, type }, secretKey, { expiresIn: '5h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Middleware to verify token
  const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
  
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  
    // Check if the header starts with 'Bearer '
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
  
  // Route to get user data
  app.get('/users', verifyToken, async (req, res) => {
    try {
      if (req.user.type === 'Admin') {
        const users = await User.find({type: 'User'}, '-password');
        res.status(200).json(users);
      } else {
        const user = await User.findOne({ email: req.user.email }, '-password');
        res.status(200).json(user);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.delete('/users/:id', verifyToken, async (req, res) => {
    try {
      if (req.user.type !== 'Admin') {
        return res.status(403).json({ error: 'Permission denied. Only Admin can delete users.' });
      }
  
      const deletedUser = await User.findByIdAndDelete(req.params.id);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(3001, () => {
    console.log("Server listining on http://127.0.0.1:3001");

});