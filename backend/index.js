const express = require('express');
const app = express();  
const {DBConnection} = require('./database/db.js');

DBConnection();

//middelewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("Welcome to Online Judge!");
});

app.listen(8000,()=>{
    console.log("server is listening on port 8000");
});