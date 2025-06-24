import { useState, useEffect, useMemo } from 'react';
import styles from './HeroStyles.module.css';
import heroImg from '../../assets/hero-image.png';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';

import githubLight from '../../assets/github-light.svg';
import githubDark from '../../assets/github-dark.svg';
import linkedinLight from '../../assets/linkedin-light.svg';
import linkedinDark from '../../assets/linkedin-dark.svg';
import resume from '../../assets/resume.pdf';
import { useTheme } from '../../common/ThemeContext';

function Hero() {
  const { theme, toggleTheme } = useTheme();
  const [animated, setAnimated] = useState(false);
  const [typedText, setTypedText] = useState('');
  const roles = useMemo(
    () => ['Frontend Developer', 'FullStack Developer', 'Software Developer', 'JavaScript Developer'],
    []
  );
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  const themeIcon = theme === 'light' ? sun : moon;

  const githubIcon = theme === 'light' ? githubLight : githubDark;
  const linkedinIcon = theme === 'light' ? linkedinLight : linkedinDark;
   
  useEffect(() => {
  setAnimated(true);

  let charIndex = 1; // Start from 1 to show the first character immediately
  const currentRole = roles[currentRoleIndex];
  setTypedText(''); // Reset before typing

  const typeInterval = setInterval(() => {
    setTypedText(currentRole.substring(0, charIndex));
    charIndex++;
    if (charIndex > currentRole.length) {
      clearInterval(typeInterval);
      setTimeout(() => {
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      }, 2000);
    }
  }, 100);

  return () => clearInterval(typeInterval);
}, [currentRoleIndex, roles]);

  return (
    <section id="hero" className={`${styles.container} ${animated ? styles.animate : ''}`}>
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <h1 className={styles.name}>
            <span className={styles.hello}>Hello I&apos;m</span><br></br>
            <span className={styles.Name}>RISHE</span>
          </h1>
          
          <div className={styles.roleContainer}>
            <h2 className={styles.role}>
              <span className={styles.typedText}>{typedText}</span>
              <span className={styles.cursor}>|</span>
            </h2>
          </div>

          <p className={styles.description}>
            I love designing beautiful, user-friendly websites. I enjoy turning ideas into clean, functional designs that look great on any device. Let’s create something amazing together!
          </p>

          <div className={styles.buttons}>
            <a href={resume} download className={styles.resumeLink}>
              <button className={styles.resumeBtn}>
                Download Resume
                <span className={styles.downloadIcon}>↓</span>
              </button>
            </a>
            <div className={styles.socialLinks}>
              
              <a href="https://github.com/RISHE-AI" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <img src={githubIcon} alt="GitHub" className={styles.socialIcon} />
              </a>
              <a href="https://www.linkedin.com/in/rishe-aiml/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <img src={linkedinIcon} alt="LinkedIn" className={styles.socialIcon} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <img
            src={heroImg}
            className={styles.profileImage}
            alt="Harris Johnsen"
          />
          <button className={styles.themeToggle} onClick={toggleTheme}>
            <img src={themeIcon} alt="Toggle theme" />
          </button>
          <div className={styles.decoration}></div>
        </div>
      </div>
    </section>

  );
}

export default Hero;