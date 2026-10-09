import { CheckCircle2, Terminal, Layout, Code2, Database, Wrench } from 'lucide-react';

function Skills({ skills = [] }) {
  const defaultSkills = [
    {
      category: 'Programming Languages',
      items: [{ name: 'Java' }, { name: 'JavaScript' }, { name: 'Python' }]
    },
    {
      category: 'Frontend Development',
      items: [{ name: 'React JS' }, { name: 'HTML5' }, { name: 'CSS3' }]
    },
    {
      category: 'Backend Development',
      items: [{ name: 'Node JS' }, { name: 'Express JS' }]
    },
    {
      category: 'Databases & Cloud',
      items: [{ name: 'MongoDB' }, { name: 'Firebase' }]
    },
    {
      category: 'Tools & AI Technologies',
      items: [
        { name: 'Git & GitHub' },
        { name: 'OpenCV & OCR' },
        { name: 'TensorFlow / Keras' },
        { name: 'FAISS & RAG' }
      ]
    }
  ];

  const skillCategories = skills.length > 0 ? skills : defaultSkills;

  const getCategoryIcon = (categoryName) => {
    if (categoryName.includes('Programming')) return <Terminal size={20} />;
    if (categoryName.includes('Frontend')) return <Layout size={20} />;
    if (categoryName.includes('Backend')) return <Code2 size={20} />;
    if (categoryName.includes('Database')) return <Database size={20} />;
    return <Wrench size={20} />;
  };

  return (
    <section id="skills" className="py-5">
      <div className="container">
        <div className="section-header animate-fade-in">
          <span className="section-tag">Technical Competencies</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            Core programming languages, full-stack frameworks, AI toolkits, and databases I build with.
          </p>
        </div>

        <div className="row g-4">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="card glass-card h-100 p-4 border-0">
                <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                  <div
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'var(--accent-soft)',
                      color: 'var(--accent-primary)'
                    }}
                  >
                    {getCategoryIcon(cat.category)}
                  </div>
                  <h3 className="h6 fw-bold mb-0 text-truncate" style={{ color: 'var(--text-primary)' }}>
                    {cat.category}
                  </h3>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {cat.items?.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 border"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CheckCircle2 size={15} style={{ color: 'var(--accent-primary)' }} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
