const express = require('express');
const cors = require('cors');
const { generateFile } = require('./generateFile.js');
const { executeCpp } = require('./execureCpp.js');

const app = express();
 
//middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.send("Home");
});

app.post("/run",async (req,res)=>{
    const {language='cpp',code} = req.body;
    
    if(code==undefined){
        return res.status(400).json({ error: "code is required."});
    }

    try {
        const filePath = generateFile(language,code);
        const output = await executeCpp(filePath);
        res.json({output});
    } catch (error) {
        return res.status(500).json({ error: error.message});
    }
});

app.listen(8080,()=>{
    console.log("server is listening on post 8080");
});