import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Personagens from "./pages/Personagens";

import Login from "./pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/personagens" element={<Personagens />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
