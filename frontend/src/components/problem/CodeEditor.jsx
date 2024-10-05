import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Zap, Play, Send, Maximize2, Minimize2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CodeEditor = ({ problemId }) => {
    const [language, setLanguage] = useState('cpp');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [verdict, setVerdict] = useState('');
    const [code, setCode] = useState(``);
    const [testCases, setTestCases] = useState([]);
    const [activeTab, setActiveTab] = useState('input');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [executionTime, setExecutionTime] = useState(null);
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
        setIsRunning(true);
        const startTime = performance.now();
        const payload = { language, code, input };
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/run`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            const endTime = performance.now();
            setExecutionTime(((endTime - startTime) / 1000).toFixed(3));
            setOutput(data.output);
            setVerdict('Run Complete');
            setActiveTab('output');
        } catch (error) {
            console.error('Error:', error);
            setOutput('');
            setVerdict('Error running code');
            setActiveTab('verdict');
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!problemId) return;
        setIsRunning(true);
        let allPassed = true;
        const submissionResults = [];
        const startTime = performance.now();

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const payload = { language, code, input: testCase.input };

            try {
                const { data } = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/run`, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const isCorrect = data.output.trim() === testCase.output.trim();
                submissionResults.push({
                    testCaseId: testCase._id,
                    output: data.output,
                    expected: testCase.output,
                    isCorrect
                });
                if (!isCorrect) allPassed = false;
            } catch (error) {
                submissionResults.push({
                    testCaseId: testCase._id,
                    output: error.message,
                    expected: testCase.output,
                    isCorrect: false
                });
                allPassed = false;
            }
        }

        const endTime = performance.now();
        const executionTime = ((endTime - startTime) / 1000).toFixed(3);
        setExecutionTime(executionTime);

        const verdict = allPassed ? 'Accepted' : 'Wrong Answer';
        setVerdict(verdict);

        // Format verdict details
        const verdictDetails = submissionResults.map((result, index) =>
            `Test Case ${index + 1}: ${result.isCorrect ? '✅' : '❌'}
            ${!result.isCorrect ? `\nExpected: ${result.expected}\nGot: ${result.output}` : ''}`
        ).join('\n\n');

        setVerdict(`${verdict}\n\nExecution Time: ${executionTime}s\n\n${verdictDetails}`);

        const submissionPayload = {
            problem: problemId,
            user: userId,
            verdict,
            solution: code,
            execution_time: parseFloat(executionTime)
        };

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submissions/create`, submissionPayload, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Failed to store submission:', error);
        }

        setActiveTab('verdict');
        setIsRunning(false);
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
        <div className={`p-6 flex-1 bg-gradient-to-br from-white via-white/80 to-blue-50/50 dark:from-gray-900 dark:via-gray-800/80 dark:to-blue-900/30 shadow-lg overflow-hidden ${isFullScreen ? 'fixed top-0 left-0 w-full h-full z-50' : ''}`}>
            {/* Language and Code Editor Section */}
            <div className={`mb-6 ${isFullScreen ? 'h-full' : ''}`} ref={codeEditorRef}>
                <div className="flex items-center justify-between mb-6">
                    <div className='flex items-center space-x-2'>
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25" />
                        <div className="relative bg-white dark:bg-gray-800 p-1 rounded-lg">
                            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="p-2 w-3/2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                        <option value="cpp">C++ (C++17/C++20)</option>
                        <option value="java">Java (OpenJDK 21)</option>
                        <option value="py">Python (3.12.3)</option>
                        <option value="go">Golang (1.22.7)</option>
                        <option value="js">JavaScript (Node.js 18.20.4)</option>

                    </select>
                    </div>
                    <button
                        onClick={toggleFullScreen}
                        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-all duration-200"
                    >
                        {isFullScreen ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7" />
                                </svg>
                                <span className="text-sm">Exit</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                </svg>
                                <span className="text-sm">Fullscreen</span>
                            </>
                        )}
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
            <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                {['input', 'output', 'verdict'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tab
                                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
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
    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-500 to-green-600 text-white focus:ring-4 focus:outline-none focus:ring-green-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 active:shadow-md"
>
    <span className="relative px-5 py-2.5 flex items-center transition-all ease-in duration-200 group-hover:bg-opacity-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Run
    </span>
</button>

<button
    onClick={handleSubmit}
    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-red-500 to-red-600 text-white focus:ring-4 focus:outline-none focus:ring-red-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 active:shadow-md"
>
    <span className="relative px-5 py-2.5 flex items-center transition-all ease-in duration-200 group-hover:bg-opacity-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        Submit
    </span>
</button>

            </div>
        </div>
    )
}

export default CodeEditor;
