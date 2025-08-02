const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const SECRET = 'your_jwt_secret';

// User schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    }
});
const User = mongoose.model('User', userSchema);

const router = express.Router();

// Middleware to check JWT
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) 
        return res.status(400).json({ error: 'Username, email, and password required' });

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) 
        return res.status(400).json({ error: 'Username or email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ username, email, password: hashedPassword }).save();
    res.json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) 
        return res.status(400).json({ error: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = { authenticateToken, authRouter: router };
