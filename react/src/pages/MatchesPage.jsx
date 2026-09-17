import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CareerMatches from "../components/CareerMatches";
import { loadAppState } from "../utils/loadAppState";
import { requestCareerPath } from "../utils/requestCareerPath";
import { getQuickMatches } from "../utils/quickMatch";

export default function MatchesPage() {
    const navigate = useNavigate();

    const [appState, setAppState] = useState(() => loadAppState());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fallbackMatches = [
        {
            id: 6,
            title: "Graphic Designer",
            description: "Create visual content for branding, marketing, and communication.",
            reasons: [
                "Perfect for visually creative individuals",
                "Flexible career paths including freelance",
                "Strong alignment with artistic expression"
            ],
            skills: ["visual design", "branding", "design tools"]
        },
        {
            id: 2,
            title: "Cloud Engineer",
            description: "Design, deploy, and manage cloud-based systems and services.",
            reasons: [
                "Ideal for users interested in cloud technologies",
                "Good match for scalable system thinking",
                "Strong demand and career stability"
            ],
            skills: ["use cloud computing services", "manage cloud infrastructure", "automate IT operations"]
        }
    ];

    const safeProfile = appState?.profile || {
        enjoyTasks: [],
        motivation: "",
        workStyle: "",
        experienceLevel: "entry"
    };

    const generatedMatches = getQuickMatches(safeProfile);

    console.log("APP STATE:", appState);
    console.log("PROFILE:", appState?.profile);
    console.log("GENERATED MATCHES:", generatedMatches);

    useEffect(() => {
        async function fetchMatches() {
            const currentState = loadAppState();

            if (!currentState?.profile) {
                setError("No profile data found. Please complete the questionnaire first.");
                return;
            }

            const hasBackendMatches =
                currentState?.matches?.primary &&
                currentState?.matches?.secondary;

            setLoading(true);
            setError("");

            try {
                const data = await requestCareerPath(currentState);

                const updatedState = {
                    ...currentState,
                    matches: data.matches || currentState?.matches || generatedMatches || null,
                    skillAnalysis: data.skillAnalysis || currentState?.skillAnalysis || null,
                    roadmap: data.roadmap || currentState?.roadmap || {
                        title: "",
                        description: "",
                        content: [],
                        saved: false
                    }
                };


                localStorage.setItem("futureYouState", JSON.stringify(updatedState));
                setAppState(updatedState);
            } catch (err) {
                console.error("Could not load career matches:", err);
                setError(err.message || "Could not load career matches.");
                setAppState(currentState);
            } finally {
                setLoading(false);
            }
        }

        fetchMatches();
    }, []);

    const activeMatches =
        appState?.matches?.primary && appState?.matches?.secondary
            ? appState.matches
            : generatedMatches;

    const matchesFromState = activeMatches
        ? [
            {
                id: activeMatches.primary.id || 1,
                title: activeMatches.primary.title || activeMatches.primary.currentRole || "Career Match 1",
                description: activeMatches.primary.description || "No description available.",
                reasons: Array.isArray(activeMatches.primary.whyItFits)
                    ? activeMatches.primary.whyItFits
                    : ["No explanation available."],
                skills: Array.isArray(activeMatches.primary.skills)
                    ? activeMatches.primary.skills
                    : []
            },
            {
                id: activeMatches.secondary.id || 2,
                title: activeMatches.secondary.title || activeMatches.secondary.currentRole || "Career Match 2",
                description: activeMatches.secondary.description || "No description available.",
                reasons: Array.isArray(activeMatches.secondary.whyItFits)
                    ? activeMatches.secondary.whyItFits
                    : ["No explanation available."],
                skills: Array.isArray(activeMatches.secondary.skills)
                    ? activeMatches.secondary.skills
                    : []
            }
        ]
        : fallbackMatches;

    return (
        <>
            {loading && (
                <p style={{ textAlign: "center", marginTop: "24px" }}>
                    Loading career matches...
                </p>
            )}

            {error && (
                <p
                    style={{
                        textAlign: "center",
                        marginTop: "24px",
                        color: "crimson"
                    }}
                >
                    {error}
                </p>
            )}

            <CareerMatches matches={matchesFromState} />

            <div style={{ textAlign: "center", margin: "24px 0 48px" }}>
                <button
                    onClick={() => navigate("/skills")}
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
                    Continue to skill analysis →
                </button>
            </div>
        </>
    );
}