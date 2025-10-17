import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Seguimiento from "./pages/Seguimiento.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Navigate } from "react-router-dom";

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
            <Route
              path="/seguimiento"
              element={
                <ProtectedRoute>
                  <Seguimiento />
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
