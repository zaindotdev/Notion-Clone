import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContext {
  user: User;
  setUser: (user: User) => void;
  token?: string;
  setToken: (token: string) => void;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContext>({
  setToken: () => {},
  token: "",
  setUser: () => {},
  user: {} as User,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      setUser(JSON.parse(user || "{}"));
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ setToken, token, setUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};
