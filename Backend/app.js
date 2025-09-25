const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);

app.listen(3001, () => console.log('Servidor backend corriendo en http://localhost:3001'));
