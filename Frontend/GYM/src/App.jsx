import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Entrenadores from "./pages/Entrenadores.jsx";
import Seguimiento from "./pages/Seguimiento.jsx";
import Resenas from "./pages/Resenas.jsx";
import ReservaClase from "./pages/ReservaClase.jsx";
import CrearClase from "./pages/CrearClase.jsx";
import Tienda from "./pages/Tienda.jsx";
import CarritoPage from "./pages/Carrito.jsx"; // nueva página del carrito

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

        {/* Reservar Clases — recibe id_entrenador */}
        <Route
          path="/reserva/:id_entrenador"
          element={
            <ProtectedRoute>
              <ReservaClase />
            </ProtectedRoute>
          }
        />

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
