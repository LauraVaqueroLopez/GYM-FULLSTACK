import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Entrenadores from "./pages/Entrenadores.jsx";
import Seguimiento from "./pages/Seguimiento.jsx";
import Resenas from "./pages/Resenas.jsx";
import ReservaClase from "./pages/ReservaClase.jsx"; // Componente de reserva
import CrearClase from "./pages/CrearClase.jsx";
import Tienda from "./pages/Tienda.jsx";
import CarritoPage from "./pages/Carrito.jsx"; 

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Registro */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Entrenadores */}
        <Route
          path="/entrenadores"
          element={
            <ProtectedRoute>
              <Entrenadores />
            </ProtectedRoute>
          }
        />

        {/* Seguimiento */}
        <Route
          path="/seguimiento"
          element={
            <ProtectedRoute>
              <Seguimiento />
            </ProtectedRoute>
          }
        />

        {/* Reseñas */}
        <Route
          path="/resenas"
          element={
            <ProtectedRoute>
              <Resenas />
            </ProtectedRoute>
          }
        />

        {/* ✅ RUTA CORREGIDA: Reservar Clases — Ahora en ruta fija /reserva-clase */}
        <Route
          path="/reserva-clase"
          element={
            <ProtectedRoute>
              <ReservaClase />
            </ProtectedRoute>
          }
        />

        {/* ❌ Eliminada la antigua ruta dinámica /reserva/:id_entrenador
           (o se deja comentada si la necesitas temporalmente) */}
        {/* <Route
          path="/reserva/:id_entrenador"
          element={
            <ProtectedRoute>
              <ReservaClase />
            </ProtectedRoute>
          }
        />
        */}

        {/* Crear clase — solo entrenadores */}
        <Route
          path="/crear-clase"
          element={
            <ProtectedRoute>
              <CrearClase />
            </ProtectedRoute>
          }
        />

        {/* Tienda */}
        <Route
          path="/tienda"
          element={
            <ProtectedRoute>
              <Tienda />
            </ProtectedRoute>
          }
        />

        {/* Carrito */}
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <CarritoPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;