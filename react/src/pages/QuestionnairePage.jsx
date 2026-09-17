import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadAppState } from "../utils/loadAppState";

const TOTAL_STEPS = 7;

const ENJOY_OPTIONS = [
    { value: "Problem Solving", icon: "🧩" },
    { value: "Creative Work", icon: "🎨" },
    { value: "Data & Analysis", icon: "📊" },
    { value: "People Management", icon: "👥" },
    { value: "Writing & Communication", icon: "✍️" },
    { value: "Strategy & Planning", icon: "🗺️" },
    { value: "Building Things", icon: "🛠️" },
    { value: "Teaching & Mentoring", icon: "🎓" }
];

const DRAIN_OPTIONS = [
    { value: "Admin & Paperwork", icon: "📄" },
    { value: "Cold Calling", icon: "📞" },
    { value: "Repetitive Tasks", icon: "🔁" },
    { value: "Office Politics", icon: "🏛️" },
    { value: "Being Micromanaged", icon: "🔍" },
    { value: "Public Speaking", icon: "🎤" },
    { value: "Conflict Resolution", icon: "⚡" },
    { value: "Networking Events", icon: "🤝" }
];

const EXPERIENCE_OPTIONS = [
    { value: "entry", label: "Entry Level", sublabel: "0–2 years", icon: "🌿" },
    { value: "mid", label: "Mid Level", sublabel: "3–5 years", icon: "🌱" },
    { value: "senior", label: "Senior Level", sublabel: "6–10 years", icon: "🌳" },
    { value: "executive", label: "Executive", sublabel: "10+ years", icon: "🏔️" }
];

const MOTIVATION_OPTIONS = [
    { value: "stability_security", label: "Stability & Security", sublabel: "Reliable income and job security", icon: "🛡️" },
    { value: "growth_learning", label: "Growth & Learning", sublabel: "Constant learning and advancement", icon: "🚀" },
    { value: "impact_purpose", label: "Impact & Purpose", sublabel: "Making a meaningful difference", icon: "🌍" },
    { value: "flexibility_freedom", label: "Flexibility & Freedom", sublabel: "Control over time and location", icon: "🕊️" },
    { value: "high_income", label: "High Income", sublabel: "Maximizing earning potential", icon: "💰" }
];

const WORKSTYLE_OPTIONS = [
    { value: "Fully Remote", label: "Fully Remote", sublabel: "Work from anywhere", icon: "🏡" },
    { value: "Hybrid", label: "Hybrid", sublabel: "Mix of office and remote", icon: "🔀" },
    { value: "On-Site", label: "On-Site", sublabel: "In the office daily", icon: "🏢" },
    { value: "Team-Oriented", label: "Team-Oriented", sublabel: "Collaborative environments", icon: "👥" },
    { value: "Independent", label: "Independent", sublabel: "Self-directed work", icon: "🎯" }
];

const DEFAULT_STATE = {
    profile: {
        currentRole: "",
        experienceLevel: "",
        enjoyTasks: [],
        drainTasks: [],
        motivation: "",
        workStyle: "",
        careerConcern: ""
    },
    snapshot: {
        experienceSummary: "",
        strengthSignals: [],
        workPreferences: [],
        careerValues: []
    },
    matches: {
        primary: null,
        secondary: null
    },
    skillAnalysis: {
        have: [],
        build: []
    },
    roadmap: {
        title: "",
        saved: false
    }
};

