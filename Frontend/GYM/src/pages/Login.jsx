import React, { useState, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/authApi";
import "../styles.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [mensaje, setMensaje] = useState(""); // mensaje éxito
  const [error, setError] = useState("");     // mensaje error
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const loginSucceededRef = useRef(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("[CLIENT DEBUG] handleLogin start");
    setError("");
    setMensaje("");
    if (submittingRef.current) {
      console.log("[CLIENT DEBUG] already submitting (ref), ignoring duplicate submit");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);

    if (!email.trim() || !dni.trim()) {
      setError("Completa todos los campos");
      return;
    }

    try {
      // Normalizar DNI en cliente antes de enviarlo
      const normalizeDni = (raw) => String(raw || "").trim().replace(/[-\s]/g, "").toUpperCase();
      const dniToSend = normalizeDni(dni);
      console.log("[CLIENT DEBUG] sending login with:", { email, dniRaw: dni, dniToSend });
  const res = await loginRequest(email, dniToSend);
  console.log("Login response:", res.data); // para depuración


      // Usar AuthContext para almacenar usuario y token globalmente
      login(res.data.user, res.data.token);
  loginSucceededRef.current = true;
      setError("");
      setMensaje("✅ Has iniciado sesión correctamente");
      // Redirigir inmediatamente al dashboard
      navigate("/dashboard");

    } catch (err) {
      // Log completo para poder depurar cuando err.response sea undefined
      console.log("Login error (full):", err);
      // Si ya tuvimos un login exitoso, ignoramos errores posteriores
      if (loginSucceededRef.current) {
        console.log("[CLIENT DEBUG] login already succeeded, ignoring error");
      } else {
        setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
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

  <button type="submit">Entrar</button>

        {/* Mensajes */}
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