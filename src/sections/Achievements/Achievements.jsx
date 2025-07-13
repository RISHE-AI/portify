import styles from './AchievementsStyles.module.css';
/*import hackathonImg from '../../assets/hackathon.png';
import projectAwardImg from '../../assets/project-award.png';
import fullstackCertImg from '../../assets/fullstack-cert.png';*/

function Achievements() {
  return (
    <section id="achievements" className={styles.container}>
      <h1 className="sectionTitle">MyAchievements</h1>
      <div className={styles.achievementsList}>
        <div className={styles.achievementCard}>
          {/* <img src={hackathonImg} alt="Hackathon Winner" className={styles.achievementImg} /> */}
          <h3>Award in Hackathon 2024(BYTS INDIA HACKATHON)</h3><br />
          <p>Secured an award for best innovation and Team collaboration in the National Level Hackathon for developing an AI-powered web app.</p>
        </div>
        <div className={styles.achievementCard}>
          {/* <img src={projectAwardImg} alt="Best Project Award" className={styles.achievementImg} /> */}
          <h3>Best Project Idea Award(Project Presentation)</h3><br />
          <p>Received the Best Project Idea Award for the Object Detection for blind people using Deep Learning in PSG college of engineering,Coimbatore</p>
        </div>
        <div className={styles.achievementCard}>
          {/* <img src={fullstackCertImg} alt="Full Stack Certification" className={styles.achievementImg} /> */}
          <h3>Developed Two full stack projects</h3><br /><br />
          <p>1. Cloth Customization website</p><br />
          <p>2. Live Chat and Video call application</p>
        </div>
      </div>
    </section>
  );
}

export default Achievements;
