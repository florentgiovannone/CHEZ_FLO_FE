
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { baseUrl } from "./config";
import Nav from "./Components/Nav"
import Home from "./Components/Home"
import Login from "./Components/Login"
import Signup from "./Components/Signup"
import Dashboard from "./Components/Dashboard"
import Footer from "./Components/Footer"

declare global {
  interface Window { cloudinary: any; }
}

function App() {

  const [user, setUser] = useState(null)
  async function fetchUser() {
    const token = localStorage.getItem('token')
    const resp = await axios.get(`${baseUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log(user);
    setUser(resp.data)
  }
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) fetchUser()
  }, [])

return(
  <>
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/login" element={<Login fetchUser={fetchUser} user={user} />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
      </Routes>
    <Footer />
    </Router>
  </>
)
}

export default App
