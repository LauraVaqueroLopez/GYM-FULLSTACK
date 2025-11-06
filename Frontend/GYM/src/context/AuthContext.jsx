import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (error) {
      console.warn("No se pudo parsear el user del localStorage:", error);
      localStorage.removeItem("user"); // limpiar si está corrupto
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👇 Hook para usar AuthContext más fácilmente en cualquier componente
export const useAuth = () => useContext(AuthContext);
