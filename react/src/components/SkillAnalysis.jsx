export default function SkillAnalysis({ targetRole, skillsHave, skillsBuild }) {
    return (
        <section className="skill-analysis-section">
            <div className="section-header">
                <span className="badge">Skill Analysis</span>
                <h1>Your skill match & gaps</h1>
                <p className="subtitle">
                    For your transition to <strong>{targetRole}</strong>
                </p>
            </div>

            <div className="skills-grid-react">
                {/* LEFT COLUMN */}
                <div className="skills-column">
                    <div className="column-title">
                        <span className="column-icon success">✓</span>
                        <h2>Skills you already have</h2>
                    </div>

                    <div className="skill-list-react">
                        {skillsHave.map((skill, index) => (
                            <div key={index} className="skill-row-react">
                                <div className="skill-left-react">
                                    <span className="row-icon success">✓</span>
                                    <h3>{skill.name}</h3>
                                </div>
                                <span className={`tag-react ${skill.level}`}>
                                    {skill.level}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="skills-column">
                    <div className="column-title">
                        <span className="column-icon accent">↗</span>
                        <h2>Skills to build next</h2>
                    </div>

                    <div className="skill-list-react">
                        {skillsBuild.map((skill, index) => (
                            <div key={index} className="skill-card-react">
                                <div className="skill-card-top-react">
                                    <div className="skill-card-title-react">
                                        <span className="row-icon accent">↗</span>
                                        <h3>{skill.name}</h3>
                                    </div>
                                    <span className={`tag-react ${skill.priority}`}>
                                        {skill.priority} priority
                                    </span>
                                </div>
                                <p>{skill.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}