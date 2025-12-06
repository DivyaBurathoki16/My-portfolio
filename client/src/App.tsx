import { useMemo } from "react";
import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import Projects from "./components/Projects.tsx";
import Contact from "./components/Contact.tsx";
import Footer from "./components/Footer.tsx";

function App() {
  const scrollSections = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "projects", label: "Projects" },
      { id: "contact", label: "Contact" }
    ],
    []
  );

  return (
    <div className="app-shell">
      <Navbar sections={scrollSections} />
      <main>
        <Hero />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;

