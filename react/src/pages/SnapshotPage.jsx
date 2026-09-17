import ProfileSnapshot from "../components/ProfileSnapshot";
import { loadAppState } from "../utils/loadAppState";
import { useNavigate } from "react-router-dom";

function formatLabel(value) {
    if (!value) return "";

    const map = {
        stability_security: "Stability & Security",
        growth_learning: "Growth & Learning",
        impact_purpose: "Impact & Purpose",
        flexibility_freedom: "Flexibility & Freedom",
        high_income: "High Income",
        team_oriented: "Team-Oriented",
        fully_remote: "Fully Remote",
        on_site: "On-Site",
        problem_solving: "Problem Solving",
        creative_work: "Creative Work",
        data_analysis: "Data & Analysis",
        people_management: "People Management",
        writing_communication: "Writing & Communication",
        strategy_planning: "Strategy & Planning",
        building_things: "Building Things",
        teaching_mentoring: "Teaching & Mentoring",
        admin_paperwork: "Admin & Paperwork",
        cold_calling: "Cold Calling",
        repetitive_tasks: "Repetitive Tasks",
        office_politics: "Office Politics",
        being_micromanaged: "Being Micromanaged",
        public_speaking: "Public Speaking",
        conflict_resolution: "Conflict Resolution",
        networking_events: "Networking Events"
    };

    if (map[value]) return map[value];

    return String(value)
        .replace(/_/g, " ")
        .replace(/\bAi\b/g, "AI")
        .replace(/\b\w/g, (char, index, str) => {
            const smallWords = ["and", "or", "of", "for", "to", "in", "on", "at", "with"];
            const wordStart = index;
            const rest = str.slice(wordStart);
            const match = rest.match(/^\w+/);
            const word = match ? match[0].toLowerCase() : "";

            if (wordStart !== 0 && smallWords.includes(word)) {
                return char.toLowerCase();
            }

            return char.toUpperCase();
        });
}

export default function SnapshotPage() {
    const appState = loadAppState();

    const navigate = useNavigate();

    const fallbackSnapshot = {
        experienceSummary:
            "You are building your direction step by step and already have clear signals about what suits you.",
        strengthSignals: ["Problem Solving", "Creative Work", "Building Things"],
        workPreferences: ["On-Site", "Avoids: Cold Calling"],
        careerValues: ["Stability & Security", "Looking for clarity and direction"],
    };

    const snapshotFromState =
        appState?.snapshot?.experienceSummary ||
            appState?.snapshot?.strengthSignals?.length ||
            appState?.snapshot?.workPreferences?.length ||
            appState?.snapshot?.careerValues?.length
            ? {
                experienceSummary:
                    appState.snapshot.experienceSummary || fallbackSnapshot.experienceSummary,

                strengthSignals:
                    (appState.snapshot.strengthSignals || fallbackSnapshot.strengthSignals).map(formatLabel),

                workPreferences:
                    (appState.snapshot.workPreferences || fallbackSnapshot.workPreferences).map((item) => {
                        const formatted = formatLabel(item);

                        if (formatted.startsWith("Avoids: ")) {
                            return formatted;
                        }

                        return formatted;
                    }),

                careerValues:
                    (appState.snapshot.careerValues || fallbackSnapshot.careerValues).map((item) => {
                        if (!item) return "";
                        return item.includes("&") ? item : formatLabel(item);
                    }),
            }
            : {
                ...fallbackSnapshot,

                strengthSignals: fallbackSnapshot.strengthSignals.map(formatLabel),

                workPreferences: fallbackSnapshot.workPreferences.map((item) => {
                    const formatted = formatLabel(item);

                    if (formatted.startsWith("Avoids: ")) {
                        return formatted;
                    }

                    return formatted;
                }),

                careerValues: fallbackSnapshot.careerValues.map((item) => {
                    if (!item) return "";
                    return item.includes("&") ? item : formatLabel(item);
                }),
            };

    return (
        <>
            <ProfileSnapshot
                experienceSummary={snapshotFromState.experienceSummary}
                strengthSignals={snapshotFromState.strengthSignals}
                workPreferences={snapshotFromState.workPreferences}
                careerValues={snapshotFromState.careerValues}
            />

            <div style={{ textAlign: "center", margin: "24px 0 48px" }}>
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
                    Show my best career match →
                </button>
            </div>
        </>
    );
}