import React from 'react'
import Table from '../components/common/Table'

const ProblemList = () => {
  return (
    <>
      <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight p-5 shadow">
       Welcome to <span className="title text-indigo-600"> Online Judge</span>
      </h3>
      <Table />
    </>
  )
}

export default ProblemList