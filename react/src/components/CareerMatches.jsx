import { useState } from "react";

export default function CareerMatches({ matches }) {
    const [activeMatch, setActiveMatch] = useState(matches?.[0]?.id || 1);

    return (
        <div className="matches-container">
            {matches.map((match) => (
                <div
                    key={match.id}
                    className={`match-card ${activeMatch === match.id ? "active" : ""}`}
                    onClick={() => setActiveMatch(match.id)}
                >
                    <div className="match-header">
                        <span className="badge">MATCH #{match.id}</span>
                        <h2>{match.title}</h2>
                    </div>

                    <p className="description">{match.description}</p>

                    <h4>Why it fits you</h4>

                    <ul>
                        {match.reasons.map((reason, index) => (
                            <li key={index}>✓ {reason}</li>
                        ))}
                    </ul>

                    <div className="skills">
                        {match.skills.map((skill, index) => (
                            <span key={index} className="skill-pill">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}