import { motion } from "framer-motion";
import { FiHeart, FiCode } from "react-icons/fi";

const Footer = () => (
  <motion.footer
    className="footer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      © {new Date().getFullYear()} Divya. Built with{" "}
      <motion.span
        style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
        whileHover={{ scale: 1.2 }}
      >
        <FiHeart style={{ color: "#ef4444" }} />
      </motion.span>{" "}
      using the{" "}
      <motion.span
        style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}
        whileHover={{ scale: 1.05 }}
      >
        <FiCode /> MERN stack
      </motion.span>
      .
    </motion.p>
    <motion.a
      href="mailto:divyaburathoki16@gmail.com"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      hello@divyadev.com
    </motion.a>
  </motion.footer>
);

export default Footer;

