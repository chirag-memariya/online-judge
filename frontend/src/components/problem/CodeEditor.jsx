import React, { useState } from 'react'
import axios from 'axios';

const CodeEditor = () => {
    const [language, setLanguage] = useState('cpp');
    const [code, setCode] = useState(`

        #include <iostream>
        using namespace std;
   
        int main(){
            int n1,n2,sum;
            cin >> n1 >> n2;
            sum = n1 + n2;
            std::cout <<"The sum of the two number is: "<< sum;
            return 0;
        }
        
        `);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleSubmit = async () => {
        const payload = {
            language,
            code,
            input
        };
        try {
            const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL, payload,{
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
    return (
        <>
        <div className="flex-1 p-4 bg-white shadow rounded">

            <div className="flex flex-col justify-center items-center">

                <h1>CodeEditor</h1>
                <select 
                    value={language}
                    onChange={(e)=>setLanguage(e.target.value)}
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
                        handleSubmit();
                        // document.getElementById('output').focus();
                    }}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Run
                    </span>
                </button>
            </div>
        </div>

        </>
    )
}

export default CodeEditor