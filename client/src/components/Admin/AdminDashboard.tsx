import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2, FiX, FiSettings, FiFolder, FiUser, FiMail, FiArrowLeft, FiSun, FiMoon, FiTrendingUp, FiSliders } from "react-icons/fi";
import api from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import SettingsPanel from "./SettingsPanel";
import HeroEditor from "./HeroEditor";
import AdminMessages from "./AdminMessages";
import AdminAnalytics from "./AdminAnalytics";
import ThemeCustomizer from "./ThemeCustomizer";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ImageUpload from "./ImageUpload";

interface Project {
  // In the admin dashboard we always work with Mongo-backed projects,
  // so every project should have a MongoDB _id.
  _id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
  featured?: boolean;
  order?: number;
}

interface AdminDashboardProps {
  adminPassword: string;
  onLogout: () => void;
}

const AdminDashboard = ({ adminPassword, onLogout }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"projects" | "settings" | "hero" | "messages" | "analytics" | "theme">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    tech: [],
    github: "",
    live: "",
    image: "",
    featured: false,
    order: 0
  });
  const [techInput, setTechInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; projectId: string | null; projectTitle: string }>({
    isOpen: false,
    projectId: null,
    projectTitle: ""
  });
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    fetchProjects();
    fetchUnreadMessagesCount();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/projects", {
        headers: { "x-admin-password": adminPassword }
      });
      setProjects(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadMessagesCount = async () => {
    try {
      const response = await api.get("/admin/messages", {
        headers: { "x-admin-password": adminPassword }
      });

      const messages = response.data as { createdAt: string }[];
      const lastSeenRaw = typeof window !== "undefined" ? window.localStorage.getItem("admin_messages_last_seen") : null;

      let unreadCount = 0;

      if (lastSeenRaw) {
        const lastSeen = new Date(lastSeenRaw);
        unreadCount = messages.filter((m) => new Date(m.createdAt) > lastSeen).length;
      } else {
        unreadCount = messages.length;
      }

      setUnreadMessagesCount(unreadCount);
    } catch {
      // Silently ignore unread count errors to avoid blocking the dashboard
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingProject?._id) {
        await api.put(`/admin/projects/${editingProject._id}`, formData, {
          headers: { "x-admin-password": adminPassword }
        });
        setSuccess("Project updated successfully!");
      } else {
        await api.post("/admin/projects", formData, {
          headers: { "x-admin-password": adminPassword }
        });
        setSuccess("Project created successfully!");
      }
      fetchProjects();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tech: project.tech,
      github: project.github || "",
      live: project.live || "",
      image: project.image || "",
      featured: project.featured || false,
      order: project.order || 0
    });
    setTechInput(project.tech.join(", "));
    setShowForm(true);
  };

  const handleDeleteClick = (id: string, title: string) => {
    console.log("AdminDashboard: delete clicked", { id, title });
    setDeleteConfirm({
      isOpen: true,
      projectId: id,
      projectTitle: title
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.projectId) {
      console.error("No project ID to delete");
      return;
    }

    try {
      console.log("Deleting project:", deleteConfirm.projectId);
      const response = await api.delete(`/admin/projects/${encodeURIComponent(deleteConfirm.projectId)}`, {
        headers: { "x-admin-password": adminPassword }
      });
      console.log("Delete successful:", response);
      // Optimistically update local state so the UI feels instant
      setProjects(prev => prev.filter(project => project._id !== deleteConfirm.projectId));
      setSuccess("Project deleted successfully!");
      setDeleteConfirm({ isOpen: false, projectId: null, projectTitle: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Delete error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to delete project";
      setError(errorMessage);
      setDeleteConfirm({ isOpen: false, projectId: null, projectTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, projectId: null, projectTitle: "" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tech: [],
      github: "",
      live: "",
      image: "",
      featured: false,
      order: 0
    });
    setTechInput("");
    setEditingProject(null);
    setShowForm(false);
  };

  const addTech = () => {
    if (techInput.trim()) {
      const techArray = techInput.split(",").map(t => t.trim()).filter(t => t);
      setFormData({ ...formData, tech: [...formData.tech, ...techArray] });
      setTechInput("");
    }
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      tech: formData.tech.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-left">
          <button 
            onClick={() => navigate("/")} 
            className="btn-back"
            title="Back to Portfolio"
          >
            <FiArrowLeft />
          </button>
          <div className="admin-header-title">
            <h1>Admin Dashboard</h1>
            <p className="admin-header-subtitle">Manage your portfolio content</p>
          </div>
        </div>
        <div className="admin-header-actions">
          <button 
            onClick={toggleTheme} 
            className="btn-theme-toggle"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
          {activeTab === "projects" && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <FiPlus /> Add Project
            </button>
          )}
          <button onClick={onLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("projects");
            setShowForm(false);
          }}
        >
          <FiFolder /> Projects
        </button>
        <button
          className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("settings");
            setShowForm(false);
          }}
        >
          <FiSettings /> Settings
        </button>
        <button
          className={`admin-tab ${activeTab === "hero" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("hero");
            setShowForm(false);
          }}
        >
          <FiUser /> Hero Section
        </button>
        <button
          className={`admin-tab ${activeTab === "messages" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("messages");
            setShowForm(false);
            if (typeof window !== "undefined") {
              window.localStorage.setItem("admin_messages_last_seen", new Date().toISOString());
            }
            setUnreadMessagesCount(0);
          }}
        >
          <FiMail /> Messages
          {unreadMessagesCount > 0 && (
            <span className="notification-badge">
              {unreadMessagesCount}
            </span>
          )}
        </button>
        <button
          className={`admin-tab ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("analytics");
            setShowForm(false);
          }}
        >
          <FiTrendingUp /> Analytics
        </button>
        <button
          className={`admin-tab ${activeTab === "theme" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("theme");
            setShowForm(false);
          }}
        >
          <FiSliders /> Theme
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {activeTab === "settings" ? (
        <SettingsPanel adminPassword={adminPassword} />
      ) : activeTab === "hero" ? (
        <HeroEditor adminPassword={adminPassword} />
      ) : activeTab === "messages" ? (
        <AdminMessages adminPassword={adminPassword} />
      ) : activeTab === "analytics" ? (
        <AdminAnalytics adminPassword={adminPassword} />
      ) : activeTab === "theme" ? (
        <ThemeCustomizer adminPassword={adminPassword} />
      ) : (
        <>

      {showForm && (
        <motion.div
          className="admin-form-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={resetForm}
        >
          <motion.div
            className="admin-form"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-form-header">
              <h2>{editingProject ? "Edit Project" : "Add New Project"}</h2>
              <button onClick={resetForm} className="close-btn">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tech Stack *</label>
                <div className="tech-input-group">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="React, Node.js, MongoDB (comma separated)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                  />
                  <button type="button" onClick={addTech} className="btn-small">
                    Add
                  </button>
                </div>
                <div className="tech-tags">
                  {formData.tech.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                      <button type="button" onClick={() => removeTech(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Live URL</label>
                <input
                  type="url"
                  value={formData.live}
                  onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                />
              </div>

              <div className="form-group">
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Project Image"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Featured
                  </label>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProject ? "Update" : "Create"} Project
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <div className="projects-list">
          {projects.length === 0 ? (
            <div className="empty-state">No projects yet. Add your first project!</div>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project._id}
                className="project-card-admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="project-card-admin-content">
                  {project.image && (
                    <img src={project.image} alt={project.title} className="project-admin-image" />
                  )}
                  <div className="project-admin-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tech-tags">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    {project.featured && <span className="badge">Featured</span>}
                  </div>
                </div>
                <div className="project-card-admin-actions">
                  <button onClick={() => handleEdit(project)} className="btn-icon">
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(project._id, project.title)} 
                    className="btn-icon btn-danger"
                    title="Delete project"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
        </>
      )}

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        projectTitle={deleteConfirm.projectTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default AdminDashboard;

