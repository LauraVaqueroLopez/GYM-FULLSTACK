import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Entrenadores from "./pages/Entrenadores.jsx";
import Seguimiento from "./pages/Seguimiento.jsx"; 
import Resenas from "./pages/Resenas.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Registro */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Entrenadores protegido */}
        <Route
          path="/entrenadores"
          element={
            <ProtectedRoute>
              <Entrenadores />
            </ProtectedRoute>
          }
        />

        {/* Seguimiento protegido (entrenador o cliente) */}
        <Route
          path="/seguimiento"
          element={
            <ProtectedRoute>
              <Seguimiento />
            </ProtectedRoute>
          }
        />

        {/* Reseñas protegido */}
        <Route
          path="/resenas"
          element={
            <ProtectedRoute>
              <Resenas />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
