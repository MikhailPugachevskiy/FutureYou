import { loadAppState } from "./loadAppState";

const FUTUREYOU_STATE_KEY = "futureYouState";

function ensureArray(value) {
    return Array.isArray(value) ? value : [];
}

function normalizeRoadmap(roadmap) {
    return {
        title: roadmap?.title || "",
        description: roadmap?.description || "",
        content: ensureArray(roadmap?.content),
        saved: Boolean(roadmap?.saved)
    };
}

export function mapProfileToBackendPayload(profile = {}) {
    return {
        currentRole: profile.currentRole || "",
        interests: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks : [],
        level: profile.experienceLevel || "",
        goals: profile.motivation || "",
        workStyle: profile.workStyle || "",
        careerConcern: profile.careerConcern || "",
        skills: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks : []
    };
}

export async function requestCareerPath(appState) {
    const currentState = appState || loadAppState() || {};
    const profile = currentState?.profile || {};
    const payload = mapProfileToBackendPayload(profile);

    const response = await fetch("http://localhost:3000/api/careerpath", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("BACKEND RESPONSE:", data);

    if (!response.ok) {
        throw new Error(data?.error || "Backend request failed.");
    }

    const nextState = {
        ...currentState,
        profile,
        matches: {
            primary: data?.matches?.primary || null,
            secondary: data?.matches?.secondary || null
        },
        skillAnalysis: {
            have: ensureArray(data?.skillAnalysis?.have),
            build: ensureArray(data?.skillAnalysis?.build)
        },
        roadmap: data?.roadmap
            ? normalizeRoadmap(data.roadmap)
            : currentState?.roadmap || {
                title: "",
                description: "",
                content: [],
                saved: false
            }
    };

    localStorage.setItem(FUTUREYOU_STATE_KEY, JSON.stringify(nextState));

    return data;
}