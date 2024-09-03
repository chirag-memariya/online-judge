const { exec } = require('child_process');

const executeJs = async (filePath, inputFilePath) => {
    return new Promise((resolve, reject) => {
        console.log(`Executing: node ${filePath} < ${inputFilePath}`);
        exec(
            `node ${filePath} < ${inputFilePath}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Node.js Execution Error: ${error.message}`);
                    reject(error);
                }
                if (stderr) {
                    console.error(`Node.js Runtime Stderr: ${stderr}`);
                    reject(stderr);
                }
                console.log(`Node.js Output: ${stdout}`); // Output log
                resolve(stdout);
            }
        );
    });
};

module.exports = { executeJs };
