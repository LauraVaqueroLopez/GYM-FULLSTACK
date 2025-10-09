import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/authApi";
import "../styles.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [mensaje, setMensaje] = useState(""); // mensaje éxito
  const [error, setError] = useState("");     // mensaje error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!email.trim() || !dni.trim()) {
      setError("Completa todos los campos");
      return;
    }

    try {
      const res = await loginRequest(email, dni);

      // Guardar usuario y token
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      // Mostrar mensaje de éxito
      setMensaje("✅ Has iniciado sesión correctamente");

      // Redirigir al dashboard después de 1 segundo
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      console.log(err.response); // para depurar en consola
      setError(err.response?.data?.message || "Error al iniciar sesión");
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
