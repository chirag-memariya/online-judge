const { exec } = require('child_process');

const executeJava = async (filePath, inputFilePath) => {
    return new Promise((resolve, reject) => {
        exec(
            `java ${filePath} < ${inputFilePath}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Java Runtime Error: ${error.message}`);
                    reject(error);
                }
                if (stderr) {
                    console.error(`Java Runtime Stderr: ${stderr}`);
                    reject(stderr);
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = { executeJava };