function buildSnapshot(profile) {
    const levelMap = {
        entry: "You are at the beginning of your professional journey and building your foundation.",
        mid: "You already have practical experience and are building toward your next step.",
        senior: "You bring solid experience and are ready for more advanced responsibility.",
        executive: "You have extensive experience and may be ready for strategic leadership opportunities."
    };

    return {
        experienceSummary:
            levelMap[profile.experienceLevel] ||
            "You are building your professional direction step by step.",
        strengthSignals: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks.slice(0, 3) : [],
        workPreferences: [
            profile.workStyle || "Flexible work style",
            ...(Array.isArray(profile.drainTasks) && profile.drainTasks.length
                ? [`Avoids: ${profile.drainTasks[0]}`]
                : [])
        ],
        careerValues: [
            profile.motivation || "Professional growth",
            profile.careerConcern?.toLowerCase().includes("ai")
                ? "Seeking future-proof career paths"
                : profile.careerConcern?.toLowerCase().includes("stuck")
                    ? "Looking for growth and change"
                    : profile.careerConcern?.toLowerCase().includes("direction")
                        ? "Looking for clarity and direction"
                        : profile.careerConcern?.trim()
                            ? "Trying to reduce career uncertainty"
                            : "Exploring next career steps"
        ]
    };
}

function getInitialProfile() {
    const saved = loadAppState();

    return {
        ...DEFAULT_STATE.profile,
        ...(saved?.profile || {})
    };
}

