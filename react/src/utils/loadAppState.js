function ensureArray(value) {
    return Array.isArray(value) ? value : [];
}

function ensureObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function loadAppState() {
    const raw = localStorage.getItem("futureYouState");

    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);

        const profile = ensureObject(parsed.profile);
        const snapshot = ensureObject(parsed.snapshot);
        const matches = ensureObject(parsed.matches);
        const skillAnalysis = ensureObject(parsed.skillAnalysis);
        const roadmap = ensureObject(parsed.roadmap);

        return {
            ...parsed,

            profile: {
                currentRole: profile.currentRole || "",
                experienceLevel: profile.experienceLevel || "",
                enjoyTasks: ensureArray(profile.enjoyTasks),
                drainTasks: ensureArray(profile.drainTasks),
                motivation: profile.motivation || "",
                workStyle: profile.workStyle || "",
                careerConcern: profile.careerConcern || ""
            },

            snapshot: {
                experienceSummary: snapshot.experienceSummary || "",
                strengthSignals: ensureArray(snapshot.strengthSignals),
                workPreferences: ensureArray(snapshot.workPreferences),
                careerValues: ensureArray(snapshot.careerValues)
            },

            matches: {
                primary: matches.primary || null,
                secondary: matches.secondary || null
            },

            skillAnalysis: {
                have: ensureArray(skillAnalysis.have),
                build: ensureArray(skillAnalysis.build)
            },

            roadmap: {
                title: roadmap.title || "",
                description: roadmap.description || "",
                content: ensureArray(roadmap.content),
                saved: Boolean(roadmap.saved)
            }
        };
    } catch (error) {
        console.error("Failed to parse futureYouState from localStorage:", error);
        return null;
    }
}