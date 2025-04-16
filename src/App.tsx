import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "./config";
import Nav from "./Components/Nav";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import UpdateAccount from "./Components/UpdateAccount";
import UserList from "./Components/UserList";
import ChangePassword from "./Components/ChangePassword";
import Footer from "./Components/Footer";
import { IContent } from "./interfaces/content";  

declare global {
  interface Window {
    cloudinary: any;
  }
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<IContent | null>(null); 
  const [allUsers, setAllUsers] = useState<any[]>([]);

  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp = await axios.get(`${baseUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resp.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  }

  async function fetchContent() {
    try {
      const resp = await axios.get(`${baseUrl}/content`);
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        setContent(resp.data[0]); 
        console.log(resp.data[0]);
      } else {
        console.error("Content data format is not as expected:", resp.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }

  async function fetchAllUsers() {
    try {
      const resp = await axios.get(`${baseUrl}/all_users`);
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        setAllUsers(resp.data);
      } else {
        console.error("Users data format is not as expected:", resp.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser();
    fetchContent();
    fetchAllUsers();
  }, []);

  return (
    <>
      <Router>
        <Nav user={user} setUser={setUser}/>
        <Routes>
          <Route path="/" element={<Home content={content} setContent={setContent} />} />
          <Route path="/login" element={<Login fetchUser={fetchUser} user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
          <Route path="/updateaccount/:userId" element={<UpdateAccount />} />
          <Route path="/userlist" element={<UserList allUsers={allUsers} setallUsers={setAllUsers} />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;