export default function QuestionnairePage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState(getInitialProfile);

    const percent = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);

    function updateField(field, value) {
        setProfile((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    function toggleMultiValue(field, value) {
        setProfile((prev) => {
            const current = Array.isArray(prev[field]) ? prev[field] : [];
            const exists = current.includes(value);

            return {
                ...prev,
                [field]: exists
                    ? current.filter((item) => item !== value)
                    : [...current, value]
            };
        });
    }

    function validateCurrentStep() {
        if (step === 1) return profile.currentRole.trim().length > 0;
        if (step === 2) return !!profile.experienceLevel;
        if (step === 3) return Array.isArray(profile.enjoyTasks) && profile.enjoyTasks.length > 0;
        if (step === 4) return Array.isArray(profile.drainTasks) && profile.drainTasks.length > 0;
        if (step === 5) return !!profile.motivation;
        if (step === 6) return !!profile.workStyle;
        if (step === 7) return profile.careerConcern.trim().length > 0;
        return true;
    }

    function getValidationMessage() {
        if (step === 1) return "Please enter your current role.";
        if (step === 2) return "Please select one option.";
        if (step === 3) return "Please select at least one option.";
        if (step === 4) return "Please select at least one option.";
        if (step === 5) return "Please select one option.";
        if (step === 6) return "Please select one option.";
        if (step === 7) return "Please write a short career concern before continuing.";
        return "Please complete this step.";
    }

    function handleBack() {
        if (step === 1) {
            navigate("/");
            return;
        }
        setStep((prev) => prev - 1);
    }

    function handleContinue() {
        if (!validateCurrentStep()) {
            alert(getValidationMessage());
            return;
        }

        if (step < TOTAL_STEPS) {
            setStep((prev) => prev + 1);
            return;
        }

        const existingState = loadAppState() || DEFAULT_STATE;

        const updatedState = {
            ...DEFAULT_STATE,
            ...existingState,
            profile: {
                ...DEFAULT_STATE.profile,
                ...(existingState.profile || {}),
                ...profile
            },
            snapshot: buildSnapshot(profile),
            matches: existingState.matches || DEFAULT_STATE.matches,
            skillAnalysis: existingState.skillAnalysis || DEFAULT_STATE.skillAnalysis,
            roadmap: {
                ...DEFAULT_STATE.roadmap,
                ...(existingState.roadmap || {})
            }
        };

        localStorage.setItem("futureYouState", JSON.stringify(updatedState));
        navigate("/snapshot");
    }

    function renderRadioGrid(options, field, selectedValue) {
        return (
            <div style={styles.optionsGrid}>
                {options.map((option) => {
                    const selected = selectedValue === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => updateField(field, option.value)}
                            style={{
                                ...styles.optionCardButton
                            }}
                        >
                            <div
                                style={{
                                    ...styles.optionContent,
                                    borderColor: selected ? "rgba(108, 99, 255, 0.55)" : "#eef0f4",
                                    boxShadow: selected
                                        ? "0 10px 22px rgba(108, 99, 255, 0.14)"
                                        : "none"
                                }}
                            >
                                <div style={styles.optionIcon}>{option.icon}</div>
                                <div style={styles.optionTextWrap}>
                                    <h3 style={styles.optionHeading}>{option.label}</h3>
                                    <p style={styles.optionParagraph}>{option.sublabel}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    }

    function renderPillGrid(options, field, selectedValues) {
        return (
            <div style={styles.pillGrid}>
                {options.map((option) => {
                    const selected = selectedValues.includes(option.value);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleMultiValue(field, option.value)}
                            style={{
                                ...styles.pill,
                                borderColor: selected ? "rgba(108, 99, 255, 0.55)" : "#eef0f4",
                                boxShadow: selected
                                    ? "0 10px 22px rgba(108, 99, 255, 0.14)"
                                    : "none"
                            }}
                        >
                            <span style={styles.pillIcon}>{option.icon}</span>
                            <span>{option.value}</span>
                        </button>
                    );
                })}
            </div>
        );
    }

    function renderStepContent() {
        if (step === 1) {
            return (
                <>
                    <h1 style={styles.questionTitle}>What&apos;s your current role?</h1>
                    <p style={styles.subtitle}>Or the most recent role you&apos;ve held.</p>
                    <input
                        type="text"
                        value={profile.currentRole}
                        onChange={(e) => updateField("currentRole", e.target.value)}
                        placeholder="e.g. Marketing Manager, Software Engineer, Teacher..."
                        style={styles.textInput}
                    />
                </>
            );
        }

        if (step === 2) {
            return (
                <>
                    <h1 style={styles.questionTitle}>What&apos;s your experience level?</h1>
                    <p style={styles.subtitle}>Choose the one that best describes where you are.</p>
                    {renderRadioGrid(EXPERIENCE_OPTIONS, "experienceLevel", profile.experienceLevel)}
                </>
            );
        }

        if (step === 3) {
            return (
                <>
                    <h1 style={styles.questionTitle}>What tasks do you enjoy most?</h1>
                    <p style={styles.subtitle}>Select all that energize you.</p>
                    {renderPillGrid(ENJOY_OPTIONS, "enjoyTasks", profile.enjoyTasks)}
                </>
            );
        }

        if (step === 4) {
            return (
                <>
                    <h1 style={styles.questionTitle}>What tasks drain you?</h1>
                    <p style={styles.subtitle}>Select the ones that feel like a chore.</p>
                    {renderPillGrid(DRAIN_OPTIONS, "drainTasks", profile.drainTasks)}
                </>
            );
        }

        if (step === 5) {
            return (
                <>
                    <h1 style={styles.questionTitle}>What drives you most?</h1>
                    <p style={styles.subtitle}>Pick your primary career motivation.</p>
                    {renderRadioGrid(MOTIVATION_OPTIONS, "motivation", profile.motivation)}
                </>
            );
        }

        if (step === 6) {
            return (
                <>
                    <h1 style={styles.questionTitle}>What&apos;s your ideal work style?</h1>
                    <p style={styles.subtitle}>How do you do your best work?</p>
                    {renderRadioGrid(WORKSTYLE_OPTIONS, "workStyle", profile.workStyle)}
                </>
            );
        }

        return (
            <>
                <h1 style={styles.questionTitle}>What&apos;s your biggest career concern?</h1>
                <p style={styles.subtitle}>Be honest — this helps us give better guidance.</p>
                <textarea
                    value={profile.careerConcern}
                    onChange={(e) => updateField("careerConcern", e.target.value)}
                    placeholder="e.g. I'm worried about being replaced by AI, I feel stuck in my current role, I don't know what I'm good at..."
                    rows={6}
                    style={styles.textInput}
                />
            </>
        );
    }

    return (
        <main style={styles.page}>
            <header style={styles.topNav}>
                <div style={styles.logoArea}>
                    <div style={styles.logoIcon}>✦</div>
                    <span style={styles.logoText}>FutureYou</span>
                </div>
            </header>

            <section style={styles.progressSection}>
                <div style={styles.progressInfo}>
                    <span>Question {step} of {TOTAL_STEPS}</span>
                    <span>{percent}%</span>
                </div>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${percent}%` }} />
                </div>
            </section>

            <main style={styles.questionContainer}>
                <div style={styles.questionInner}>
                    {renderStepContent()}
                </div>
            </main>

            <footer style={styles.bottomNav}>
                <button type="button" onClick={handleBack} style={styles.btnBack}>
                    ← Back
                </button>

                <button type="button" onClick={handleContinue} style={styles.btnContinue}>
                    {step === TOTAL_STEPS ? "See My Profile →" : "Continue →"}
                </button>
            </footer>
        </main>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f7f8fc",
        color: "#111827",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif"
    },
    topNav: {
        display: "flex",
        alignItems: "center",
        padding: "20px 40px"
    },
    logoArea: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    logoIcon: {
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #6c63ff, #8b84ff)",
        color: "#fff",
        fontWeight: 700,
        fontSize: "14px"
    },
    logoText: {
        fontWeight: 600,
        fontSize: "18px"
    },
    progressSection: {
        width: "min(780px, 72%)",
        margin: "10px auto 0 auto"
    },
    progressInfo: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        color: "#6b7280",
        marginBottom: "8px"
    },
    progressBar: {
        width: "100%",
        height: "6px",
        background: "#e5e7eb",
        borderRadius: "999px",
        overflow: "hidden"
    },
    progressFill: {
        height: "100%",
        background: "linear-gradient(90deg, #6c63ff, #8b84ff)",
        borderRadius: "999px",
        transition: "width 0.4s ease"

    },
    questionContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 24px"
    },
    questionInner: {
        width: "min(820px, 90%)"
    },
    questionTitle: {
        fontSize: "36px",
        fontWeight: 700,
        lineHeight: 1.25,
        marginBottom: "10px"
    },
    subtitle: {
        fontSize: "16px",
        color: "#6b7280",
        marginBottom: "26px"
    },
    textInput: {
        width: "100%",
        maxWidth: "720px",
        padding: "14px 18px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        fontSize: "15px",
        outline: "none",
        background: "#fff",
        resize: "vertical"
    },
    optionsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "16px",
        width: "100%",
        maxWidth: "720px"
    },
    optionCardButton: {
        background: "transparent",
        border: "none",
        padding: 0,
        textAlign: "left",
        cursor: "pointer"
    },
    optionContent: {
        background: "#fff",
        border: "1px solid #eef0f4",
        borderRadius: "12px",
        padding: "16px 18px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        transition: "0.18s ease"
    },
    optionIcon: {
        width: "28px",
        height: "28px",
        display: "grid",
        placeItems: "center",
        fontSize: "18px",
        flexShrink: 0
    },
    optionTextWrap: {
        display: "flex",
        flexDirection: "column"
    },
    optionHeading: {
        fontSize: "15px",
        fontWeight: 600,
        margin: 0,
        marginBottom: "2px"
    },
    optionParagraph: {
        fontSize: "13px",
        color: "#6b7280",
        margin: 0
    },
    pillGrid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        width: "100%",
        maxWidth: "720px"
    },
    pill: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        borderRadius: "12px",
        background: "#fff",
        border: "1px solid #eef0f4",
        color: "#374151",
        fontSize: "14px",
        cursor: "pointer",
        userSelect: "none"
    },
    pillIcon: {
        width: "18px",
        textAlign: "center",
        flexShrink: 0
    },
    bottomNav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "28px 60px"
    },
    btnBack: {
        background: "none",
        border: "none",
        fontSize: "15px",
        color: "#9ca3af",
        cursor: "pointer"
    },
    btnContinue: {
        border: "none",
        padding: "14px 30px",
        borderRadius: "12px",
        color: "#fff",
        fontSize: "15px",
        fontWeight: 500,
        cursor: "pointer",
        background: "linear-gradient(135deg, #6c63ff, #8b84ff)"
    }
};