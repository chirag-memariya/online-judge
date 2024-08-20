const express = require('express');
const cors = require('cors');
const app = express();  
const {DBConnection} = require('./database/db.js');
const User = require('./models/Users.js');
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

app.listen(8000,()=>{
    console.log("server is listening on port 8000");
});