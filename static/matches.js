// =========================
// STEP 4 MATCH ENGINE
// using app-state.js
// =========================

function buildCareerMatches() {
    const state = getAppState();
    const profile = state.profile;

    const enjoys = profile.enjoyTasks || [];
    const drains = profile.drainTasks || [];
    const motivation = profile.motivation || "";
    const workStyle = profile.workStyle || "";
    const experience = profile.experienceLevel || "";

    let primaryMatch = {
        title: "Design Director",
        desc: "A leadership-focused creative role where you shape visual direction, mentor others, and connect design work with larger business goals.",
        why: [
            "Builds on your creative strengths and ability to guide others.",
            "Fits well if you enjoy strategic thinking and solving design challenges.",
            "Offers strong long-term growth for experienced creative professionals."
        ],
        skills: ["Creative thinking", "Problem-solving", "Mentorship"]
    };

    let secondaryMatch = {
        title: "Experiential Designer",
        desc: "A creative hands-on role focused on immersive environments, visual storytelling, and innovative user experiences.",
        why: [
            "Matches well if you enjoy creating and building engaging experiences.",
            "Lets you combine problem-solving with originality and visual thinking.",
            "Supports career growth through project-based creative work."
        ],
        skills: ["Creative work", "Collaboration", "Visual communication"]
    };

    // ---- Heuristic adjustments based on profile ----

    // Strong creative profile
    if (
        enjoys.includes("Creative Work") ||
        enjoys.includes("Building Things")
    ) {
        primaryMatch = {
            title: "Experiential Designer",
            desc: "A creative role focused on building immersive environments and meaningful visual experiences that connect with people.",
            why: [
                "It aligns with your interest in creative work and hands-on execution.",
                "It gives you space to turn ideas into real-world design outcomes.",
                "It supports growth in innovative, experience-driven design fields."
            ],
            skills: ["Creative work", "Building things", "Problem-solving"]
        };

        secondaryMatch = {
            title: "Design Director",
            desc: "A more strategic path where you guide a design team, mentor others, and connect creative work with broader goals.",
            why: [
                "It builds on your creative background while expanding your leadership role.",
                "It suits professionals who want to influence direction, not just execution.",
                "It creates a path toward long-term senior growth."
            ],
            skills: ["Creative thinking", "Leadership", "Mentorship"]
        };
    }

    // Data/strategy-oriented profile
    if (
        enjoys.includes("Data & Analysis") ||
        enjoys.includes("Strategy & Planning")
    ) {
        primaryMatch = {
            title: "Design Strategist",
            desc: "A role that connects research, planning, and creative direction to solve complex business and user problems.",
            why: [
                "It fits your interest in analysis and structured thinking.",
                "It allows you to connect creative decisions to strategy.",
                "It opens pathways into senior and cross-functional roles."
            ],
            skills: ["Strategy & Planning", "Data & Analysis", "Problem-solving"]
        };

        secondaryMatch = {
            title: "UX/UI Design Lead",
            desc: "A role focused on improving digital experiences through research, design systems, and team collaboration.",
            why: [
                "It suits professionals who enjoy structure and user-focused design decisions.",
                "It combines planning, collaboration, and hands-on problem solving.",
                "It has strong growth potential across digital product teams."
            ],
            skills: ["UX thinking", "Collaboration", "Design systems"]
        };
    }

    // Teaching / mentoring profile
    if (enjoys.includes("Teaching & Mentoring")) {
        secondaryMatch = {
            title: "Creative Team Lead",
            desc: "A people-centered role that combines project ownership with team coaching and professional development.",
            why: [
                "It builds on your interest in helping others grow.",
                "It suits professionals who enjoy both creativity and leadership.",
                "It creates a bridge between hands-on work and management."
            ],
            skills: ["Mentorship", "Leadership", "Communication"]
        };
    }

    // Work style influence
    if (workStyle === "Fully Remote") {
        secondaryMatch.why.push("It can align well with flexible and remote-friendly working environments.");
    }

    if (workStyle === "Team-Oriented") {
        primaryMatch.why.push("It benefits from collaboration and shared creative problem-solving.");
    }

    if (workStyle === "Independent") {
        secondaryMatch.why.push("It also allows room for self-directed work and ownership.");
    }

    // Motivation influence
    if (motivation === "High Income") {
        primaryMatch.why.push("It can offer strong earning potential as your responsibility level grows.");
    }

    if (motivation === "Growth & Learning") {
        primaryMatch.why.push("It supports continuous learning and long-term professional development.");
    }

    if (motivation === "Impact & Purpose") {
        secondaryMatch.why.push("It offers opportunities to create work with visible impact and meaning.");
    }

    if (motivation === "Stability & Security") {
        primaryMatch.why.push("It can provide a stable progression path with clear professional milestones.");
    }

    // Experience influence
    if (experience === "entry") {
        primaryMatch.why.push("This path may start with junior-level responsibilities and grow over time.");
    }

    if (experience === "executive") {
        primaryMatch.why.push("Your experience level suggests readiness for strategic and high-responsibility roles.");
    }

    // Keep only first 3–4 bullets for cleaner UI
    primaryMatch.why = primaryMatch.why.slice(0, 3);
    secondaryMatch.why = secondaryMatch.why.slice(0, 3);

    // Save in state
    updateSection("matches", {
        primary: primaryMatch,
        secondary: secondaryMatch
    });

    return getAppState().matches;
}

function renderCareerMatches() {
    const matches = buildCareerMatches();

    if (!matches.primary || !matches.secondary) return;

    // Titles
    document.getElementById("match1-title").textContent = matches.primary.title;
    document.getElementById("match2-title").textContent = matches.secondary.title;

    // Descriptions
    document.getElementById("match1-desc").textContent = matches.primary.desc;
    document.getElementById("match2-desc").textContent = matches.secondary.desc;

    // Why lists
    document.getElementById("match1-why").innerHTML = matches.primary.why
        .map(item => `<li><span class="check">✓</span>${item}</li>`)
        .join("");

    document.getElementById("match2-why").innerHTML = matches.secondary.why
        .map(item => `<li><span class="check">✓</span>${item}</li>`)
        .join("");

    // Skills overlap pills
    document.getElementById("match1-skills").innerHTML = matches.primary.skills
        .map(skill => `<button class="skill-pill" type="button">${skill}</button>`)
        .join("");

    document.getElementById("match2-skills").innerHTML = matches.secondary.skills
        .map(skill => `<button class="skill-pill" type="button">${skill}</button>`)
        .join("");
}

document.addEventListener("DOMContentLoaded", renderCareerMatches);