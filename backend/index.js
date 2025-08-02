const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/url');
const { authenticateToken, authRouter } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/auth', authRouter);


app.use('/', authenticateToken, urlRoutes);

// Starting the server
app.listen(3000, () => {
    console.log('The server is running on port 3000');
});

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/url')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
