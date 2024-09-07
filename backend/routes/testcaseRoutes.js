const express = require('express');
const router = express();
const TestCase = require('../models/Test_Cases.js');
const mongoose = require('mongoose'); 

router.post('/create', async (req, res) => {
    try {
        const { cases, problem } = req.body;

        // Check if both cases and problem are provided
        if (!cases || !problem) {
            return res.status(400).send("Fields 'cases' and 'problem' are required.");
        }

        // Validate that 'cases' is an array with at least one element
        if (!Array.isArray(cases) || cases.length === 0) {
            return res.status(400).send("'cases' must be a non-empty array of input-output objects.");
        }

        // Validate the 'problem' ID
        if (!mongoose.Types.ObjectId.isValid(problem)) {
            return res.status(400).send("Invalid problem ID.");
        }

        // Create the new test case
        const testCase = await TestCase.create({
            cases,
            problem,
        });

        res.status(201).json({
            message: "Test case created successfully!",
            testCase,
        });
    } catch (error) {
        console.error("Error: creating test case failed! " + error.message);
        res.status(500).send("Test case creation failed. Please try again. Error: " + error.message);
    }
});


router.get('/', async (req, res) => {
    try {
        const testCases = await TestCase.find()
            .populate('problem', 'title');  // Populates the problem's title

        res.status(200).json(testCases);
    } catch (error) {
        console.error("Error: fetching test cases failed! " + error.message);
        res.status(500).send("Fetching test cases failed. Please try again.");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const testCase = await TestCase.findById(req.params.id)
            .populate('problem', 'title statement');

        if (!testCase) {
            return res.status(404).send("Test case not found.");
        }

        res.status(200).json(testCase);
    } catch (error) {
        console.error("Error: fetching test case failed! " + error.message);
        res.status(500).send("Fetching test case failed. Please try again.");
    }
});

// Update a specific test case by ID
router.put('/edit/:id', async (req, res) => {
    try {
        const { cases, problem } = req.body;

        // Ensure the problem is a valid ObjectId reference if provided
        if (problem && !mongoose.Types.ObjectId.isValid(problem)) {
            return res.status(400).send("Invalid problem ID.");
        }

        // Find test case by ID and update fields
        const updatedTestCase = await TestCase.findByIdAndUpdate(
            req.params.id,
            { cases, problem },
            { new: true, runValidators: true }
        );

        if (!updatedTestCase) {
            return res.status(404).send("Test case not found.");
        }

        res.status(200).json({
            message: "Test case updated successfully.",
            testCase: updatedTestCase,
        });
    } catch (error) {
        console.error("Error: updating test case failed! " + error.message);
        res.status(500).send("Updating test case failed. Please try again.");
    }
});

// Delete a specific test case by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const testCase = await TestCase.findByIdAndDelete(req.params.id);

        if (!testCase) {
            return res.status(404).send("Test case not found.");
        }

        res.status(200).json({
            message: "Test case deleted successfully.",
            testCase,
        });
    } catch (error) {
        console.error("Error: deleting test case failed! " + error.message);
        res.status(500).send("Deleting test case failed. Please try again.");
    }
});

// Get test cases for a specific problem ID
router.get('/problem/:problemId', async (req, res) => {
    try {
        const testCases = await TestCase.find({ problem: req.params.problemId });
        if (!testCases.length) {
            return res.status(404).send("No test cases found for this problem.");
        }
        res.status(200).json(testCases);
    } catch (error) {
        console.error("Error: fetching test cases for problem failed! " + error.message);
        res.status(500).send("Fetching test cases failed. Please try again.");
    }
});

module.exports = router;
