import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiTrash2, FiUser, FiBriefcase, FiMessageSquare, FiCalendar, FiSend, FiX, FiCheckCircle } from "react-icons/fi";
import api from "../../services/api";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useTheme } from "../../contexts/ThemeContext";

interface Message {
  _id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  createdAt: string;
}

interface AdminMessagesProps {
  adminPassword: string;
}

const AdminMessages = ({ adminPassword }: AdminMessagesProps) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; messageId: string | null; messageName: string }>({
    isOpen: false,
    messageId: null,
    messageName: ""
  });
  const [replyModal, setReplyModal] = useState<{ isOpen: boolean; message: Message | null }>({
    isOpen: false,
    message: null
  });
  const [replyForm, setReplyForm] = useState({ subject: "", message: "" });
  const [sendingReply, setSendingReply] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/messages", {
        headers: { "x-admin-password": adminPassword }
      });
      setMessages(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (messageId: string, messageName: string) => {
    setDeleteConfirm({
      isOpen: true,
      messageId,
      messageName
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.messageId) {
      console.error("No message ID to delete");
      return;
    }

    try {
      console.log("Deleting message:", deleteConfirm.messageId);
      const response = await api.delete(`/admin/messages/${deleteConfirm.messageId}`, {
        headers: { "x-admin-password": adminPassword }
      });
      console.log("Delete successful:", response);
      fetchMessages();
      setDeleteConfirm({ isOpen: false, messageId: null, messageName: "" });
      setError(""); // Clear any previous errors
      setSuccessMessage("Message deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Delete error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to delete message";
      setError(errorMessage);
      setDeleteConfirm({ isOpen: false, messageId: null, messageName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, messageId: null, messageName: "" });
  };

  const handleReplyClick = (message: Message) => {
    setReplyModal({ isOpen: true, message });
    setReplyForm({
      subject: `Re: Your message about ${message.company || "your inquiry"}`,
      message: ""
    });
  };

  const handleReplyCancel = () => {
    setReplyModal({ isOpen: false, message: null });
    setReplyForm({ subject: "", message: "" });
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModal.message || !replyForm.subject || !replyForm.message) return;

    try {
      setSendingReply(true);
      await api.post(`/api/admin/messages/${replyModal.message._id}/reply`, {
        subject: replyForm.subject,
        message: replyForm.message
      }, {
        headers: { "x-admin-password": adminPassword }
      });
      setReplyModal({ isOpen: false, message: null });
      setReplyForm({ subject: "", message: "" });
      setError(""); // Clear any previous errors
      setSuccessMessage("Reply sent successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <motion.div
      className="admin-messages"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="admin-messages-header">
        <h2>
          <FiMail /> Contact Messages
        </h2>
        <p className="admin-description">
          View and manage all contact form submissions
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="alert alert-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
        {successMessage && (
          <motion.div
            className="alert alert-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <FiCheckCircle /> {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length === 0 ? (
        <div className="empty-state">
          <FiMail style={{ fontSize: "3rem", opacity: 0.3, marginBottom: "1rem" }} />
          <p>No messages yet.</p>
          <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((message, index) => (
            <motion.div
              key={message._id}
              className="message-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="message-card-header">
                <div className="message-card-meta">
                  <div className="message-meta-item">
                    <FiUser />
                    <strong>{message.name}</strong>
                  </div>
                  <div className="message-meta-item">
                    <FiMail />
                    <a href={`mailto:${message.email}`}>
                      {message.email}
                    </a>
                  </div>
                  {message.company && (
                    <div className="message-meta-item">
                      <FiBriefcase />
                      <span>{message.company}</span>
                    </div>
                  )}
                  <div className="message-meta-item">
                    <FiCalendar />
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleReplyClick(message)}
                    className="btn-icon"
                    title="Reply to message"
                    style={{ 
                      color: "#10b981",
                      background: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.1)",
                      border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.2)"}`,
                      padding: "0.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.15)";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.1)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <FiSend />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(message._id, message.name)}
                    className="btn-icon btn-danger"
                    title="Delete message"
                    style={{
                      color: "#ef4444",
                      background: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)"}`,
                      padding: "0.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.15)";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.1)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="message-card-body">
                <div className="message-label">
                  <FiMessageSquare />
                  <span>Message</span>
                </div>
                <p className="message-text" style={{ 
                  background: isDark ? "rgba(226, 232, 240, 0.05)" : "rgba(15, 23, 42, 0.03)",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: 0
                }}>
                  {message.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        projectTitle={`Message from ${deleteConfirm.messageName}`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="message"
      />

      {/* Reply Modal */}
      <AnimatePresence>
        {replyModal.isOpen && replyModal.message && (
          <motion.div
            className="admin-form-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReplyCancel}
          >
            <motion.div
              className="admin-form"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "600px",
                width: "100%",
                overflow: "hidden",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div className="admin-form-header" style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                padding: "1.5rem 2rem",
                margin: "-2rem -2rem 2rem -2rem",
                borderRadius: "24px 24px 0 0"
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                    Reply to {replyModal.message.name}
                  </h3>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", opacity: 0.9 }}>
                    {replyModal.message.email}
                  </p>
                </div>
                  <button
                    className="close-btn"
                    onClick={handleReplyCancel}
                    style={{ color: "white" }}
                  >
                    <FiX />
                  </button>
              </div>
              <form onSubmit={handleReplySubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto", flex: 1 }}>
                <div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={replyForm.subject}
                      onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                      required
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#6366f1";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div className="form-group" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label>Message</label>
                    <textarea
                      value={replyForm.message}
                      onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                      required
                      rows={10}
                      style={{ minHeight: "200px", resize: "vertical" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#6366f1";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(15, 23, 42, 0.08)"
                }}>
                  <button
                    type="button"
                    onClick={handleReplyCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="btn-primary"
                    style={{
                      opacity: sendingReply ? 0.6 : 1,
                      cursor: sendingReply ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {sendingReply ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{ display: "inline-block" }}
                        >
                          ⏳
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend /> Send Reply
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminMessages;

