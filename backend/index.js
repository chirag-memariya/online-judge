const express = require('express');
const cors = require('cors');
const app = express();  
const {DBConnection} = require('./database/db.js');
const User = require('./models/Users.js');
const Problem = require('./models/Problems.js');
const Submission = require('./models/Submissions.js');
const TestCase = require('./models/Test_Cases.js');
const mongoose = require('mongoose');  // Import mongoose
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

DBConnection();

//cors
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true // To allow cookies to be sent and received
  }));

//middelewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("Welcome to Online Judge!");
});

app.post("/register",async (req,res)=>{  
    console.log(req);
    try {
        //get all data from req body
        const {firstname, lastname, email, password,date_of_birth}=req.body;
        
        //check all data should exists
        if(!(firstname && lastname && email && password)){
            return res.status(400).send("All fields are required.");
        }
        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).send("Email already exists! Try with a different email.");
        }

        //encrypt password
        const hashPassword = bcrypt.hashSync(password,8);
        console.log("hashPassword: "+hashPassword);

        //save to the database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password:hashPassword,
            date_of_birth,
            registration_date:new Date()
        });

        //generate token for the user and send it
        const token = jwt.sign(
            {id:user._id,email}, 
            process.env.SECRET_KEY,
            {expiresIn: "10h"}
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

app.post("/login",async (req,res)=>{
    try {
        //get the use details from req body
        const {email,password} = req.body;
    
        //check all data should exist
        if(!(email && password)){
            return res.status(400).send("All fields are required.");
        }

        //find user in database
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send("User does not exist with this email!");
        }

        //match password
        const isMatch = bcrypt.compareSync(password,user.password);
        if(!isMatch){
            return res.status(401).send("Invalid password!");
        }

        //create token
        const token = jwt.sign(
            {id:user._id,email}, 
            process.env.SECRET_KEY,
            {expiresIn: "1h"}
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

app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the result
        res.status(200).json(users);
    } catch (error) {
        console.error("Error: fetching users failed! " + error);
        res.status(500).send("Fetching users failed. Please try again.");
    }
});

app.get('/users/:id', async (req, res) => {
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

app.put('/users/:id', async (req, res) => {
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

app.delete('/users/:id', async (req, res) => {
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

app.post('/problems', async (req, res) => {
    try {
        const { title, statement, input_output_sample, difficult } = req.body;

        // Check if all required fields are provided
        if (!(title && statement && input_output_sample)) {
            return res.status(400).send("All fields are required.");
        }

        // Create a new problem
        const problem = await Problem.create({
            title,
            statement,
            input_output_sample,
            difficult,
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

app.get('/problems', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json(problems);
    } catch (error) {
        console.error("Error: fetching problems failed! " + error);
        res.status(500).send("Fetching problems failed. Please try again.");
    }
});

app.get('/problems/:id', async (req, res) => {
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

app.put('/problems/:id', async (req, res) => {
    try {
        const { title, statement, input_output_sample, difficult } = req.body;

        // Find problem by ID and update fields
        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.id,
            { title, statement, input_output_sample, difficult },
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

app.delete('/problems/:id', async (req, res) => {
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

app.post('/submissions', async (req, res) => {
    try {
        const { problem, user, verdict, solution, execution_time } = req.body;

        // Check if all required fields are provided
        if (!(problem && user && verdict && solution)) {
            return res.status(400).send("All fields (problem, user, verdict, solution) are required.");
        }

        // Ensure problem and user are valid ObjectId references
        if (!mongoose.Types.ObjectId.isValid(problem) || !mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).send("Invalid problem or user ID.");
        }

        // Create a new submission
        const submission = await Submission.create({
            problem,
            user,
            verdict,
            solution,
            execution_time,
        });

        res.status(201).json({
            message: "Submission created successfully!",
            submission,
        });
    } catch (error) {
        console.error("Error: creating submission failed! " + error.message);
        res.status(500).send("Submission creation failed. Please try again. Error: " + error.message);
    }
});

app.get('/submissions', async (req, res) => {
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

app.get('/submissions/:id', async (req, res) => {
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

app.put('/submissions/:id', async (req, res) => {
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

app.delete('/submissions/:id', async (req, res) => {
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

app.post('/testcases', async (req, res) => {
    try {
        const { input, output, problem } = req.body;

        if (!(input && output && problem)) {
            return res.status(400).send("All fields (input, output, problem) are required.");
        }

        if (!mongoose.Types.ObjectId.isValid(problem)) {
            return res.status(400).send("Invalid problem ID.");
        }

        const testCase = await TestCase.create({
            input,
            output,
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

app.get('/testcases', async (req, res) => {
    try {
        const testCases = await TestCase.find()
            .populate('problem', 'title');  // Populates the problem's title

        res.status(200).json(testCases);
    } catch (error) {
        console.error("Error: fetching test cases failed! " + error.message);
        res.status(500).send("Fetching test cases failed. Please try again.");
    }
});

app.get('/testcases/:id', async (req, res) => {
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

app.put('/testcases/:id', async (req, res) => {
    try {
        const { input, output, problem } = req.body;

        // Ensure the problem is a valid ObjectId reference if provided
        if (problem && !mongoose.Types.ObjectId.isValid(problem)) {
            return res.status(400).send("Invalid problem ID.");
        }

        // Find test case by ID and update fields
        const updatedTestCase = await TestCase.findByIdAndUpdate(
            req.params.id,
            { input, output, problem },
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

app.delete('/testcases/:id', async (req, res) => {
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



app.listen(8000,()=>{
    console.log("server is listening on port 8000");
});