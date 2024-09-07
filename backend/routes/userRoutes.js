const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // Import your User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

router.put('/edit/:id', async (req, res) => {
    try {
        const { firstname, lastname, email, password, date_of_birth } = req.body;

        let formattedDob = date_of_birth;
        if (date_of_birth) {
            formattedDob = new Date(date_of_birth);
            if (isNaN(formattedDob)) {
                return res.status(400).send("Invalid date of birth format.");
            }
        }

        // Find user by ID and update fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { firstname, lastname, email, password, date_of_birth: formattedDob },
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

router.delete('/delete/:id', async (req, res) => {
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

router.delete('/delete/all-non-admin-users', async (req, res) => {
    try {
      const result = await User.deleteMany({ role: { $ne: 'admin' } }); // Delete all users except those with role 'admin'
  
      if (result.deletedCount === 0) {
        return res.status(404).send("No users found to delete.");
      }
  
      res.status(200).json({
        message: "All non-admin users deleted successfully.",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.error("Error: deleting non-admin users failed! " + error);
      res.status(500).send("Deleting non-admin users failed. Please try again.");
    }
  });
  

module.exports = router;
