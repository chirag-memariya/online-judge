const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputPath = path.join(__dirname, 'outputs/Go');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeGo = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split('.')[0];
    const outputFileName = `${jobId}`;
    const outPath = path.join(outputPath,outputFileName);

    return new Promise((resolve, reject) => {
        exec(
            `go build -o ${outPath} ${filePath} && cd ${outputPath} && ./${outputFileName} < ${inputFilePath}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing Go code: ${error.message}`);
                    reject(error);
                }
                if (stderr) {
                    console.error(`Go Runtime Stderr: ${stderr}`);
                    reject(stderr);
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = { executeGo };
