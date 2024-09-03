const fs = require('fs');
const path = require('path');
const {v4: uuid}= require('uuid'); 


const dirInputs = path.join(__dirname,'inputs');

if(!fs.existsSync(dirInputs)){
    fs.mkdirSync(dirInputs);
}

const generateInputFile = (input)=>{
    const jobId = uuid();
    const input_filename = `${jobId}.txt`;
    const input_filePath = path.join(dirInputs,input_filename);
    // Add a newline character to the end of the input
    fs.writeFileSync(input_filePath, input + '\n', { encoding: 'utf8' });
    return input_filePath;
};

module.exports = {generateInputFile};