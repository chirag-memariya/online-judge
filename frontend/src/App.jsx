import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Table from "./components/Table"
function App() {

  const items = ["A", "B", "C", "D", "E", "F"];
  // console.log(items);
  const name = 'World!'
  return (
    <>
      <Navbar/>
      <br/>
      <h1 className="text-3xl text-slate-600 font-bold">
        Hello {name}
      </h1>
      <Table items={items} heading="Dynamic List"/>
      <Footer/>
    </>
  )
}

export default App
