import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSave, FiRefreshCw, FiDownload, FiUpload, FiSliders } from "react-icons/fi";
import api from "../../services/api";
import { useTheme, type ThemeSettings } from "../../contexts/ThemeContext";

interface ThemeCustomizerProps {
  adminPassword: string;
}

const FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Roboto",
  "Montserrat",
  "Playfair Display",
  "Lato",
  "Open Sans",
  "Raleway"
];

const PRESET_THEMES: Record<string, Partial<ThemeSettings>> = {
  "Modern Blue": {
    primaryColor: "#0ea5e9",
    secondaryColor: "#3b82f6",
    accentColor: "#6366f1",
    heroGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  "Sunset Orange": {
    primaryColor: "#f97316",
    secondaryColor: "#fb923c",
    accentColor: "#f59e0b",
    heroGradient: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)"
  },
  "Cyberpunk Neon": {
    primaryColor: "#00f5ff",
    secondaryColor: "#ff00ff",
    accentColor: "#00ff88",
    heroGradient: "linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)"
  },
  "Minimal White": {
    primaryColor: "#000000",
    secondaryColor: "#666666",
    accentColor: "#333333",
    backgroundColor: "#ffffff",
    cardBackground: "#f9fafb",
    heroGradient: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"
  },
  "Dark Hacker": {
    primaryColor: "#00ff41",
    secondaryColor: "#00d4ff",
    accentColor: "#00ff88",
    backgroundColor: "#0a0a0a",
    textColor: "#00ff41",
    cardBackground: "#1a1a1a",
    heroGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
    currentMode: "dark"
  }
};

