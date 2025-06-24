import styles from './ResumeStyles.module.css';

const Resume = () => {
  return (
    <section className={styles.resumeSection} id="resume">
      <h2 className={styles.title}>MY RESUME</h2>
      <div className={styles.resumeContainer}>
        <div className={styles.column}>
          <h3 className={styles.subheading}>EDUCATION</h3>
          <ul>
            <li>
              <strong>12th Grade</strong><br />
              Sri Vidhya Mandir MHSS – 88%
            </li>
            <li>
              <strong>B.Tech in AIML</strong><br />
              Kongu Engineering College (2nd Year)<br />
              CGPA: 8.20
            </li>
          </ul>

          <h3 className={styles.subheading}>SKILLS</h3>
          <ul>
            <li>Java, Python, HTML, CSS, JavaScript</li>
            <li>Git & GitHub</li>
          </ul>

          <h3 className={styles.subheading}>CERTIFICATIONS</h3>
          <ul>
            <li>MongoDB Associate Developer</li>
            <li>Google Cloud Computing – NPTEL</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3 className={styles.subheading}>PROJECTS</h3>
          <ul>
            <li>
              <strong>COVID-19 Prediction</strong> – ML model for spread prediction using Scikit-learn.
            </li>
            <li>
              <strong>Object Detection for Blind People</strong> – Real-time YOLO with audio feedback.
            </li>
            <li>
              <strong>Travel & Tourism Website (MERN Stack)</strong> – Blogs, chatbots, recommendations.
            </li>
          </ul>

          <h3 className={styles.subheading}>ACHIEVEMENTS</h3>
          <ul>
            <li>1st – Paper Presentation @ PSG College (PRODOTHON 2K25)</li>
            <li>2nd – Paper Presentation @ Kongu (SYNERGISE 25)</li>
            <li>Best Team – BYTS Hackathon (24h)</li>
            <li>Best Paper Award – Object Detection project</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Resume;
