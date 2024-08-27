const fs = require('fs');
const path = require('path'); 
const { exec } = require('child_process');

const outputPath = path.join(__dirname,'outputs/Cpp');

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
}

const executeCpp = async (filePath,inputFilePath)=>{
    const jobId = path.basename(filePath).split('.')[0];
    const outputFileName = `${jobId}.out`;
    const outPath = path.join(outputPath,outputFileName);

    return new Promise((resolve,reject)=>{
        exec(
            `g++ -o ${outPath} ${filePath} && cd ${outputPath} && ./${outputFileName} < ${inputFilePath}`,
            (error,stdout,stderr)=>{
                if(error){
                    console.error(`Error executing C++ code: ${error.message}`);
                    reject(error);
                }
                if(stderr){
                    console.error(`C++ Runtime Stderr: ${stderr}`);
                    reject(stderr);
                }
                resolve(stdout);
            }
        )
    });
};

module.exports = {executeCpp};