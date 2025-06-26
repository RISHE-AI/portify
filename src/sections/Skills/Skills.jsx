import styles from './SkillsStyles.module.css';
import checkMarkIconDark from '../../assets/checkmark-dark.svg';
import checkMarkIconLight from '../../assets/checkmark-light.svg';
import SkillList from '../../common/SkillList';
import { useTheme } from '../../common/ThemeContext';

function Skills() {
  const { theme } = useTheme();
  const checkMarkIcon = theme === 'light' ? checkMarkIconLight : checkMarkIconDark;

  return (
    <section id="skills" className={styles.container}>
      <h1 className="sectionTitle">Skills</h1>
      
      <div className={styles.skillsGrid}>
        <div className={styles.skillCategory}>
          <h3>Technical Skills</h3>
          <ul className={styles.skillList}>
            <SkillList src={checkMarkIcon} skill="HTML" />
            <SkillList src={checkMarkIcon} skill="CSS" />
            <SkillList src={checkMarkIcon} skill="JavaScript" />
            <SkillList src={checkMarkIcon} skill="Java" />
            <SkillList src={checkMarkIcon} skill="React" />
          </ul>
        </div>

        <div className={styles.skillCategory}>
          <h3>Tools</h3>
          <ul className={styles.skillList}>
            <SkillList src={checkMarkIcon} skill="Git" />
            <SkillList src={checkMarkIcon} skill="GitHub" />
            <SkillList src={checkMarkIcon} skill="MySQL" />
            <SkillList src={checkMarkIcon} skill="MongoDB" />
            <SkillList src={checkMarkIcon} skill="Canva" />
          </ul>
        </div>

        <div className={styles.skillCategory}>
          <h3>Languages</h3>
          <ul className={styles.skillList}>
            <SkillList src={checkMarkIcon} skill="English" />
            <SkillList src={checkMarkIcon} skill="Tamil" />
            <SkillList src={checkMarkIcon} skill="Hindi" />
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Skills;