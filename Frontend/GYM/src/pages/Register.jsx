import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../api/authApi";
import "../styles.css";

function Register() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [rol, setRol] = useState("cliente");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !dni) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      await registerRequest({ nombre, apellidos, email, dni, rol });
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>Registro</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />

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

        <select value={rol} onChange={(e) => setRol(e.target.value)} className="input">
          <option value="cliente">Cliente</option>
          <option value="entrenador">Entrenador</option>
        </select>

        {error && <p className="error">{error}</p>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