const ThemeCustomizer = ({ adminPassword }: ThemeCustomizerProps) => {
  const { theme, refreshTheme, updateTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState<Partial<ThemeSettings>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (theme) {
      setLocalTheme(theme);
    }
  }, [theme]);

  const handleChange = (key: keyof ThemeSettings, value: any) => {
    setLocalTheme((prev) => ({ ...prev, [key]: value }));
    // Update preview immediately
    updateTheme({ [key]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.put(
        "/api/theme",
        localTheme,
        {
          headers: { "x-admin-password": adminPassword }
        }
      );

      setSuccess("Theme saved successfully! Changes are now live.");
      await refreshTheme();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save theme");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (presetName: string) => {
    const preset = PRESET_THEMES[presetName];
    if (preset) {
      const newTheme = { ...localTheme, ...preset };
      setLocalTheme(newTheme);
      updateTheme(newTheme);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(localTheme, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "theme-settings.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setLocalTheme((prev) => ({ ...prev, ...imported }));
        updateTheme(imported);
        setSuccess("Theme imported successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Invalid theme file");
      }
    };
    reader.readAsText(file);
  };

  if (!theme) {
    return <div className="loading">Loading theme settings...</div>;
  }

  return (
    <motion.div
      className="theme-customizer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="theme-customizer-header">
        <h2>
          <FiSliders /> Theme Customizer
        </h2>
        <p className="admin-description">
          Customize your portfolio's appearance. Changes update in real-time.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Preset Themes */}
      <div className="theme-section">
        <h3>Preset Themes</h3>
        <div className="preset-themes-grid">
          {Object.keys(PRESET_THEMES).map((presetName) => (
            <button
              key={presetName}
              className="preset-theme-btn"
              onClick={() => handlePreset(presetName)}
            >
              {presetName}
            </button>
          ))}
        </div>
      </div>

      <div className="theme-customizer-grid">
        {/* Left Column - Controls */}
        <div className="theme-controls">
          {/* Color System */}
          <div className="theme-section">
            <h3>Color System</h3>
            <div className="form-group">
              <label>
                Primary Color
                <input
                  type="color"
                  value={localTheme.primaryColor || theme.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Secondary Color
                <input
                  type="color"
                  value={localTheme.secondaryColor || theme.secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Background Color
                <input
                  type="color"
                  value={localTheme.backgroundColor || theme.backgroundColor}
                  onChange={(e) => handleChange("backgroundColor", e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Text Color
                <input
                  type="color"
                  value={localTheme.textColor || theme.textColor}
                  onChange={(e) => handleChange("textColor", e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Accent Color
                <input
                  type="color"
                  value={localTheme.accentColor || theme.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Card Background
                <input
                  type="color"
                  value={localTheme.cardBackground || theme.cardBackground}
                  onChange={(e) => handleChange("cardBackground", e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Typography */}
          <div className="theme-section">
            <h3>Typography</h3>
            <div className="form-group">
              <label>
                Primary Font
                <select
                  value={localTheme.primaryFont || theme.primaryFont}
                  onChange={(e) => handleChange("primaryFont", e.target.value)}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Heading Font
                <select
                  value={localTheme.headingFont || theme.headingFont}
                  onChange={(e) => handleChange("headingFont", e.target.value)}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Body Font
                <select
                  value={localTheme.bodyFont || theme.bodyFont}
                  onChange={(e) => handleChange("bodyFont", e.target.value)}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Font Scale: {(localTheme.fontScale || theme.fontScale).toFixed(1)}x
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.1"
                  value={localTheme.fontScale || theme.fontScale}
                  onChange={(e) => handleChange("fontScale", parseFloat(e.target.value))}
                />
              </label>
            </div>
          </div>

          {/* Layout */}
          <div className="theme-section">
            <h3>Layout</h3>
            <div className="form-group">
              <label>
                Border Radius: {localTheme.borderRadius || theme.borderRadius}
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={parseInt(localTheme.borderRadius || theme.borderRadius) || 12}
                  onChange={(e) => handleChange("borderRadius", `${e.target.value}px`)}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Card Style
                <select
                  value={localTheme.cardStyle || theme.cardStyle}
                  onChange={(e) => handleChange("cardStyle", e.target.value as "glass" | "elevated" | "minimal")}
                >
                  <option value="glass">Glass</option>
                  <option value="elevated">Elevated</option>
                  <option value="minimal">Minimal</option>
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Nav Style
                <select
                  value={localTheme.navStyle || theme.navStyle}
                  onChange={(e) => handleChange("navStyle", e.target.value as "transparent" | "solid")}
                >
                  <option value="transparent">Transparent</option>
                  <option value="solid">Solid</option>
                </select>
              </label>
            </div>
          </div>

          {/* Hero Section */}
          <div className="theme-section">
            <h3>Hero Section</h3>
            <div className="form-group">
              <label>
                Headline Color
                <input
                  type="color"
                  value={localTheme.heroHeadlineColor || theme.heroHeadlineColor}
                  onChange={(e) => handleChange("heroHeadlineColor", e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Subtitle Color
                <input
                  type="color"
                  value={localTheme.heroSubtitleColor || theme.heroSubtitleColor}
                  onChange={(e) => handleChange("heroSubtitleColor", e.target.value)}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Background Type
                <select
                  value={localTheme.heroBackgroundType || theme.heroBackgroundType}
                  onChange={(e) => handleChange("heroBackgroundType", e.target.value as "gradient" | "image" | "solid")}
                >
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                  <option value="solid">Solid</option>
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Gradient (CSS)
                <input
                  type="text"
                  value={localTheme.heroGradient || theme.heroGradient}
                  onChange={(e) => handleChange("heroGradient", e.target.value)}
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Hero Image URL
                <input
                  type="url"
                  value={localTheme.heroImageURL || theme.heroImageURL}
                  onChange={(e) => handleChange("heroImageURL", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="theme-actions">
            <button
              onClick={handleSave}
              className="btn-primary"
              disabled={loading}
            >
              <FiSave /> {loading ? "Saving..." : "Save Theme"}
            </button>
            <button
              onClick={refreshTheme}
              className="btn-secondary"
            >
              <FiRefreshCw /> Reset to Saved
            </button>
            <button
              onClick={handleExport}
              className="btn-secondary"
            >
              <FiDownload /> Export Theme
            </button>
            <label className="btn-secondary" style={{ cursor: "pointer" }}>
              <FiUpload /> Import Theme
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="theme-preview">
          <h3>Live Preview</h3>
          <div className="preview-card">
            <div className="preview-header">
              <h4 style={{ color: "var(--hero-headline-color)", fontFamily: "var(--heading-font)" }}>
                Sample Heading
              </h4>
              <p style={{ color: "var(--hero-subtitle-color)", fontFamily: "var(--body-font)" }}>
                This is a preview of how your theme will look
              </p>
            </div>
            <div className="preview-body" style={{ background: "var(--card-background)", borderRadius: "var(--border-radius)" }}>
              <div className="preview-button-group">
                <button
                  className="preview-btn-primary"
                  style={{
                    background: "var(--primary-color)",
                    borderRadius: "var(--border-radius)"
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="preview-btn-secondary"
                  style={{
                    borderColor: "var(--accent-color)",
                    color: "var(--accent-color)",
                    borderRadius: "var(--border-radius)"
                  }}
                >
                  Secondary Button
                </button>
              </div>
              <div className="preview-tags">
                <span
                  style={{
                    background: "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                    color: "var(--accent-color)",
                    borderRadius: "var(--border-radius)"
                  }}
                >
                  Tag 1
                </span>
                <span
                  style={{
                    background: "color-mix(in srgb, var(--secondary-color) 15%, transparent)",
                    color: "var(--secondary-color)",
                    borderRadius: "var(--border-radius)"
                  }}
                >
                  Tag 2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeCustomizer;

