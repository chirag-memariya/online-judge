import React, { useState } from 'react'
import axios from 'axios';

const CodeEditor = () => {

    const [code, setCode] = useState(`
        #include <iostream>
        int main(){
            std::cout <<"Hello World!";
            return 0;
        }
        `);

        const handleSubmit = async ()=>{    
            const payload = {
                language: 'cpp',
                code
            };
            try {
                const responce  = await axios.post('http://localhost:8080/run',payload)
                console.log(responce.data);
                
            } catch (error) {
                console.log(error);
                
            }
        };
    return (
        <>
            <div className="flex flex-col justify-center items-center">

                <h1>CodeEditor</h1>
                <select>
                    <option value='cpp'>C++</option>
                    <option value='java'>Java</option>
                    <option value='python'>Python</option>
                    <option value='go'>Golang</option>
                    <option value='js'>JavaScript</option>
                </select>


                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Code</label>
                <textarea
                    id="message"
                    rows="7"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={code}
                    onChange={(e)=>setCode(e.target.value)}
                    placeholder="Write code here...">
                </textarea>

                <button
                    onClick={handleSubmit}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Run
                    </span>
                </button>
            </div>
        </>
    )
}

export default CodeEditor