import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    // Verify password by trying to fetch projects
    try {
      await api.get("/admin/projects", {
        headers: { "x-admin-password": password }
      });
      // Password is correct
      onLogin(password);
    } catch (err: any) {
      // Show detailed error message from server
      let errorMessage = "Invalid password. Please try again.";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        errorMessage = "Cannot connect to server. Please check your VITE_API_URL configuration.";
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid password. Please check your admin password.";
      } else if (err.response?.status === 500) {
        errorMessage = err.response?.data?.error || "Server error. Please check if ADMIN_PASSWORD is configured.";
      }
      
      setError(errorMessage);
      
      // Log detailed error in development
      if (import.meta.env.DEV) {
        console.error("Login error:", {
          status: err.response?.status,
          error: err.response?.data?.error,
          message: err.message,
          code: err.code
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          type="button"
          className="btn-back"
          title="Back to Portfolio"
          onClick={() => navigate("/")}
          style={{ marginBottom: "1.5rem" }}
        >
          <FiArrowLeft />
        </button>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

