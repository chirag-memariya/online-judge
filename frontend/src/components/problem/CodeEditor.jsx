import React, { useState, useEffect } from 'react'
import axios from 'axios';

const CodeEditor = ({ problemId }) => {
    const [language, setLanguage] = useState('cpp');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [code, setCode] = useState(``);
    const [testCases, setTestCases] = useState(``);
    const [userId, setUserId] = useState('66c4d7e3aeaf2a19328a6a7d'); // Hard-coded user ID for now

    // Console log to verify problemId is received
    // console.log("ProblemId received in CodeEditor:", problemId);


    const codeTemplates = {
        cpp: `
    #include <iostream>
    using namespace std;

    int main() {
        int n1, n2, sum;
        cin >> n1 >> n2;
        sum = n1 + n2;
        cout << sum;
        return 0;
    }
        `,
        java: `
    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            int n1 = sc.nextInt();
            int n2 = sc.nextInt();
            int sum = n1 + n2;
            System.out.println(sum);
        }
    }
        `,
        py: `
# Read the input line and split it into two parts
n1, n2 = map(int, input().split())

# Calculate the sum
sum = n1 + n2

# Print the sum
print(sum)

        `,
        go: `
    package main
    import "fmt"

    func main() {
        var n1, n2 int
        fmt.Scanf("%d %d", &n1, &n2)
        fmt.Printf("%d", n1+n2)
    }
        `,
        js: `
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('', (answer) => {
        const [n1, n2] = answer.split(' ').map(Number);
        console.log(n1 + n2);
        rl.close();
    });
        `
    };

    //Update the code whenever the language changes
    useEffect(() => {
        setCode(codeTemplates[language]);
    }, [language]);

    // Update the useEffect for fetching test cases
    useEffect(() => {
        const fetchTestCases = async () => {
            if (!problemId) {
                console.error("Problem ID is not provided");
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/testcases/problem/${problemId}`);
                const fetchedTestCases = response.data[0]?.cases || [];
                setTestCases(fetchedTestCases);
                console.log('Fetched test cases:', fetchedTestCases);
            } catch (error) {
                console.error("Failed to fetch test cases: ", error);
            }
        };

        fetchTestCases();
    }, [problemId]);


    const handleRun = async () => {
        const payload = {
            language,
            code,
            input
        };
        try {
            const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(data);
            setOutput(data.output);

        } catch (error) {
            // Detailed error logging
            console.error('Error Message:', error.message);
            console.error('Error Code:', error.code);

            if (error.response) {
                console.error('Response Data:', error.response.data);
                console.error('Response Status:', error.response.status);
                console.error('Response Headers:', error.response.headers);
            } else {
                console.error('No Response Data:', error.request);
            }
        }
    };

    const handleSubmit = async () => {
        if (!problemId) {
            console.error("Cannot submit: Problem ID is not defined");
            return;
        }

        let allPassed = true;
        const submissionResults = [];
        console.log("Handling submission....");

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const payload = {
                language,
                code,
                input: testCase.input,
            };

            console.log(`Running test case ${i + 1}:`);
            console.log("Input:", testCase.input);

            try {
                const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const isCorrect = data.output.trim() === testCase.output.trim();
                submissionResults.push({
                    testCaseId: testCase._id,
                    output: data.output,
                    isCorrect,
                });

                console.log("Output:", data.output);
                console.log("Expected Output:", testCase.output);
                console.log("Result:", isCorrect ? "Passed" : "Failed");

                if (!isCorrect) allPassed = false;
            } catch (error) {
                console.error('Error running test case:', error);
                submissionResults.push({
                    testCaseId: testCase._id,
                    output: error.message,
                    isCorrect: false,
                });
                console.log("Output: Error -", error.message);
                console.log("Result: Failed");
                allPassed = false;
            }
            console.log("--------------------");
        }

        const verdict = allPassed ? 'Accepted' : 'Wrong Answer';

        console.log("Final Verdict:", verdict);
        console.log("Submission Results:", submissionResults);


        // Here you can add code to update the UI with the results if needed

        // Store submission
        const submissionPayload = {
            problem: problemId,
            user: userId,  // Replace with actual user ID from context or props
            verdict,
            solution: code,
            execution_time: 0 // You can calculate and include actual execution time if needed
        };

        console.log("Submission Payload:", submissionPayload); // Add this line to check payload in frontend


        try {
            const response = await axios.post('http://localhost:8000/submissions', submissionPayload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert(`Submission Result: ${verdict}`);
            console.log("Submission Response:", response.data);
        } catch (error) {
            console.error('Failed to store submission:', error);
        }
    };

    if (!problemId) {
        console.error("CodeEditor rendered without a problemId");
        return <div>Error: Problem ID is not available</div>;
    }

    return (
        <>
            <div className="flex-1 p-4 bg-white shadow rounded">

                <div className="flex flex-col justify-center items-center">

                    <h1>CodeEditor</h1>
                    <p>Problem ID: {problemId}</p>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value='cpp'>C++</option>
                        <option value='java'>Java</option>
                        <option value='py'>Python</option>
                        <option value='go'>Golang</option>
                        <option value='js'>JavaScript</option>
                    </select>


                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Code</label>
                    <textarea
                        id="message"
                        rows="7"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Write code here...">
                    </textarea>


                    <label htmlFor="input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Input
                    </label>
                    <textarea
                        id="input"
                        rows="3"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                        placeholder="Provide input here...">
                    </textarea>

                    <label htmlFor="output" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Output
                    </label>
                    <textarea
                        id="output"
                        rows="5"
                        readOnly
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={output}
                        placeholder="Output will appear here...">
                    </textarea>

                    <button
                        onClick={() => {
                            handleRun();
                        }}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Run
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            handleSubmit();
                        }}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Submit
                        </span>
                    </button>
                </div>
            </div>

        </>
    )
}

export default CodeEditor