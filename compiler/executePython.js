const { exec } = require('child_process');

const executePython = async (filePath, inputFilePath) => {
    return new Promise((resolve, reject) => {
        exec(
            `python3 ${filePath} < ${inputFilePath}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing Python script: ${error.message}`);
                    reject(error);
                }
                if (stderr) {
                    console.error(`Python script stderr: ${stderr}`);
                    reject(stderr);
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = { executePython };
