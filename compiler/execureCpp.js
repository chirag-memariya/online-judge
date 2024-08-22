const fs = require('fs');
const path = require('path'); 
const { exec } = require('child_process');

const outputPath = path.join(__dirname,'outputs');

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
}

const executeCpp = async (filePath)=>{
    const jobId = path.basename(filePath).split('.')[0];
    const outputFileName = `${jobId}.out`;
    const outPath = path.join(outputPath,outputFileName);

    return new Promise((resolve,reject)=>{
        exec(
            `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${outputFileName}`,
            (error,stdout,stderr)=>{
                if(error){
                    reject(error);
                }
                if(stderr){
                    reject(error);
                }
                resolve(stdout);
            }
        )
    });
};

module.exports = {executeCpp};