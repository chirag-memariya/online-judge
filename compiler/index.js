const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { generateFile } = require('./generateFile/generateFile.js');
const { generateInputFile } = require('./generateFile/generateInputFile.js');
const { executeCpp } = require('./execute/executeCpp.js');
const { executeJava } = require('./execute/executeJava.js');
const { executeGo } = require('./execute/executeGo.js');
const { executePython } = require('./execute/executePython.js');
const { executeJs } = require('./execute/executeJavaScript.js');

const app = express();
 
app.use(express.json())
app.use(cookieParser());
app.use(
    cors({
        
        origin: CLIENT_URL, // 'https://www.chigs.site'
        credentials: true,
    })
);

app.use(express.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.send("Online Compiler");
});

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