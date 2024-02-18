import { Routes, Route } from "react-router-dom";
import Login from "./components/Login-Signup/Login";
import { useState } from "react";
import Signup from "./components/Login-Signup/Signup";
import UserDashboard from "./components/Dashboard/UserDashboard";
import Navbar from "./components/Navbar/Navbar";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ProjectPage from "./components/Project Page/ProjectPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') ? true : false);
  return (
    <>
    <Navbar token={token} settoken={setToken}/>
     <Routes>
      <Route path="/" element={<Login settoken={setToken} />} />
      <Route path="/login" element={<Login settoken={setToken}/>} />
      <Route path="/signup" element={<Signup settoken={setToken}/>} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path='/admindashboard' element={<AdminDashboard />} />
      <Route path="/project/:id/:name" element={<ProjectPage />} />
     </Routes>
    </>
  )
}

export default App
