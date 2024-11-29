const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.port || 3000;

// MongoDB connection setup
mongoose.connect('mongodb+srv://abdallaatef12:Aatef2000@tazkaracluster.1hsop.mongodb.net/tazkara');

// Define a User schema
const userSchema = new mongoose.Schema({
    "_id": { type: Number },
    "userName": {type: String},
    "available": { type: Boolean }
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Middleware to parse URL parameters
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname+"/public"));


var userName;

// Route to handle incoming requests
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID in the database
        const user = await User.findOne({_id:userId});

        if (!user) {
            // If no user is found, redirect to access denied page
            return res.redirect('/Not-Found');
        }
        userName = user.userName;
        if (user.available) {
            // If available is true, set it to false, then redirect to success page
            user.available = false;
            await user.save();
            return res.redirect('/access-successful');
        } else {
            // If available is false, redirect to access denied page
            return res.redirect('/access-denied');
        }
    } catch (error) {
        console.error(error);
        return res.redirect('/error-occured');
    }
});

// Access successful page
app.get('/access-successful', (req, res) => {
    res.render("access-successful.ejs",{userName});
    // res.send('<h1>Access Successful</h1><p>Your access was granted and the status has been updated.</p>');
});

// Access denied page
app.get('/access-denied', (req, res) => {
    res.render("access-denied.ejs",{userName});
    // res.send('<h1>Access Denied</h1><p>Sorry, you are not allowed to access this page.</p>');
});

// Not Found page
app.get('/Not-Found', (req, res) => {
    res.render("Not-Found.ejs");
    // res.send('<h1>Not Found!</h1><p>Sorry, can not found User</p>');
});

// Error Occured page
app.get('/error-occured', (req, res) => {
    res.send('<h1>Error Occured</h1><p>Sorry,error occured check console to see error </p>');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
