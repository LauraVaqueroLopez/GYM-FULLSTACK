import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
<<<<<<< HEAD
import Entrenadores from "./pages/Entrenadores.jsx";
=======
import Seguimiento from "./pages/Seguimiento.jsx";
>>>>>>> 8c6e238735ad899402d437ff7399cf30678e3e65
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app-center">
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
<<<<<<< HEAD

            <Route
              path="/entrenadores"
              element={
                <ProtectedRoute>
                  <Entrenadores />
=======
            <Route
              path="/seguimiento"
              element={
                <ProtectedRoute>
                  <Seguimiento />
>>>>>>> 8c6e238735ad899402d437ff7399cf30678e3e65
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
