export default function ProfileSnapshot({
    badge = "Profile Snapshot",
    title = "Here's what we understood about you",
    subtitle = "Review your profile and continue when ready.",
    experienceSummary = "",
    strengthSignals = [],
    workPreferences = [],
    careerValues = [],
}) {
    return (
        <section className="react-section">
            <div className="snapshot-hero-react">
                <span className="snapshot-badge-react">{badge}</span>
                <h1>{title}</h1>
                <p className="subtitle">{subtitle}</p>
            </div>

            <div className="snapshot-grid-react">
                <article className="snapshot-card-react card-blue">
                    <div className="snapshot-card-title-react">
                        <span className="snapshot-card-icon-react blue">▣</span>
                        <h3>Experience Summary</h3>
                    </div>
                    <ul className="snapshot-card-list-react">
                        {experienceSummary ? (
                            <li>{experienceSummary}</li>
                        ) : (
                            <li>No experience summary available yet.</li>
                        )}
                    </ul>
                </article>

                <article className="snapshot-card-react card-purple">
                    <div className="snapshot-card-title-react">
                        <span className="snapshot-card-icon-react purple">⚡</span>
                        <h3>Strength Signals</h3>
                    </div>
                    <ul className="snapshot-card-list-react">
                        {strengthSignals.length ? (
                            strengthSignals.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                            <li>No strength signals available yet.</li>
                        )}
                    </ul>
                </article>

                <article className="snapshot-card-react card-green">
                    <div className="snapshot-card-title-react">
                        <span className="snapshot-card-icon-react green">⚙</span>
                        <h3>Work Preferences</h3>
                    </div>
                    <ul className="snapshot-card-list-react">
                        {workPreferences.length ? (
                            workPreferences.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                            <li>No work preferences available yet.</li>
                        )}
                    </ul>
                </article>

                <article className="snapshot-card-react card-red">
                    <div className="snapshot-card-title-react">
                        <span className="snapshot-card-icon-react red">❤</span>
                        <h3>Career Values</h3>
                    </div>
                    <ul className="snapshot-card-list-react">
                        {careerValues.length ? (
                            careerValues.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                            <li>No career values available yet.</li>
                        )}
                    </ul>
                </article>
            </div>
        </section>
    );
}