import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Personagens from "./pages/Personagens";

import Login from "./pages/Login";
import RotaPrivada from "./components/RotaApenasComLogin";
import MeusPersonagens from "./pages/MeusPersonagens";
import DetalhePersonagem from "./pages/DetalhePersonagem";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/personagens" element={<Personagens />} />
          <Route path="/personagens/:id" element={<DetalhePersonagem />} />

          <Route
            path="/meus-personagens"
            element={
              <RotaPrivada>
                <MeusPersonagens />
              </RotaPrivada>
            }
          />
          <Route
            path="/meus-personagens/:id"
            element={
              <RotaPrivada>
                <DetalhePersonagem />
              </RotaPrivada>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
