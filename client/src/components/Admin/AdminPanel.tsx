import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleLogin = (password: string) => {
    setAdminPassword(password);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword("");
  };

  return (
    <div className="admin-panel">
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard adminPassword={adminPassword} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default AdminPanel;

