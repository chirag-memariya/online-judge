import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CodeEditor = ({ problemId }) => {
    const [language, setLanguage] = useState('cpp');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [verdict, setVerdict] = useState('');
    const [code, setCode] = useState(``);
    const [testCases, setTestCases] = useState([]);
    const [activeTab, setActiveTab] = useState('input'); // 'input', 'output', or 'verdict'
    const [isFullScreen, setIsFullScreen] = useState(false); // Track full-screen mode
    const codeEditorRef = useRef(null);
    const { userId } = useAuth();


    const codeTemplates = {
        cpp: `
    #include <iostream>
    using namespace std;
    
    int main() {
        // Declare variables
        // Add your logic here
    
        return 0;
    }
        `,
    
        java: `
    import java.util.Scanner;
    
    public class Main {
        public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            // Declare variables
            // Add your logic here
        }
    }
        `,
    
        py: `
    # Read input here
    # Add your logic here
    
    if __name__ == "__main__":
        # Example function call or logic
        pass
        `,
    
        go: `
    package main
    import "fmt"
    
    func main() {
        // Declare variables
        // Add your logic here
    }
        `,
    
        js: `
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('', (answer) => {
        // Process input and logic here
        rl.close();
    });
        `
    };
    

    useEffect(() => {
        setCode(codeTemplates[language]);
    }, [language]);

    useEffect(() => {
        const fetchTestCases = async () => {
            if (!problemId) return;
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/testcases/problem/${problemId}`);
                const fetchedTestCases = response.data[0]?.cases || [];
                setTestCases(fetchedTestCases);
            } catch (error) {
                console.error("Failed to fetch test cases: ", error);
            }
        };

        fetchTestCases();
    }, [problemId]);

    const handleRun = async () => {
        const payload = { language, code, input };
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/run`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            setOutput(data.output);
            setVerdict('Run Complete');
            setActiveTab('output');
        } catch (error) {
            console.error('Error:', error);
            setOutput('');
            setVerdict('Error running code');
            setActiveTab('verdict');
        }
    };

    const handleSubmit = async () => {
        if (!problemId) return;

        let allPassed = true;
        const submissionResults = [];

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const payload = { language, code, input: testCase.input };

            try {
                const { data } = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/run`, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const isCorrect = data.output.trim() === testCase.output.trim();
                submissionResults.push({ testCaseId: testCase._id, output: data.output, isCorrect });
                if (!isCorrect) allPassed = false;
            } catch (error) {
                submissionResults.push({ testCaseId: testCase._id, output: error.message, isCorrect: false });
                allPassed = false;
            }
        }

        const verdict = allPassed ? 'Accepted' : 'Wrong Answer';
        setVerdict(verdict);

        const submissionPayload = {
            problem: problemId,
            user: userId,
            verdict,
            solution: code,
            execution_time: 0
        };

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submissions/create`, submissionPayload, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Failed to store submission:', error);
        }

        setActiveTab('verdict');
    };

    const toggleFullScreen = () => {
        if (isFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullScreen(false);
        } else {
            if (codeEditorRef.current.requestFullscreen) {
                codeEditorRef.current.requestFullscreen();
            } else if (codeEditorRef.current.webkitRequestFullscreen) {
                codeEditorRef.current.webkitRequestFullscreen();
            } else if (codeEditorRef.current.mozRequestFullScreen) {
                codeEditorRef.current.mozRequestFullScreen();
            } else if (codeEditorRef.current.msRequestFullscreen) {
                codeEditorRef.current.msRequestFullscreen();
            }
            setIsFullScreen(true);
        }
    };

    if (!problemId) {
        console.error("CodeEditor rendered without a problemId");
        return <div>Error: Problem ID is not available</div>;
    }

    return (
        <div className={`flex-1 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg ${isFullScreen ? 'fixed top-0 left-0 w-full h-full z-50' : ''}`}>
            {/* Language and Code Editor Section */}
            <div className={`mb-6 ${isFullScreen ? 'h-full' : ''}`} ref={codeEditorRef}>
                <div className="flex items-center justify-between mb-4">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="p-2 w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg mr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="py">Python</option>
                        <option value="go">Golang</option>
                        <option value="js">JavaScript</option>
                    </select>
                    <button
                        onClick={toggleFullScreen}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                        {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                    </button>
                </div>

        {/* color: '#cce7ff', // Change this color as needed */}

        <textarea
    rows={isFullScreen ? "auto" : "14"}
    className={`block p-3 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 ${isFullScreen ? 'h-full' : ''}`}
    style={{
        resize: 'none',
        overflow: 'auto',
        fontFamily: 'monospace',
        lineHeight: '1.5',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        color: '#d1d5db', // Example color for dark mode
        outline: 'none', // Remove default focus outline
    }}
    value={code}
    onChange={(e) => setCode(e.target.value)}
    placeholder="Write code here..."
    spellCheck={false} // Disable spell-check and grammar correction
    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(66, 153, 225, 0.5)'} // Add shadow on focus
    onBlur={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'} // Reset shadow when focus is lost
/>
            </div>

            {/* Navbar for Input, Output, Verdict */}
            <div className="mb-6">
                <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-600">
                    <button
                        onClick={() => setActiveTab('input')}
                        className={`p-2 ${activeTab === 'input' ? 'font-bold text-blue-500' : 'text-gray-600'}`}
                    >
                        Input
                    </button>
                    <button
                        onClick={() => setActiveTab('output')}
                        className={`p-2 ${activeTab === 'output' ? 'font-bold text-blue-500' : 'text-gray-600'}`}
                    >
                        Output
                    </button>
                    <button
                        onClick={() => setActiveTab('verdict')}
                        className={`p-2 ${activeTab === 'verdict' ? 'font-bold text-blue-500' : 'text-gray-600'}`}
                    >
                        Verdict
                    </button>
                </nav>
            </div>

            {/* Dynamic Content Based on Active Tab */}
            {activeTab === 'input' && (
    <div className="mb-6">
        <textarea
            rows="2"
            className="block p-3 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            style={{
                resize: 'none',
                overflow: 'auto',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                padding: '10px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                color: '#d1d5db', // Example color for dark mode
                outline: 'none', // Remove default focus outline
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Provide input here..."
            spellCheck={false} // Disable spell-check and grammar correction
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(66, 153, 225, 0.5)'} // Add shadow on focus
            onBlur={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'} // Reset shadow when focus is lost
        />
    </div>
)}

{activeTab === 'output' && (
    <div className="mb-6">
        <textarea
            rows="3"
            readOnly
            className="block p-3 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            style={{
                resize: 'none',
                overflow: 'auto',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                padding: '10px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                color: '#d1d5db', // Example color for dark mode
                outline: 'none', // Remove default focus outline
            }}
            value={output}
            placeholder="Output will appear here..."
            spellCheck={false} // Disable spell-check and grammar correction
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(66, 153, 225, 0.5)'} // Add shadow on focus
            onBlur={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'} // Reset shadow when focus is lost
        />
    </div>
)}

{activeTab === 'verdict' && (
    <div className="mb-6">
        <textarea
            rows="3"
            readOnly
            className="block p-3 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            style={{
                resize: 'none',
                overflow: 'auto',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                padding: '10px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                color: '#d1d5db', // Example color for dark mode
                outline: 'none', // Remove default focus outline
            }}
            value={verdict}
            placeholder="Verdict will appear here..."
            spellCheck={false} // Disable spell-check and grammar correction
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(66, 153, 225, 0.5)'} // Add shadow on focus
            onBlur={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'} // Reset shadow when focus is lost
        />
    </div>
)}


            {/* Run and Submit Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleRun}
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Run
                    </span>
                </button>
                <button
                    onClick={handleSubmit}
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Submit
                    </span>
                </button>
            </div>
        </div>
    )
}

export default CodeEditor;
