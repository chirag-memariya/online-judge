const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // Import your User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    console.log(req);
    try {
        //get all data from req body
        const { firstname, lastname, email, password, date_of_birth } = req.body;

        //check all data should exists
        if (!(firstname && lastname && email && password)) {
            return res.status(400).send("All fields are required.");
        }
        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists! Try with a different email.");
        }

        //encrypt password
        const hashPassword = bcrypt.hashSync(password, 8);
        console.log("hashPassword: " + hashPassword);

        //save to the database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
            date_of_birth,
            registration_date: new Date()
        });

        //generate token for the user and send it
        const token = jwt.sign(
            { id: user._id, email },
            process.env.SECRET_KEY,
            { expiresIn: "10h" }
        );
        user.token = token;
        user.password = undefined;
        res.status(201).json({
            message: "You have successfully register!",
            user,
            token
        });
    } catch (error) {
        console.error("Error: registration failed! Please try again." + error);
        res.status(500).send("Registration failed. Please try again.");
    }
});

router.post("/login", async (req, res) => {
    try {
        //get the use details from req body
        const { email, password } = req.body;

        //check all data should exist
        if (!(email && password)) {
            return res.status(400).send("All fields are required.");
        }

        //find user in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User does not exist with this email!");
        }

        //match password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid password!");
        }

        //create token
        const token = jwt.sign(
            { id: user._id, email },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        //store cookies
        res.cookie('token', token, {
            httpOnly: true, // Cookie is only accessible by the web server
            secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS only in production
            maxAge: 3600000 // Cookie expiry: 1 hour
        });

        //send the token
        user.token = token;
        user.password = undefined;
        res.status(201).json({
            message: "You have successfully logged in!",
            user,
            token
        });
    } catch (error) {
        console.error("Error during login: " + error);
        res.status(500).send("Login failed. Please try again.");
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ score: -1 }); // Sort by score in descending order
        res.status(200).json(users);
    } catch (error) {
        console.error("Error: fetching users failed! " + error);
        res.status(500).send("Fetching users failed. Please try again.");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).send("User not found.");
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error: fetching user failed! " + error);
        res.status(500).send("Fetching user failed. Please try again.");
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { firstname, lastname, email, date_of_birth } = req.body;

        // Find user by ID and update fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstname, lastname, email, date_of_birth },
            { new: true, runValidators: true, select: '-password' } // Exclude password from result
        );

        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        res.status(200).json({
            message: "User updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error: updating user failed! " + error);
        res.status(500).send("Updating user failed. Please try again.");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send("User not found.");
        }

        res.status(200).json({
            message: "User deleted successfully.",
            user,
        });
    } catch (error) {
        console.error("Error: deleting user failed! " + error);
        res.status(500).send("Deleting user failed. Please try again.");
    }
});

module.exports = router;
