import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import useProjects, { type Project as ProjectType } from "../hooks/useProjects.ts";
import ProjectModal from "./ProjectModal.tsx";

// Extended Project type that includes both id and _id for compatibility
interface Project extends ProjectType {
  _id?: string;
}

const Projects = () => {
  const { projects, loading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <section id="projects" className="projects">
        <div className="section-header">
          <p className="eyebrow">Highlighted work</p>
          <h2>Operations-driven builds that scale gracefully.</h2>
          <p>Each project leans on the MERN stack with a focus on realtime collaboration and business visibility.</p>
        </div>

        {loading && <p className="status">Loading projects…</p>}
        {error && <p className="status error">{error}</p>}

        <div className="project-grid">
          {projects.map((project, index) => (
            <motion.article
              key={project.id || project._id || `project-${index}`}
              className="project-card"
              onClick={() => handleProjectClick(project)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="project-media">
                <motion.img
                  src={project.image || "https://via.placeholder.com/400x300"}
                  alt={project.title}
                  loading="lazy"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="project-body">
                <div>
                  <motion.p
                    className="eyebrow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {project.tech?.join(" • ") || "Tech Stack"}
                  </motion.p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="project-links">
                  {project.live && (
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live demo <FiArrowUpRight />
                    </motion.a>
                  )}
                  {project.github && (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      GitHub <FiArrowUpRight />
                    </motion.a>
                  )}
                  {!project.live && !project.github && (
                    <span className="project-link-placeholder">Click to view details</span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Projects;

