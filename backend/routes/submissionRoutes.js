const express = require('express');
const router = express();
const User = require('../models/Users.js');
const Problem = require('../models/Problems.js');
const Submission = require('../models/Submissions.js');
const mongoose = require('mongoose');

router.post('/create', async (req, res) => {
    let session;
    try {
        const { problem, user, verdict, solution, execution_time } = req.body;

        // Log to check the received values
        console.log("Received submission data:", { problem, user, verdict, solution, execution_time });

        // Check if all required fields are provided
        if (!(problem && user && verdict && solution)) {
            return res.status(400).send("All fields (problem, user, verdict, solution) are required.");
        }

        // Ensure problem and user are valid ObjectId references
        if (!mongoose.Types.ObjectId.isValid(problem) || !mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).send("Invalid problem or user ID.");
        }

        // Ensure execution_time is a number
        if (typeof execution_time !== 'number') {
            return res.status(400).json({ error: "Execution time must be a number." });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        // Create a new submission
        const submission = await Submission.create(
            [{
                problem,
                user,
                verdict,
                solution,
                execution_time,
            }],
            { session }
        );

        const difficultyPoints = {
            easy: 1,
            medium: 2,
            hard: 3
        };

        if (verdict === 'Accepted') {

            // const problemData = await Problem.findById(problem).session(session);
            // if (!problemData) {
            //     throw new Error('Problem not found.');
            // }
            // // const pointValue = 5;
            // const pointValue = difficultyPoints[problemData.difficulty] || 0;

            // // Log the problem data and point value for debugging
            // console.log("Problem Data:", problemData);
            // console.log("Points to Add:", pointValue)

            // try {
            //     console.log("Checking for previous submission with params:", { problem, user, verdict: 'Accepted' });
            //     const previousSubmission = await Submission.findOne({
            //         problem,
            //         user,
            //         verdict: 'Accepted'
            //     }).session(session);

            //     console.log("Previous submission found:", previousSubmission);

            //     if (!previousSubmission) {
            //         console.log(`Updating user ${user} score by ${pointValue} points.`);
            //         const updatedUser = await User.findByIdAndUpdate(
            //             user,
            //             { $inc: { score: pointValue } },
            //             { session, new: true }
            //         );
            //         console.log("Updated User:", updatedUser);
            //         if (!updatedUser) {
            //             throw new Error("Failed to update the user score.");
            //         }
            //     } else {
            //         console.log("User already has an accepted submission for this problem. Score not updated.");
            //         console.log("Previous submission details:", {
            //             id: previousSubmission._id,
            //             problem: previousSubmission.problem,
            //             user: previousSubmission.user,
            //             verdict: previousSubmission.verdict,
            //             createdAt: previousSubmission.createdAt
            //         });
            //     }
            // } catch (error) {
            //     console.error("Error during score update:", error);
            //     throw error;  // Re-throw to trigger transaction abort
            // }

            console.log("Verdict is Accepted, proceeding with score update");
            
            const problemData = await Problem.findById(problem).session(session);
            console.log("Problem Data:", problemData);
            
            if (!problemData) {
                throw new Error('Problem not found.');
            }
            
            const pointValue = difficultyPoints[problemData.difficulty] || 0;
            console.log("Points to Add:", pointValue);

            try {
                console.log(`Updating user ${user} score by ${pointValue} points.`);
                const updatedUser = await User.findByIdAndUpdate(
                    user,
                    { $inc: { score: pointValue } },
                    { session, new: true }
                );
                console.log("Updated User:", updatedUser);
                if (!updatedUser) {
                    throw new Error("Failed to update the user score.");
                }
            } catch (error) {
                console.error("Error during score update:", error);
                throw error;  // Re-throw to trigger transaction abort
            }
        } else {
            console.log("Verdict is not Accepted. No score update needed.");
        }

        console.log("Committing transaction");
        await session.commitTransaction();

        res.status(201).json({
            message: "Submission created successfully!",
            submission: submission[0],
        });
    } catch (error) {
        console.error("Error creating submission:", error);
        if (session) {
            console.log("Aborting transaction");
            await session.abortTransaction();
        }
        res.status(500).json({ error: "Submission creation failed. Please try again.", details: error.message });
    } finally {
        if (session) {
            console.log("Ending session");
            session.endSession();
        }
    }
});

router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('problem', 'title')  // Populates the problem's title
            .populate('user', 'firstname lastname');  // Populates user's name
        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error: fetching submissions failed! " + error);
        res.status(500).send("Fetching submissions failed. Please try again.");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('problem', 'title statement')
            .populate('user', 'firstname lastname');

        if (!submission) {
            return res.status(404).send("Submission not found.");
        }

        res.status(200).json(submission);
    } catch (error) {
        console.error("Error: fetching submission failed! " + error);
        res.status(500).send("Fetching submission failed. Please try again.");
    }
});

router.put('/edit/:id', async (req, res) => {
    try {
        const { verdict, solution, execution_time } = req.body;

        // Find submission by ID and update fields
        const updatedSubmission = await Submission.findByIdAndUpdate(
            req.params.id,
            { verdict, solution, execution_time },
            { new: true, runValidators: true }
        );

        if (!updatedSubmission) {
            return res.status(404).send("Submission not found.");
        }

        res.status(200).json({
            message: "Submission updated successfully.",
            submission: updatedSubmission,
        });
    } catch (error) {
        console.error("Error: updating submission failed! " + error);
        res.status(500).send("Updating submission failed. Please try again.");
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const submission = await Submission.findByIdAndDelete(req.params.id);

        if (!submission) {
            return res.status(404).send("Submission not found.");
        }

        res.status(200).json({
            message: "Submission deleted successfully.",
            submission,
        });
    } catch (error) {
        console.error("Error: deleting submission failed! " + error);
        res.status(500).send("Deleting submission failed. Please try again.");
    }
});

module.exports = router;
