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
import EditMainPage from "./Components/EditMainPage";
import UpdateCarousels from "./Components/UpdateCarousels"
// import UpdateAllCarousels from "./Components/UpdateAllCarousels";
import Footer from "./Components/Footer";
import { IContent } from "./interfaces/content";
import UpdateAbout from "./Components/UpdateAbout";
import UpdateReservation from "./Components/UpdateReservation";
import UpdateMenus from "./Components/UpdateMenus";
import { ICarousels } from "./interfaces/carousels";
import { IMenus } from "./interfaces/menus";
import UpdateContact from "./Components/UpdateContact";
import UpdateGrid from "./Components/UpdateGrid";
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (config: any, callback: (error: any, result: any) => void) => { open: () => void; };
    };
  }
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<IContent | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [menus, setMenus] = useState<IMenus[]>([]);
  const [carousels, setCarousels] = useState<ICarousels[]>([]);
  const [grid, setGrid] = useState<any[]>([]);
  async function fetchCarousels() {
    const contentId = content?.id;
    try {
      const resp = await axios.get(`${baseUrl}/content/${contentId}/carousel`);
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        setCarousels(resp.data);
        console.log(resp.data[0]);
      } else {
        console.error("Carousels data format is not as expected:", resp.data);
      }
    } catch (error) {
      console.error("Error fetching carousels:", error);
    }
  }

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
  async function fetchAllUsers() {
    try {
      const resp = await axios.get(`${baseUrl}/users`);
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        setAllUsers(resp.data);
      } else {
        console.error("Users data format is not as expected:", resp.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  async function fetchContent() {
    try {
      const resp = await axios.get(`${baseUrl}/content`);
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        setContent(resp.data[0]);
        // console.log(resp.data[0]);
      } else {
        console.error("Content data format is not as expected:", resp.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }

  async function fetchMenus() {
    const contentId = content?.id;
    try {
      const resp = await axios.get(`${baseUrl}/content/${contentId}/menus`);
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        setMenus(resp.data);
        // console.log(resp.data[0]);
      } else {
        console.error("Menus data format is not as expected:", resp.data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  }

  async function fetchGrid() {
    const contentId = content?.id;
    try {
      const resp = await axios.get(`${baseUrl}/content/${contentId}/grid`);
      setGrid(resp.data);
    } catch (error) {
      console.error("Error fetching grid:", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser();
    fetchContent();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (content?.id) {
      fetchMenus();
      fetchCarousels();
      fetchGrid();
    }
  }, [content]);

  

  return (
    <>
      <Router>
        <Nav user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home content={content} setContent={setContent} menus={menus} setMenus={setMenus} carousels={carousels} setCarousels={setCarousels} grid={grid} setGrid={setGrid} menusId={""} menusType={""} menusText={""} menusUrl={""} />} />
          <Route path="/login" element={<Login fetchUser={fetchUser} user={user} />} />
          <Route path="/signup" element={<Signup user={user} setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
          <Route path="/updateaccount/:userId" element={<UpdateAccount user={user} setUser={setUser} />} />
          <Route path="/userlist" element={<UserList allUsers={allUsers} setallUsers={setAllUsers} />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/EditMainPage" element={<EditMainPage content={content} setContent={setContent} user={user} setUser={setUser} />} />
          {/* <Route path="/updateAllCarousels/:contentId" element={<UpdateAllCarousels carousels={carousels} setCarousels={setCarousels} setContent={setContent} content={content} />} /> */}
          <Route path="/updateAbout/:contentId" element={<UpdateAbout content={content} setContent={setContent} user={user} setUser={setUser} />} />
          <Route path="/updateReservation/:contentId" element={<UpdateReservation content={content} setContent={setContent} user={user} setUser={setUser} />} />
          <Route path="/updateCarousels/:contentId" element={<UpdateCarousels content={content} setContent={setContent} carousels={carousels} setCarousels={setCarousels} user={user} setUser={setUser} />} />
          <Route path="/updateMenus/:contentId" element={<UpdateMenus content={content} setContent={setContent} menus={menus} setMenus={setMenus} user={user} setUser={setUser} />} />
          <Route path="/updateContact/:contentId" element={<UpdateContact content={content} setContent={setContent} user={user} setUser={setUser} />} />
          <Route path="/updateGrid/:contentId" element={<UpdateGrid content={content} setContent={setContent} user={user} setUser={setUser} grid={grid} setGrid={setGrid} />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;