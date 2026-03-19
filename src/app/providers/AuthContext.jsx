import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const currentUser = getCurrentEmail();
  const [user, setUser] = useState(currentUser ? { email: currentUser } : null);
  const [admin, setAdmin] = useState((currentUser || false) && currentUser === "admin@a");

  function signUp(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" };
    }
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);

    setUser({ email });
    isAdmin(getCurrentEmail());
    return { success: true };
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    localStorage.setItem("currentUserEmail", email);
    setUser({ email });
    isAdmin(getCurrentEmail());
    return { success: true };
  }

  function logout() {
    localStorage.removeItem("currentUserEmail");
    setUser(null);
    setAdmin(false);
  }

  function isAdmin(current) {
    const userIsAdmin = current && current === "admin@a";
    setAdmin(userIsAdmin);
  }

  function getCurrentEmail() {
    return localStorage.getItem("currentUserEmail");
  }

  function hasCurrentEmail() {
    return !!getCurrentEmail();
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        user,
        signUp,
        logout,
        login,
        hasCurrentEmail,
        getCurrentEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
