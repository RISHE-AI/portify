import styles from './ProjectsStyles.module.css';
import C19 from '../../assets/c19.png';
import Travel from '../../assets/travel.png';
import Portfolio from '../../assets/portfolio.png';
import ProjectCard from '../../common/ProjectCard';

function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectsContainer}>
       
        <ProjectCard
          src={Travel}
          link="#"
          h3="TRAVEL INFO WEBSITE"
          p="A MERN Stack Travel Information Website"
        />
        <ProjectCard
          src={Portfolio}
          link="#"
          h3="PERSONAL PORTFOLIO"
          p="A Personal Portfolio Website (MERN STACK)"
        />

         <ProjectCard
          src={C19}
          link="#"
          h3="COVID 19 PREDICTION MODEL"
          p="Covid 19 Prediction Model using Scikit-learn Machine Learning Model"
        />
      </div>
    </section>
  );
}

export default Projects;
