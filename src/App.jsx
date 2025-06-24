import { Routes, Route } from 'react-router-dom';
import './App.css';
import Contact from './sections/Contact/Contact';

import Hero from './sections/Hero/Hero';
import Projects from './sections/Projects/Projects';
import Skills from './sections/Skills/Skills';
import Navbar from './common/Navbar';
import Resume from './sections/Resume/Resume';

function App() {
  
 

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Skills />
            <Projects />
            <Contact />
          </>
        } />
        <Route path="/resume" element={<Resume />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    
    </>
  );
}

export default App;
