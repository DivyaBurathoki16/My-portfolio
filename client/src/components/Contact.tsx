import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import api from "../services/api.ts";

type Status = {
  state: "idle" | "loading" | "success" | "error";
  message: string;
};

const initialStatus: Status = { state: "idle", message: "" };

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<Status>(initialStatus);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    setStatus({ state: "loading", message: "Sending…" });
    try {
      const { data } = await api.post("/contact", form);
      setStatus({ state: "success", message: data.message ?? "Message sent!" });
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (error: unknown) {
      console.error(error);
      setStatus({ state: "error", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <section id="contact" className="contact">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="eyebrow">Let's collaborate</p>
        <h2>Tell me about your roadmap. I'll respond within 24 hours.</h2>
      </motion.div>
      <motion.form
        className="contact-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.label
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Name
          <input name="name" required placeholder="Jane Doe" value={form.name} onChange={handleChange} />
        </motion.label>
        <motion.label
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="jane@email.com"
            value={form.email}
            onChange={handleChange}
          />
        </motion.label>
        <motion.label
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Company / Team
          <input name="company" placeholder="LPO Holidays" value={form.company} onChange={handleChange} />
        </motion.label>
        <motion.label
          className="full-width"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          Message
          <textarea
            name="message"
            required
            placeholder="Share the challenge, deadline, and tech constraints…"
            value={form.message}
            onChange={handleChange}
          />
        </motion.label>
        <motion.button
          type="submit"
          disabled={status.state === "loading"}
          whileHover={{ scale: status.state === "loading" ? 1 : 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          {status.state === "loading" ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: "inline-block" }}
              >
                ⏳
              </motion.span>{" "}
              Sending…
            </>
          ) : (
            <>
              <FiSend style={{ marginRight: "0.5rem" }} /> Send message
            </>
          )}
        </motion.button>
        {status.state !== "idle" && (
          <motion.p
            className={`status ${status.state === "error" ? "error" : "success"}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {status.state === "error" ? <FiAlertCircle style={{ marginRight: "0.5rem" }} /> : <FiCheckCircle style={{ marginRight: "0.5rem" }} />}
            {status.message}
          </motion.p>
        )}
      </motion.form>
    </section>
  );
};

export default Contact;

