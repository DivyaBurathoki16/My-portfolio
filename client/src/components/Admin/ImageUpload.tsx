import { useState, useRef, type DragEvent } from "react";
import { FiX, FiImage } from "react-icons/fi";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUpload = ({ value, onChange, label = "Image" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Read file as base64 data URL
      const dataUrl = await readFileAsDataURL(file);
      onChange(dataUrl);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to read image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  return (
    <div className="image-upload-container">
      <label className="form-group-label">{label}</label>
      
      {value ? (
        <div className="image-preview">
          <img src={value} alt="Preview" />
          <button type="button" onClick={handleRemove} className="image-remove-btn">
            <FiX />
          </button>
        </div>
      ) : (
        <div
          className={`image-upload-area ${dragActive ? "drag-active" : ""} ${uploading ? "uploading" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: "none" }}
            disabled={uploading}
          />
          {uploading ? (
            <div className="upload-status">
              <div className="upload-spinner"></div>
              <p>Processing image...</p>
            </div>
          ) : (
            <div className="upload-placeholder">
              <FiImage size={48} />
              <p>Drag & drop an image here, or click to select</p>
              <span className="upload-hint">Supports: JPG, PNG, GIF, WebP (Max 10MB)</span>
              <span className="upload-hint" style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                Image is stored as base64 data
              </span>
            </div>
          )}
        </div>
      )}

      {error && <div className="upload-error">{error}</div>}

      {/* Manual URL input as fallback */}
      <div className="image-url-fallback" style={{ marginTop: "1rem" }}>
        <label>Or enter image URL manually:</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg or paste base64 data URL"
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </div>
    </div>
  );
};

export default ImageUpload;

