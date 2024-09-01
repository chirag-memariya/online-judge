import React from 'react'

const ProblemDiscription = ({item}) => {
    if(!item){
        return <p>Loading...</p>;
    }
    return (
    <>
<div className="flex-1 p-4 bg-white shadow rounded">
        <div className="bg-gray-900 md:col-span-4 p-10 text-white">
          <p className="mt-4 text-sm leading-7 font-regular uppercase">
            Problem Details
          </p>
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight">
            {item.title} <span className="text-indigo-600">Problem</span>
          </h3>
          <p className="mt-4 leading-7 text-gray-200">
            {item.statement}
          </p>
          <h4 className="mt-6 text-2xl font-bold">Input/Output Sample</h4>
          <p className="mt-2 leading-7 text-gray-200">
            {item.input_output_sample}
          </p>
          <h4 className="mt-6 text-2xl font-bold">Difficulty</h4>
          <p className="mt-2 leading-7 text-gray-200">
            {item.difficulty}
          </p>
        </div>
      </div>


    </>
  )
}

export default ProblemDiscription