// =========================
// APP STATE
// =========================

const FUTUREYOU_STATE_KEY = "futureYouState";

const defaultState = {
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
        description: "",
        content: [],
        saved: false
    }
};

function getAppState() {
    const raw = localStorage.getItem(FUTUREYOU_STATE_KEY);
    if (!raw) return structuredClone(defaultState);

    try {
        const parsed = JSON.parse(raw);
        return mergeWithDefaultState(parsed);
    } catch (error) {
        console.error("Invalid app state. Resetting.", error);
        return structuredClone(defaultState);
    }
}

function saveAppState(state) {
    localStorage.setItem(FUTUREYOU_STATE_KEY, JSON.stringify(state));
}

function updateProfileField(field, value) {
    const state = getAppState();
    state.profile[field] = value;
    saveAppState(state);
}

function updateSection(sectionName, partialData) {
    const state = getAppState();
    state[sectionName] = {
        ...state[sectionName],
        ...partialData
    };
    saveAppState(state);
}

function resetAppState() {
    localStorage.removeItem(FUTUREYOU_STATE_KEY);
}

function mergeWithDefaultState(savedState) {
    return {
        ...structuredClone(defaultState),
        ...savedState,
        profile: {
            ...structuredClone(defaultState.profile),
            ...(savedState.profile || {})
        },
        snapshot: {
            ...structuredClone(defaultState.snapshot),
            ...(savedState.snapshot || {})
        },
        matches: {
            ...structuredClone(defaultState.matches),
            ...(savedState.matches || {})
        },
        skillAnalysis: {
            ...structuredClone(defaultState.skillAnalysis),
            ...(savedState.skillAnalysis || {})
        },
        roadmap: {
            ...structuredClone(defaultState.roadmap),
            ...(savedState.roadmap || {})
        }
    };
}

window.getAppState = getAppState;
window.updateProfileField = updateProfileField;
window.updateSection = updateSection;