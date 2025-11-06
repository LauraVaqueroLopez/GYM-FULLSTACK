import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (error) {
      console.warn("No se pudo parsear el user del localStorage:", error);
      localStorage.removeItem("user"); // limpiar si está corrupto
=======
    // Read auth state synchronously from localStorage on mount
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.warn("No se pudo parsear el user del localStorage:", error);
      localStorage.removeItem("user"); // limpiar si está corrupto
    } finally {
      // mark initialization complete so ProtectedRoute knows we checked localStorage
      setInitializing(false);
>>>>>>> 8c6e238735ad899402d437ff7399cf30678e3e65
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
    <AuthContext.Provider value={{ user, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👇 Hook para usar AuthContext más fácilmente en cualquier componente
export const useAuth = () => useContext(AuthContext);
