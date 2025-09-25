import { useEffect, useState } from 'react';
import { getUsuarios } from '../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios().then(data => setUsuarios(data));
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {usuarios.map(u => (
          <li key={u.id_usuario}>{u.nombre} {u.apellidos}</li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
