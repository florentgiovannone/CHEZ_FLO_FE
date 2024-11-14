
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Nav from "./Components/Nav"
import Home from "./Components/Home"
import Login from "./Components/Login"
import Signup from "./Components/Signup"
import Footer from "./Components/Footer"
function App() {

return(
  <>
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    <Footer />
    </Router>
  </>
)
}

export default App
