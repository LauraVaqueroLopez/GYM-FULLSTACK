const API_URL = "http://localhost:3001";

export const getUsuarios = async () => {
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};
