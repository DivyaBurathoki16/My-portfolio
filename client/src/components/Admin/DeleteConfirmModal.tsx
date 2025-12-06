import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  projectTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "project" | "message"; // Add type prop, default to "project" for backward compatibility
}

const DeleteConfirmModal = ({ isOpen, projectTitle, onConfirm, onCancel, type = "project" }: DeleteConfirmModalProps) => {
  const handleConfirm = () => {
    console.log("DeleteConfirmModal: Confirm button clicked");
    onConfirm();
  };

  // Dynamic text based on type
  const title = type === "message" ? "Delete Message" : "Delete Project";
  const confirmText = type === "message" ? "Are you sure you want to delete this message?" : "Are you sure you want to delete this project?";
  const buttonText = type === "message" ? "Delete Message" : "Delete Project";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="admin-form-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="delete-confirm-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-header">
              <div className="delete-confirm-icon">
                <FiAlertTriangle />
              </div>
              <h3>{title}</h3>
              <button onClick={onCancel} className="close-btn">
                <FiX />
              </button>
            </div>
            <div className="delete-confirm-content">
              <p>{confirmText}</p>
              <p className="delete-project-title">"{projectTitle}"</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="delete-confirm-actions">
              <button type="button" onClick={onCancel} className="btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleConfirm} className="btn-danger">
                {buttonText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;

