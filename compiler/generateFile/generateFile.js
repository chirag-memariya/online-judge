const fs = require('fs');
const path = require('path');
const {v4: uuid}= require('uuid'); 


const dirCodes = path.join(__dirname,'codes');

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes);
}

const generateFile = (language,code)=>{
    const jobId = uuid();
    const filename = `${jobId}.${language}`;
    const filePath = path.join(dirCodes,filename);
    fs.writeFileSync(filePath,code);   
    return filePath;
};

module.exports = {generateFile};