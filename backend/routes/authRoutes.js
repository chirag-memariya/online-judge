const express = require('express');
const router = express.Router();
const User = require('../models/Users'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Route
router.post("/register", async (req, res) => {
    console.log(req);
    try {
        // Get all data from req body
        const { firstname, lastname, email, password, date_of_birth, role } = req.body;

        // Check all data should exist
        if (!(firstname && lastname && email && password)) {
            return res.status(400).send("All fields are required.");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists! Try with a different email.");
        }

        // Encrypt password
        const hashPassword = bcrypt.hashSync(password, 8);
        console.log("hashPassword: " + hashPassword);

        // Save to the database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
            date_of_birth,
            registration_date: new Date(),
            role,
        });

        // Generate token for the user and send it
        const token = jwt.sign(
            { id: user._id, email },
            process.env.SECRET_KEY,
            { expiresIn: "10h" }
        );
        user.token = token;
        user.password = undefined;
        
        // Send user details with id explicitly
        res.status(201).json({
            message: "You have successfully registered!",
            user: { ...user._doc, id: user._id }, // Ensure the id is included
            token
        });
    } catch (error) {
        console.error("Error: registration failed! Please try again." + error);
        res.status(500).send("Registration failed. Please try again.");
    }
});

// Edit User Route
router.put("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, password, date_of_birth } = req.body;

        // Check if the user ID is provided
        if (!id) {
            return res.status(400).send("User ID is required.");
        }

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Update the user fields
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (email) user.email = email;
        if (password) user.password = bcrypt.hashSync(password, 8); // Encrypt new password if provided
        if (date_of_birth) user.date_of_birth = date_of_birth;

        // Save the updated user to the database
        const updatedUser = await user.save();

        // Generate a new token if needed
        const token = jwt.sign(
            { id: updatedUser._id, email: updatedUser.email },
            process.env.SECRET_KEY,
            { expiresIn: "10h" }
        );

        // Respond with the updated user data and new token, including the id
        res.status(200).json({
            message: "User details updated successfully!",
            user: { ...updatedUser._doc, id: updatedUser._id }, // Ensure the id is included
            token
        });
    } catch (error) {
        console.error("Error: updating user failed! " + error);
        res.status(500).send("Update failed. Please try again.");
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        // Get the user details from req body
        const { email, password } = req.body;

        // Check all data should exist
        if (!(email && password)) {
            return res.status(400).send("All fields are required.");
        }

        // Find user in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User does not exist with this email!");
        }

        // Match password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid password!");
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, email },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Store cookies
        res.cookie('token', token, {
            httpOnly: true, // Cookie is only accessible by the web server
            secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS only in production
            maxAge: 3600000 // Cookie expiry: 1 hour
        });

        // Send the token and user details with id explicitly
        user.token = token;
        user.password = undefined;
        res.status(200).json({
            message: "You have successfully logged in!",
            user: { ...user._doc, id: user._id }, // Ensure the id is included
            token
        });
    } catch (error) {
        console.error("Error during login: " + error);
        res.status(500).send("Login failed. Please try again.");
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
        });

        res.status(200).json({
            message: "You have successfully logged out!",
        });
    } catch (error) {
        console.error("Error during logout: " + error);
        res.status(500).send("Logout failed. Please try again.");
    }
});

module.exports = router;
