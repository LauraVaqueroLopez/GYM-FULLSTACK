import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/authApi";
import "../styles.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [mensaje, setMensaje] = useState(""); // mensaje éxito
  const [error, setError] = useState("");     // mensaje error
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const loginSucceededRef = useRef(false);
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


      // Guardar usuario y token
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // Llamar a setUser solo si es una función (evita TypeError si no se pasó)
      if (typeof setUser === "function") {
        setUser(res.data.user);
      } else {
        console.log("[CLIENT DEBUG] setUser no proporcionado, omitiendo actualización de estado de usuario");
      }

      // Asegurarnos de que no queda mensaje de error previo y marcar éxito
      setError("");
      loginSucceededRef.current = true;

      // Mostrar mensaje de éxito
      setMensaje("✅ Has iniciado sesión correctamente");

      // Redirigir al dashboard después de 1 segundo
      setTimeout(() => navigate("/dashboard"), 1000);

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

  <button type="submit" disabled={submitting}>{submitting ? 'Enviando...' : 'Entrar'}</button>

        {/* Mensajes */}
        {error && <p className="error">{error}</p>}
        {mensaje && <p className="success">{mensaje}</p>}

        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <span>¿No tienes cuenta? </span>
          <Link to="/register" style={{ color: "#2575fc", textDecoration: "none" }}>
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;