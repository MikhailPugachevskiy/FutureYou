import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function normalizePriority(priority) {
    if (!priority) return "medium";
    const value = String(priority).toLowerCase();

    if (value.includes("high")) return "high";
    if (value.includes("low")) return "low";
    return "medium";
}

function buildRoadmapFromState(appState) {
    const roadmapFromBackend = appState?.roadmap || {};
    const backendContent = Array.isArray(roadmapFromBackend.content)
        ? roadmapFromBackend.content
        : [];

    if (backendContent.length > 0) {
        const targetRole =
            roadmapFromBackend.title ||
            appState?.matches?.primary?.title ||
            "your next role";

        const subtitle =
            roadmapFromBackend.description ||
            `A week-by-week plan to close your skill gaps for ${targetRole}.`;

        const items = backendContent.map((item, index) => {
            const priority = normalizePriority(item?.priority);

            return {
                week: item?.week || `Week ${index + 1}`,
                title: item?.title || item?.name || `Skill ${index + 1}`,
                priority,
                description:
                    item?.description || "Build this skill step by step through practice.",
                action:
                    item?.action ||
                    (priority === "high"
                        ? "Focus deeply on this area with practical weekly exercises."
                        : priority === "medium"
                            ? "Practice consistently and apply it in small real-world tasks."
                            : "Keep improving with light repetition and reflection."),
            };
        });

        return {
            targetRole,
            subtitle,
            items,
            saved: Boolean(roadmapFromBackend.saved),
        };
    }

    const targetRole =
        appState?.matches?.primary?.title ||
        appState?.roadmap?.title ||
        "your next role";

    const buildSkills =
        appState?.skillAnalysis?.build?.length
            ? appState.skillAnalysis.build
            : [
                {
                    name: "Strategic Planning",
                    priority: "high",
                    description:
                        "Develop a stronger long-term vision and connect your work to business goals.",
                },
                {
                    name: "Leadership",
                    priority: "high",
                    description:
                        "Strengthen your ability to guide teams and support decision-making.",
                },
                {
                    name: "Client Management",
                    priority: "medium",
                    description:
                        "Improve stakeholder communication and expectation management.",
                },
            ];

    const roadmapItems = buildSkills.map((skill, index) => {
        const priority = normalizePriority(skill.priority);

        const week =
            index === 0
                ? "Week 1"
                : index === 1
                    ? "Week 2"
                    : index === 2
                        ? "Week 3"
                        : `Week ${index + 1}`;

        const action =
            priority === "high"
                ? "Focus deeply on this area with practical weekly exercises."
                : priority === "medium"
                    ? "Practice consistently and apply it in small real-world tasks."
                    : "Keep improving with light repetition and reflection.";

        return {
            week,
            title: skill.name || `Skill ${index + 1}`,
            priority,
            description:
                skill.description || "Build this skill step by step through practice.",
            action,
        };
    });

    return {
        targetRole,
        subtitle: `A week-by-week plan to close your skill gaps for ${targetRole}.`,
        items: roadmapItems,
        saved: Boolean(appState?.roadmap?.saved),
    };
}

function priorityLabel(priority) {
    if (priority === "high") return "High priority";
    if (priority === "low") return "Low priority";
    return "Medium priority";
}

export default function LearningRoadmap({ appState }) {
    const navigate = useNavigate();
    const roadmap = useMemo(() => buildRoadmapFromState(appState), [appState]);
    const [isSaved, setIsSaved] = useState(roadmap.saved);

    const handleSave = () => {
        try {
            const raw = localStorage.getItem("futureYouState");
            const parsed = raw ? JSON.parse(raw) : {};

            const updated = {
                ...parsed,
                roadmap: {
                    ...(parsed.roadmap || {}),
                    title: roadmap.targetRole,
                    description: roadmap.subtitle,
                    content: roadmap.items,
                    saved: true,
                },
            };

            localStorage.setItem("futureYouState", JSON.stringify(updated));
            setIsSaved(true);
            alert("Plan saved successfully.");
        } catch (error) {
            console.error("Could not save roadmap:", error);
            alert("Could not save the plan.");
        }
    };

    const handleDownload = () => {
        const lines = [
            `FutureYou - Learning Roadmap`,
            ``,
            `Target role: ${roadmap.targetRole}`,
            `${roadmap.subtitle}`,
            ``,
            ...roadmap.items.flatMap((item) => [
                `${item.week}: ${item.title} (${priorityLabel(item.priority)})`,
                `Description: ${item.description}`,
                `Action: ${item.action}`,
                ``,
            ]),
        ];

        const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "futureyou-roadmap.txt";
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    return (
        <section className="react-section roadmap-react-section">
            <div className="roadmap-hero-react">
                <span className="badge">Learning Roadmap</span>
                <h1>
                    Your path to <span>{roadmap.targetRole}</span>
                </h1>
                <p className="subtitle">{roadmap.subtitle}</p>
            </div>

            <div className="roadmap-list-react">
                {roadmap.items.map((item) => (
                    <article className="roadmap-item-react" key={`${item.week}-${item.title}`}>
                        <div className="roadmap-item-top">
                            <span className="roadmap-week">{item.week}</span>
                            <span className={`roadmap-priority ${item.priority}`}>
                                {priorityLabel(item.priority)}
                            </span>
                        </div>

                        <h3>{item.title}</h3>
                        <p>{item.description}</p>

                        <div className="roadmap-action-box">
                            <strong>Action:</strong>
                            <span>{item.action}</span>
                        </div>
                    </article>
                ))}
            </div>

            <div className="roadmap-actions-react">
                <button className="btn-primary" type="button" onClick={handleSave}>
                    {isSaved ? "Plan saved" : "Save my plan"}
                </button>

                <button className="btn-secondary" type="button" onClick={handleDownload}>
                    Download roadmap
                </button>
            </div>

            <p className="roadmap-hint-react">
                This roadmap is personalized to your profile. Adjust the pace to fit your schedule.
            </p>

            <div style={{ textAlign: "center", marginTop: "32px", marginBottom: "48px" }}>
                <button
                    onClick={() => navigate("/snapshot")}
                    style={{
                        padding: "14px 24px",
                        borderRadius: "12px",
                        border: "1px solid #d0d5dd",
                        background: "white",
                        color: "#344054",
                        fontSize: "16px",
                        cursor: "pointer",
                        marginRight: "12px"
                    }}
                >
                    Back to snapshot
                </button>

                <button
                    onClick={() => navigate("/matches")}
                    style={{
                        padding: "14px 24px",
                        borderRadius: "12px",
                        border: "none",
                        background: "#6c63ff",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >
                    Review career matches
                </button>
            </div>
        </section>
    );
}