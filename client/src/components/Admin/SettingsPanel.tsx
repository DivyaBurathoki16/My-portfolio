import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiUser } from "react-icons/fi";
import api from "../../services/api";

interface Settings {
  github: string;
  linkedin: string;
  email: string;
  name: string;
}

interface SettingsPanelProps {
  adminPassword: string;
}

const SettingsPanel = ({ adminPassword }: SettingsPanelProps) => {
  const [settings, setSettings] = useState<Settings>({
    github: "",
    linkedin: "",
    email: "",
    name: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/settings");
      setSettings(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.put("/api/settings", settings, {
        headers: { "x-admin-password": adminPassword }
      });
      setSuccess("Settings updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <motion.div
      className="settings-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Site Settings</h2>
      <p className="settings-description">Update your social links and profile information</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="name">
            <FiUser /> Your Name
          </label>
          <input
            type="text"
            id="name"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            placeholder="Your Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <FiMail /> Email Address
          </label>
          <input
            type="email"
            id="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            placeholder="your-email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="github">
            <FiGithub /> GitHub URL
          </label>
          <input
            type="url"
            id="github"
            value={settings.github}
            onChange={(e) => setSettings({ ...settings, github: e.target.value })}
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedin">
            <FiLinkedin /> LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin"
            value={settings.linkedin}
            onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
            placeholder="https://www.linkedin.com/in/yourusername"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SettingsPanel;

