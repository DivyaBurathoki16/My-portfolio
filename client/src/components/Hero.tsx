import { motion } from "framer-motion";
import { FiCode, FiSmartphone, FiCpu, FiTrendingUp, FiZap, FiShield, FiBarChart2, FiAward, FiGithub, FiLinkedin, FiMail, FiGlobe } from "react-icons/fi";
import useHero from "../hooks/useHero";

// Icon mapping function
const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    FiCode: <FiCode />,
    FiSmartphone: <FiSmartphone />,
    FiCpu: <FiCpu />,
    FiTrendingUp: <FiTrendingUp />,
    FiZap: <FiZap />,
    FiShield: <FiShield />,
    FiBarChart2: <FiBarChart2 />,
    FiAward: <FiAward />,
    FiGithub: <FiGithub />,
    FiLinkedin: <FiLinkedin />,
    FiMail: <FiMail />,
    FiGlobe: <FiGlobe />
  };
  return iconMap[iconName] || <FiCode />;
};

const Hero = () => {
  const { heroSettings, loading } = useHero();

  if (loading) {
    return (
      <section id="home" className="hero">
        <p className="status">Loading hero content…</p>
      </section>
    );
  }


  return (
    <section id="home" className="hero">
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-text__top">
          <p className="eyebrow">{heroSettings.eyebrow}</p>
          <h1>{heroSettings.heading}</h1>
          <p className="subhead">{heroSettings.subhead}</p>

          {/* Horizontal Layout: Who I Am + Skills Grid */}
          <div className="horizontal-section">
            {/* Who I Am Section */}
            <div className="who-i-am">
              <h3>Who I Am</h3>
              <p>{heroSettings.bio}</p>
            </div>

            {/* Skills Grid */}
            <div className="skills-grid">
              {heroSettings.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="skill-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="skill-icon">{getIcon(skill.icon)}</div>
                  <span>{skill.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="hero-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ scale: 1.02, y: -5 }}
      >
        <motion.div
          className="hero-card__badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <FiAward style={{ marginRight: "0.5rem", display: "inline-flex" }} />
          {heroSettings.badgeText}
        </motion.div>

        <motion.div
          className="hero-card__header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>{heroSettings.achievementTitle}</h3>
          <div className="hero-card__highlight">
            <FiBarChart2 />
            <span>{heroSettings.achievementHighlight}</span>
          </div>
        </motion.div>

        <motion.p
          className="hero-card__description"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {heroSettings.achievementDescription}
        </motion.p>

        <motion.div
          className="hero-card__features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {heroSettings.features.map((item, index) => (
            <motion.div
              key={index}
              className="hero-card__feature-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <span className="feature-icon">{getIcon(item.icon)}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="hero-card__tech-stack"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h4>Tech Stack</h4>
          <div className="tech-tags">
            {heroSettings.techStack.map((tech, index) => (
              <motion.span
                key={index}
                className="tech-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + index * 0.05 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(99, 102, 241, 0.3)" }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-card__stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          {heroSettings.stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="hero-card__quick-links"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h4>Connect</h4>
          <div className="quick-links-grid">
            {heroSettings.quickLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="quick-link-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                whileHover={{ x: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="quick-link-icon">{getIcon(link.icon)}</span>
                <span>{link.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <div className="hero-text__bottom">
        {/* CTA Buttons */}
        <motion.div
          className="cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="#projects"
            className="primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {heroSettings.primaryButtonText}
          </motion.a>
          <motion.a
            href="#contact"
            className="secondary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {heroSettings.secondaryButtonText}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
