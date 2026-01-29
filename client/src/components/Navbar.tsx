import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiMoon, FiSun, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext.tsx";
import useSettings from "../hooks/useSettings.ts";

type Section = {
  id: string;
  label: string;
};

type NavbarProps = {
  sections: Section[];
};

const Navbar = ({ sections }: NavbarProps) => {
  const [active, setActive] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme, theme } = useTheme();
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const listener = () => {
      const scrollPosition = window.scrollY + 200;
      const current = sections.find((section) => {
        const el = document.getElementById(section.id);
        if (!el) return false;
        return scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight;
      });
      if (current) {
        setActive(current.id);
      }
    };

    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, [sections]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.navbar') && !target.closest('.mobile-nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className="navbar"
      data-nav-style={theme?.navStyle || "transparent"}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="logo"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        Divya Burathoki
      </motion.div>
      <nav className="desktop-nav">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            className={active === section.id ? "active" : ""}
            onClick={() => scrollTo(section.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {section.label}
            {active === section.id && (
              <motion.div
                className="active-indicator"
                layoutId="activeSection"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {sections.map((section) => (
              <motion.button
                key={section.id}
                className={active === section.id ? "active" : ""}
                onClick={() => scrollTo(section.id)}
                whileTap={{ scale: 0.95 }}
              >
                {section.label}
                {active === section.id && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeSectionMobile"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
      <div className="navbar-actions">
        {location.pathname === "/" && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/admin" className="admin-link" title="Admin Panel">
              <FiSettings size={20} />
            </Link>
          </motion.div>
        )}
        <motion.button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </motion.div>
        </motion.button>
        <div className="social">
          {settings.github && (
            <motion.a
              href={settings.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiGithub size={20} />
            </motion.a>
          )}
          {settings.linkedin && (
            <motion.a
              href={settings.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiLinkedin size={20} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

