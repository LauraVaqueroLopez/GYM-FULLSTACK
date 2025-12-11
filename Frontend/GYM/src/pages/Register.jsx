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
  // Campos adicionales para cliente
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [objetivo, setObjetivo] = useState("perder peso");
  // Campos adicionales para entrenador
  const [especialidad, setEspecialidad] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !dni) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    // Si es cliente, validar edad >= 16
    if (rol === "cliente" && fechaNacimiento) {
      const today = new Date();
      const birth = new Date(fechaNacimiento);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 16) {
        setError("Debes tener al menos 16 años para registrarte como cliente");
        return;
      }
    }

    try {
      // Construir payload dependiendo del rol
      const payload = { nombre, apellidos, email, dni, rol };
      if (rol === "cliente") {
        payload.fecha_nacimiento = fechaNacimiento || null;
        payload.peso = peso || null;
        payload.altura = altura || null;
        payload.objetivo = objetivo || null;
      } else if (rol === "entrenador") {
        payload.especialidad = especialidad || null;
        payload.experiencia = experiencia ? Number(experiencia) : null;
        payload.descripcion = descripcion || null;
      }

      await registerRequest(payload);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form login-form--register" onSubmit={handleRegister}>
        <h2>Registro</h2>

        <div className="row">
          <div className="field">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <input
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <input
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
          </div>
        </div>

        <select value={rol} onChange={(e) => setRol(e.target.value)} className="input">
          <option value="cliente">Cliente</option>
          <option value="entrenador">Entrenador</option>
        </select>

        {/* Campos condicionales para cliente */}
        {rol === "cliente" && (
          <div>
            <h4>Datos del cliente</h4>

            <div className="row">
              <div className="field">
                <label className="small">Fecha de nacimiento</label>
                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="small">Peso (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Peso (kg)"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label className="small">Altura (cm)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="Altura (cm)"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="small">Objetivo</label>
                <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)}>
                  <option value="perder peso" required>Perder peso</option>
                  <option value="ganar músculo" required>Ganar músculo</option>
                  <option value="mejorar resistencia" required>Mejorar resistencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Campos condicionales para entrenador */}
        {rol === "entrenador" && (
          <div>
            <h4>Datos del entrenador</h4>
            <div className="row">
              <div className="field">
                <label className="small">Especialidad</label>
                <input
                  type="text"
                  placeholder="Especialidad"
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="small">Experiencia (años)</label>
                <input
                  type="number"
                  placeholder="Ej. 5"
                  min="0"
                  max="80"
                  step="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label className="small">Descripción breve</label>
                <textarea
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
