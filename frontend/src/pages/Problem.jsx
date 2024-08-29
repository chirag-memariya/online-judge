import React from 'react'
import CodeEditor from '../components/problem/CodeEditor'
import ProblemDiscription from '../components/problem/ProblemDiscription'
import { useLocation } from 'react-router-dom'

const Problem = () => {
  const location = useLocation();
  const item = location.state?.item;
  return (
    <>
    <div className="flex flex-row justify-between p-4 space-x-4">
    <ProblemDiscription item={item}/>
    <CodeEditor/>
    </div>
    </>
  )
}

export default Problem