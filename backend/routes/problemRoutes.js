const express = require('express');
const router = express.Router();
const Problem = require('../models/Problems'); // Import your Problem model

router.post('/', async (req, res) => {
    try {
        const { title, statement, input_output_sample, difficulty } = req.body;

        // Check if all required fields are provided
        if (!(title && statement && input_output_sample)) {
            return res.status(400).send("All fields are required.");
        }

        // Create a new problem
        const problem = await Problem.create({
            title,
            statement,
            input_output_sample,
            difficulty,
        });

        res.status(201).json({
            message: "Problem created successfully!",
            problem,
        });
    } catch (error) {
        console.error("Error: creating problem failed! " + error);
        res.status(500).send("Problem creation failed. Please try again.");
    }
});

router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json(problems);
    } catch (error) {
        console.error("Error: fetching problems failed! " + error);
        res.status(500).send("Fetching problems failed. Please try again.");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).send("Problem not found.");
        }

        res.status(200).json(problem);
    } catch (error) {
        console.error("Error: fetching problem failed! " + error);
        res.status(500).send("Fetching problem failed. Please try again.");
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, statement, input_output_sample, difficulty } = req.body;

        // Find problem by ID and update fields
        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.id,
            { title, statement, input_output_sample, difficulty },
            { new: true, runValidators: true }
        );

        if (!updatedProblem) {
            return res.status(404).send("Problem not found.");
        }

        res.status(200).json({
            message: "Problem updated successfully.",
            problem: updatedProblem,
        });
    } catch (error) {
        console.error("Error: updating problem failed! " + error);
        res.status(500).send("Updating problem failed. Please try again.");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const problem = await Problem.findByIdAndDelete(req.params.id);

        if (!problem) {
            return res.status(404).send("Problem not found.");
        }

        res.status(200).json({
            message: "Problem deleted successfully.",
            problem,
        });
    } catch (error) {
        console.error("Error: deleting problem failed! " + error);
        res.status(500).send("Deleting problem failed. Please try again.");
    }
});

module.exports = router;
