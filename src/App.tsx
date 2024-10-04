
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Nav from "./Components/Nav"
import Home
 from "./Components/Home"
function App() {
return(
  <Router>
    <Nav />
    <Routes>
      <Route path="/" element={<Home/>} />
    </Routes>
  </Router>
)
}

export default App
