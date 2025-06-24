import { NavLink } from 'react-router-dom';
import styles from './NavbarStyles.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>My Portfolio</div>
      <ul className={styles.navLinks}>
        <li><NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Home</NavLink></li>
        <li><NavLink to="/resume" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Resume</NavLink></li>
        <li><NavLink to="/skills" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Skills</NavLink></li>
        <li><NavLink to="/projects" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Projects</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Contact Us</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
