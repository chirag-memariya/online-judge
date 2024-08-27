const express = require('express');
const cors = require('cors');
const { generateFile } = require('./generateFile.js');
const { generateInputFile } = require('./generateInputFile.js');
const { executeCpp } = require('./executeCpp.js');
const { executeJava } = require('./executeJava.js');
const { executeGo } = require('./executeGo.js');
const { executePython } = require('./executePython.js');
const { executeJs } = require('./executeJavaScript.js');

const app = express();
 
//middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.send("Home");
});


//mapping of language to their respective execute functions 
const executeFunctions = {
    'cpp': executeCpp,
    'java': executeJava,
    'py': executePython,
    'go': executeGo,
    'js':  executeJs
};  

app.post("/run",async (req,res)=>{
    const {language='cpp',code,input} = req.body;
    if(code==undefined){
        return res.status(400).json({ error: "code is required."});
    }

    if(input==undefined)
        return res.status(400).json({error: "please enter input for code."});

    try {
        const filePath = generateFile(language,code);
        // console.log("filepath : "+filePath);
        const inputFilePath = generateInputFile(input);
        // console.log("inputifile: "+inputFilePath);
        const executeFunction = executeFunctions[language];
        if(!executeFunction){
            return res.status(400).json({error: "Unsupported language selected."});
        }

        const output = await executeFunction(filePath,inputFilePath);
        res.json({output});
    } catch (error) {
        return res.status(500).json({ error: error.message});
    }
});

app.listen(5000,()=>{
    console.log("server is listening on post 5000");
});