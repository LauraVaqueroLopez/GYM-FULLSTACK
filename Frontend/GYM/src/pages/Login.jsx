import React, { useState, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/authApi";
import "../styles.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);

    if (!email.trim() || !dni.trim()) {
      setError("Completa todos los campos");
      setSubmitting(false);
      submittingRef.current = false;
      return;
    }

    try {
      // Limpiar token antiguo antes de login
      localStorage.removeItem("token");

      const normalizeDni = (raw) =>
        String(raw || "").trim().replace(/[-\s]/g, "").toUpperCase();
      const dniToSend = normalizeDni(dni);

      const res = await loginRequest(email, dniToSend);

      // Guardar siempre el token actualizado
      localStorage.setItem("token", res.data.token);

      // Guardar usuario en AuthContext
      login(res.data.user, res.data.token);

      setMensaje("✅ Has iniciado sesión correctamente");
      setError("");

      navigate("/dashboard");
    } catch (err) {
      console.log("Login error:", err);
      setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="login-container">
      <form className="login-form login-form--login" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Ingresando..." : "Entrar"}
        </button>

        {error && <p className="error">{error}</p>}
        {mensaje && <p className="success">{mensaje}</p>}

        <div className="form-note-center">
          <span>¿No tienes cuenta? </span>
          <Link to="/register" className="signup-link">
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
