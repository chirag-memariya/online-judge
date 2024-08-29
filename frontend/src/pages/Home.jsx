import React from 'react'
import Navbar from '../components/Navbar'
import Table from '../components/Table'
import Footer from '../components/Footer'

const Home = () => {
    const items = ["A", "B", "C", "D", "E", "F"];
    // console.log(items);
    const name = 'World!'
    return (
        <>
            <Navbar />
            <br />
            <h1 className="text-3xl text-slate-600 font-bold">
                Hello {name}
            </h1>
            <Table />
            <Footer />
        </>

    )
}

export default Home