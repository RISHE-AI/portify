import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import ExperienceEducation from './components/ExperienceEducation';
import AchievementsCertifications from './components/AchievementsCertifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GalaxyStars from './components/GalaxyStars';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { api } from './services/api';
import { initialPortfolioData } from './services/initialData';
import './App.css';

function PublicPortfolio() {
  const [data, setData] = useState(initialPortfolioData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await api.getPortfolio();
      setData(res);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GalaxyStars />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero profile={data?.profile} />
        <ExperienceEducation experience={data?.experience} education={data?.education} />
        <Skills skills={data?.skills} />
        <Projects projects={data?.projects} />
        <AchievementsCertifications achievements={data?.achievements} certifications={data?.certifications} />
        <Contact profile={data?.profile} />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <>
      <GalaxyStars />
      <Routes>
        <Route path="/" element={<PublicPortfolio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </>
  );
}

export default App;
