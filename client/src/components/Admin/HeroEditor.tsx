import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiX } from "react-icons/fi";
import api from "../../services/api";
import type { HeroSettings } from "../../hooks/useHero";

interface HeroEditorProps {
  adminPassword: string;
}

const HeroEditor = ({ adminPassword }: HeroEditorProps) => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    eyebrow: "",
    heading: "",
    subhead: "",
    bio: "",
    skills: [],
    badgeText: "",
    achievementTitle: "",
    achievementHighlight: "",
    achievementDescription: "",
    features: [],
    techStack: [],
    stats: [],
    quickLinks: [],
    primaryButtonText: "",
    secondaryButtonText: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Input states for adding new items
  const [newSkill, setNewSkill] = useState({ icon: "FiCode", label: "" });
  const [newFeature, setNewFeature] = useState({ icon: "FiZap", text: "" });
  const [newStat, setNewStat] = useState({ number: "", label: "" });
  const [newQuickLink, setNewQuickLink] = useState({ icon: "FiGithub", label: "", href: "#" });
  const [newTech, setNewTech] = useState("");

  const iconOptions = [
    "FiCode", "FiSmartphone", "FiCpu", "FiTrendingUp", "FiZap", "FiShield",
    "FiBarChart2", "FiAward", "FiGithub", "FiLinkedin", "FiMail", "FiGlobe"
  ];

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/hero");
      setHeroSettings(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch hero settings");
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
      await api.put("/api/admin/hero", heroSettings, {
        headers: { "x-admin-password": adminPassword }
      });
      setSuccess("Hero section updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update hero section");
    } finally {
      setSaving(false);
    }
  };

  // Skills management
  const addSkill = () => {
    if (newSkill.label.trim()) {
      setHeroSettings({
        ...heroSettings,
        skills: [...heroSettings.skills, { ...newSkill }]
      });
      setNewSkill({ icon: "FiCode", label: "" });
    }
  };

  const removeSkill = (index: number) => {
    setHeroSettings({
      ...heroSettings,
      skills: heroSettings.skills.filter((_, i) => i !== index)
    });
  };

  // Features management
  const addFeature = () => {
    if (newFeature.text.trim()) {
      setHeroSettings({
        ...heroSettings,
        features: [...heroSettings.features, { ...newFeature }]
      });
      setNewFeature({ icon: "FiZap", text: "" });
    }
  };

  const removeFeature = (index: number) => {
    setHeroSettings({
      ...heroSettings,
      features: heroSettings.features.filter((_, i) => i !== index)
    });
  };

  // Stats management
  const addStat = () => {
    if (newStat.number.trim() && newStat.label.trim()) {
      setHeroSettings({
        ...heroSettings,
        stats: [...heroSettings.stats, { ...newStat }]
      });
      setNewStat({ number: "", label: "" });
    }
  };

  const removeStat = (index: number) => {
    setHeroSettings({
      ...heroSettings,
      stats: heroSettings.stats.filter((_, i) => i !== index)
    });
  };

  // Quick links management
  const addQuickLink = () => {
    if (newQuickLink.label.trim()) {
      setHeroSettings({
        ...heroSettings,
        quickLinks: [...heroSettings.quickLinks, { ...newQuickLink }]
      });
      setNewQuickLink({ icon: "FiGithub", label: "", href: "#" });
    }
  };

  const removeQuickLink = (index: number) => {
    setHeroSettings({
      ...heroSettings,
      quickLinks: heroSettings.quickLinks.filter((_, i) => i !== index)
    });
  };

  // Tech stack management
  const addTech = () => {
    if (newTech.trim()) {
      setHeroSettings({
        ...heroSettings,
        techStack: [...heroSettings.techStack, newTech.trim()]
      });
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    setHeroSettings({
      ...heroSettings,
      techStack: heroSettings.techStack.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="loading">Loading hero settings...</div>;
  }

  return (
    <motion.div
      className="settings-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Hero Section Editor</h2>
      <p className="settings-description">Edit all content displayed in the hero section</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Top Section */}
        <div className="form-section">
          <h3>Top Section</h3>
          
          <div className="form-group">
            <label>Eyebrow Text</label>
            <input
              type="text"
              value={heroSettings.eyebrow}
              onChange={(e) => setHeroSettings({ ...heroSettings, eyebrow: e.target.value })}
              placeholder="Full-Stack MERN Developer"
            />
          </div>

          <div className="form-group">
            <label>Main Heading</label>
            <textarea
              value={heroSettings.heading}
              onChange={(e) => setHeroSettings({ ...heroSettings, heading: e.target.value })}
              placeholder="I design operations-ready web apps..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Subhead</label>
            <textarea
              value={heroSettings.subhead}
              onChange={(e) => setHeroSettings({ ...heroSettings, subhead: e.target.value })}
              placeholder="End-to-end product thinker..."
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Bio / Who I Am</label>
            <textarea
              value={heroSettings.bio}
              onChange={(e) => setHeroSettings({ ...heroSettings, bio: e.target.value })}
              placeholder="I'm a passionate full-stack developer..."
              rows={4}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="form-section">
          <h3>Skills</h3>
          <div className="form-group">
            <label>Add Skill</label>
            <div className="input-group">
              <select
                value={newSkill.icon}
                onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                value={newSkill.label}
                onChange={(e) => setNewSkill({ ...newSkill, label: e.target.value })}
                placeholder="MERN Stack"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <button type="button" onClick={addSkill} className="btn-small">
                <FiPlus /> Add
              </button>
            </div>
            <div className="tags-list">
              {heroSettings.skills.map((skill, index) => (
                <span key={index} className="tag">
                  {skill.label} ({skill.icon})
                  <button type="button" onClick={() => removeSkill(index)} className="tag-remove">
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Card */}
        <div className="form-section">
          <h3>Achievement Card</h3>
          
          <div className="form-group">
            <label>Badge Text</label>
            <input
              type="text"
              value={heroSettings.badgeText}
              onChange={(e) => setHeroSettings({ ...heroSettings, badgeText: e.target.value })}
              placeholder="Available for freelance • 2025"
            />
          </div>

          <div className="form-group">
            <label>Achievement Title</label>
            <input
              type="text"
              value={heroSettings.achievementTitle}
              onChange={(e) => setHeroSettings({ ...heroSettings, achievementTitle: e.target.value })}
              placeholder="Latest Achievement"
            />
          </div>

          <div className="form-group">
            <label>Achievement Highlight</label>
            <input
              type="text"
              value={heroSettings.achievementHighlight}
              onChange={(e) => setHeroSettings({ ...heroSettings, achievementHighlight: e.target.value })}
              placeholder="37% Improvement"
            />
          </div>

          <div className="form-group">
            <label>Achievement Description</label>
            <textarea
              value={heroSettings.achievementDescription}
              onChange={(e) => setHeroSettings({ ...heroSettings, achievementDescription: e.target.value })}
              placeholder="Rebuilt a tour-operations platform..."
              rows={3}
            />
          </div>
        </div>

        {/* Features */}
        <div className="form-section">
          <h3>Features</h3>
          <div className="form-group">
            <label>Add Feature</label>
            <div className="input-group">
              <select
                value={newFeature.icon}
                onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                value={newFeature.text}
                onChange={(e) => setNewFeature({ ...newFeature, text: e.target.value })}
                placeholder="Realtime messaging"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <button type="button" onClick={addFeature} className="btn-small">
                <FiPlus /> Add
              </button>
            </div>
            <div className="tags-list">
              {heroSettings.features.map((feature, index) => (
                <span key={index} className="tag">
                  {feature.text} ({feature.icon})
                  <button type="button" onClick={() => removeFeature(index)} className="tag-remove">
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="form-section">
          <h3>Tech Stack</h3>
          <div className="form-group">
            <label>Add Technology</label>
            <div className="input-group">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="React, Node.js, MongoDB"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
              />
              <button type="button" onClick={addTech} className="btn-small">
                <FiPlus /> Add
              </button>
            </div>
            <div className="tags-list">
              {heroSettings.techStack.map((tech, index) => (
                <span key={index} className="tag">
                  {tech}
                  <button type="button" onClick={() => removeTech(index)} className="tag-remove">
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="form-section">
          <h3>Statistics</h3>
          <div className="form-group">
            <label>Add Stat</label>
            <div className="input-group">
              <input
                type="text"
                value={newStat.number}
                onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
                placeholder="37%"
                style={{ width: "100px" }}
              />
              <input
                type="text"
                value={newStat.label}
                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                placeholder="SLA Reduction"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addStat())}
              />
              <button type="button" onClick={addStat} className="btn-small">
                <FiPlus /> Add
              </button>
            </div>
            <div className="tags-list">
              {heroSettings.stats.map((stat, index) => (
                <span key={index} className="tag">
                  {stat.number} - {stat.label}
                  <button type="button" onClick={() => removeStat(index)} className="tag-remove">
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="form-section">
          <h3>Quick Links</h3>
          <div className="form-group">
            <label>Add Quick Link</label>
            <div className="input-group">
              <select
                value={newQuickLink.icon}
                onChange={(e) => setNewQuickLink({ ...newQuickLink, icon: e.target.value })}
                style={{ width: "120px" }}
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                value={newQuickLink.label}
                onChange={(e) => setNewQuickLink({ ...newQuickLink, label: e.target.value })}
                placeholder="GitHub"
              />
              <input
                type="text"
                value={newQuickLink.href}
                onChange={(e) => setNewQuickLink({ ...newQuickLink, href: e.target.value })}
                placeholder="# or URL"
              />
              <button type="button" onClick={addQuickLink} className="btn-small">
                <FiPlus /> Add
              </button>
            </div>
            <div className="tags-list">
              {heroSettings.quickLinks.map((link, index) => (
                <span key={index} className="tag">
                  {link.label} ({link.icon}) - {link.href}
                  <button type="button" onClick={() => removeQuickLink(index)} className="tag-remove">
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="form-section">
          <h3>Call-to-Action Buttons</h3>
          
          <div className="form-group">
            <label>Primary Button Text</label>
            <input
              type="text"
              value={heroSettings.primaryButtonText}
              onChange={(e) => setHeroSettings({ ...heroSettings, primaryButtonText: e.target.value })}
              placeholder="View Projects"
            />
          </div>

          <div className="form-group">
            <label>Secondary Button Text</label>
            <input
              type="text"
              value={heroSettings.secondaryButtonText}
              onChange={(e) => setHeroSettings({ ...heroSettings, secondaryButtonText: e.target.value })}
              placeholder="Contact Me"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Hero Settings"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default HeroEditor;

