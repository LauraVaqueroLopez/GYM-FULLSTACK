router.post("/login", async (req, res) => {
  const { email, dni } = req.body;

  if (!email || !dni) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const normalizeDni = (raw) =>
      String(raw || "").trim().replace(/[-\s]/g, "").toUpperCase();

    if (normalizeDni(user.dni) !== normalizeDni(dni)) {
      return res.status(401).json({ message: "DNI incorrecto" });
    }

    //  SI EL USUARIO ES ENTRENADOR -> obtener id_entrenador
    let id_entrenador = null;
    if (user.rol === "entrenador") {
      const ent = await Entrenador.findOne({ where: { id_usuario: user.id_usuario } });
      console.log("ENTRENADOR ENCONTRADO:", ent);
      if (ent) id_entrenador = ent.id_entrenador;
    }

    //  SI ES CLIENTE -> obtener id_cliente
    let id_cliente = null;
    if (user.rol === "cliente") {
      const cli = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
      if (cli) id_cliente = cli.id_cliente;
    }

    //  TOKEN UNIFICADO 
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,  
        rol: user.rol,
        nombre: user.nombre,
        id_entrenador,
        id_cliente,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        id_entrenador,
        id_cliente
      },
    });

  } catch (error) {
    console.error("Error en /login:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});
