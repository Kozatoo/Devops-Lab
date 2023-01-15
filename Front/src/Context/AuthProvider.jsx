import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const AuthContext = React.createContext(undefined);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && !user) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          setUser(result.data);
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, []);

  const Login = (data) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/login`, { ...data })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("token", JSON.stringify(res.data.token));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const Register = (data) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/register`, { ...data })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("token", JSON.stringify(res.data.token));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const Logout = () => {
    setUser(undefined);
    localStorage.removeItem("token");
  };

  const context = React.useMemo(
    () => ({
      user,
      setUser,
      Login,
      Register,
      Logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
