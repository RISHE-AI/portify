import styles from './AchievementsStyles.module.css';
/*import hackathonImg from '../../assets/hackathon.png';
import projectAwardImg from '../../assets/project-award.png';
import fullstackCertImg from '../../assets/fullstack-cert.png';*/

function Achievements() {
  return (
    <section id="achievements" className={styles.container}>
      <h1 className="sectionTitle">Achievements</h1>
      <div className={styles.achievementsList}>
        <div className={styles.achievementCard}>
          {/* <img src={hackathonImg} alt="Hackathon Winner" className={styles.achievementImg} /> */}
          <h3>Winner - Hackathon 2024</h3>
          <p>Secured 1st place in the National Level Hackathon for developing an AI-powered web app.</p>
        </div>
        <div className={styles.achievementCard}>
          {/* <img src={projectAwardImg} alt="Best Project Award" className={styles.achievementImg} /> */}
          <h3>Best Project Idea Award</h3>
          <p>Received the Best Project Idea Award for the Object Detection for blind people using Deep Learning in PSG college of engineering,Coimbatore</p>
        </div>
        <div className={styles.achievementCard}>
          {/* <img src={fullstackCertImg} alt="Full Stack Certification" className={styles.achievementImg} /> */}
          <h3>Certification - Full Stack Development</h3>
          <p>Completed a certified Full Stack Development course from XYZ Institute.</p>
        </div>
      </div>
    </section>
  );
}

export default Achievements;
