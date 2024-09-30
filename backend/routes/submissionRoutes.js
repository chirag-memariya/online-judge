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

        console.log("Received submission data:", { problem, user, verdict, solution, execution_time });
        if (!(problem && user && verdict && solution)) {
            return res.status(400).send("All fields (problem, user, verdict, solution) are required.");
        }

        if (!mongoose.Types.ObjectId.isValid(problem) || !mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).send("Invalid problem or user ID.");
        }

        if (typeof execution_time !== 'number') {
            return res.status(400).json({ error: "Execution time must be a number." });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        // Check for previous accepted submission before creating a new one
        const previousSubmission = await Submission.findOne({
            problem,
            user,
            verdict: 'Accepted'
        }).session(session);

        console.log("Previous submission found:", previousSubmission);

        if (!previousSubmission && verdict === 'Accepted') {
            console.log("No previous accepted submission found. Proceeding with score update.");

            // Fetch problem data to calculate score increment
            const problemData = await Problem.findById(problem).session(session);
            if (!problemData) {
                throw new Error('Problem not found.');
            }

            const difficultyPoints = {
                easy: 2,
                medium: 4,
                hard: 8
            };
            const pointValue = difficultyPoints[problemData.difficulty] || 0;
            console.log("Points to Add:", pointValue);

            const updatedUser = await User.findByIdAndUpdate(
                user,
                { $inc: { score: pointValue } },
                { session, new: true }
            );
            console.log("Updated User:", updatedUser);
            if (!updatedUser) {
                throw new Error("Failed to update the user score.");
            }
        } else {
            console.log("User already has an accepted submission for this problem. Score not updated.");
        }

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

        console.log("New submission created successfully.");

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



//all submission 
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

//submission id
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

//user id
router.get('/user/:id', async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.params.id }) // Find all submissions by user ID
            .populate('problem', 'title statement') // Populate problem details (title, statement)
            .populate('user', 'firstname lastname'); // Populate user's firstname and lastname

        if (!submissions || submissions.length === 0) {
            return res.status(404).send("No submissions found for this user.");
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error: fetching submissions failed! " + error);
        res.status(500).send("Fetching submissions failed. Please try again.");
    }
});

//problem id
router.get('/problem/:id', async (req, res) => {
    try {
        const submissions = await Submission.find({ problem: req.params.id }) // Find all submissions by problem ID
            .populate('problem', 'title statement') // Populate problem details (title, statement)
            .populate('user', 'firstname lastname'); // Populate user's firstname and lastname

        if (!submissions || submissions.length === 0) {
            return res.status(404).send("No submissions found for this problem.");
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error: fetching submissions failed! " + error);
        res.status(500).send("Fetching submissions failed. Please try again.");
    }
});

//get submission base on userId && problemId
router.get('/user/:userId/problem/:problemId', async (req, res) => {
    const { userId, problemId } = req.params;

    try {
        const submissions = await Submission.find({ user: userId, problem: problemId })
            .populate('problem', 'title statement') // Populate problem details
            .populate('user', 'firstname lastname'); // Populate user details

        if (!submissions || submissions.length === 0) {
            return res.status(404).send("No submissions found for this user and problem combination.");
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error: fetching submissions failed! " + error);
        res.status(500).send("Fetching submissions failed. Please try again.");
    }
});

router.get('/solved-count/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Convert userId string to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const solvedProblemsByDifficulty = await Submission.aggregate([
            // Match submissions for the specific user with 'Accepted' verdict
            {
                $match: {
                    user: userObjectId,
                    verdict: 'Accepted'
                }
            },
            // Lookup to join with the Problem collection
            {
                $lookup: {
                    from: 'problems', // The name of your Problem collection in MongoDB
                    localField: 'problem',
                    foreignField: '_id',
                    as: 'problemDetails'
                }
            },
            // Unwind the problemDetails array
            { $unwind: '$problemDetails' },
            // Group by difficulty and count unique problems
            {
                $group: {
                    _id: '$problemDetails.difficulty',
                    count: { $addToSet: '$problem' }
                }
            },
            // Project to get the count of unique problems
            {
                $project: {
                    difficulty: '$_id',
                    count: { $size: '$count' }
                }
            },
            // Sort by difficulty
            { $sort: { difficulty: 1 } }
        ]);

        // Transform the result into a more readable format
        const result = solvedProblemsByDifficulty.reduce((acc, item) => {
            acc[item.difficulty] = item.count;
            return acc;
        }, {});

        // Add missing difficulties with count 0
        ['easy', 'medium', 'hard'].forEach(difficulty => {
            if (!result[difficulty]) {
                result[difficulty] = 0;
            }
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error: fetching solved problems count failed! " + error);
        res.status(500).send("Fetching solved problems count failed. Please try again.");
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

router.delete('/delete-all', async (req, res) => {
    try {
        const result = await Submission.deleteMany({}); // Delete all submissions

        res.status(200).json({
            message: "All submissions deleted successfully.",
            deletedCount: result.deletedCount, // Number of deleted submissions
        });
    } catch (error) {
        console.error("Error: deleting all submissions failed! " + error);
        res.status(500).send("Deleting all submissions failed. Please try again.");
    }
});


module.exports = router;
