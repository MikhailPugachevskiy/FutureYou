const ROLE_LIBRARY = [
    {
        id: 6,
        title: "Graphic Designer",
        description: "Create visual content for branding, marketing, and communication.",
        whyItFits: [
            "Perfect for visually creative individuals",
            "Flexible career paths including freelance",
            "Strong alignment with artistic expression"
        ],
        skills: ["visual design", "branding", "design tools"],
        tags: ["Creative Work", "Building Things", "Flexibility & Freedom"]
    },
    {
        id: 2,
        title: "Cloud Engineer",
        description: "Design, deploy, and manage cloud-based systems and services.",
        whyItFits: [
            "Ideal for users interested in cloud technologies",
            "Good match for scalable system thinking",
            "Strong demand and career stability"
        ],
        skills: ["cloud platforms", "infrastructure", "automation"],
        tags: ["Problem Solving", "Stability & Security", "On-Site"]
    },
    {
        id: 1,
        title: "Data Analyst",
        description: "Analyze datasets to extract actionable insights.",
        whyItFits: [
            "Great for analytical and structured thinkers",
            "Turns data into practical decisions",
            "Good entry into data-driven careers"
        ],
        skills: ["Excel", "SQL", "Data Visualization"],
        tags: ["Data & Analysis", "Problem Solving", "Growth & Learning"]
    },
    {
        id: 3,
        title: "UX Designer",
        description: "Design user-friendly digital experiences and interfaces.",
        whyItFits: [
            "Blends creativity with problem solving",
            "Fits people who care about users and usability",
            "Good path for product-focused work"
        ],
        skills: ["wireframing", "user research", "prototyping"],
        tags: ["Creative Work", "Problem Solving", "Impact & Purpose"]
    },
    {
        id: 4,
        title: "Project Coordinator",
        description: "Support planning, timelines, communication, and team execution.",
        whyItFits: [
            "Fits organized people who like structure",
            "Strong connection to collaboration and planning",
            "Useful bridge into operations or project management"
        ],
        skills: ["planning", "coordination", "communication"],
        tags: ["People Management", "Strategy & Planning", "Team-Oriented"]
    },
    {
        id: 5,
        title: "Marketing Specialist",
        description: "Plan and execute campaigns, messaging, and audience engagement.",
        whyItFits: [
            "Great for communication-driven and creative work",
            "Combines strategy with audience understanding",
            "Good for people who enjoy visible impact"
        ],
        skills: ["campaigns", "content", "communication"],
        tags: ["Writing & Communication", "Creative Work", "Impact & Purpose"]
    }
];

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

function hasAny(list = [], targets = []) {
    const normalizedList = list.map(normalize);
    return targets.some((target) => normalizedList.includes(normalize(target)));
}

function scoreRole(profile, role) {
    let score = 0;

    const enjoyTasks = Array.isArray(profile?.enjoyTasks) ? profile.enjoyTasks : [];
    const drainTasks = Array.isArray(profile?.drainTasks) ? profile.drainTasks : [];
    const motivation = profile?.motivation || "";
    const workStyle = profile?.workStyle || "";
    const experienceLevel = profile?.experienceLevel || "";
    const currentRole = normalize(profile?.currentRole || "");
    const concern = normalize(profile?.careerConcern || "");

    if (role.title === "Graphic Designer") {
        if (hasAny(enjoyTasks, ["Creative Work"])) score += 3;
        if (hasAny(enjoyTasks, ["Building Things"])) score += 2;
        if (normalize(motivation) === normalize("Flexibility & Freedom")) score += 2;
        if (normalize(motivation) === normalize("Growth & Learning")) score += 1;
        if (hasAny([workStyle], ["Fully Remote", "Hybrid", "Independent"])) score += 1;

        if (hasAny(drainTasks, ["Data & Analysis"])) score -= 1;
        if (currentRole.includes("teacher")) score += 1;
    }

    if (role.title === "Cloud Engineer") {
        if (hasAny(enjoyTasks, ["Problem Solving", "Data & Analysis"])) score += 2;
        if (hasAny(enjoyTasks, ["Building Things"])) score += 1;
        if (normalize(motivation) === normalize("Stability & Security")) score += 2;
        if (hasAny([workStyle], ["On-Site", "Hybrid", "Team-Oriented"])) score += 1;

        if (hasAny(drainTasks, ["Office Politics", "Being Micromanaged"])) score -= 1;
        if (normalize(motivation) === normalize("Impact & Purpose")) score -= 1;
        if (currentRole.includes("teacher")) score -= 1;
    }

    if (role.title === "Data Analyst") {
        if (hasAny(enjoyTasks, ["Data & Analysis"])) score += 3;
        if (hasAny(enjoyTasks, ["Problem Solving"])) score += 1;
        if (normalize(motivation) === normalize("Growth & Learning")) score += 1;
        if (experienceLevel === "entry") score += 1;
    }


    if (role.title === "UX Designer") {
        if (hasAny(enjoyTasks, ["Creative Work"])) score += 3;
        if (hasAny(enjoyTasks, ["Problem Solving"])) score += 2;
        if (normalize(motivation) === normalize("Impact & Purpose")) score += 2;
        if (normalize(motivation) === normalize("Growth & Learning")) score += 1;
        if (hasAny([workStyle], ["Hybrid", "Team-Oriented"])) score += 1;

        if (currentRole.includes("teacher")) score += 2;
        if (concern.includes("stuck")) score += 1;
        if (concern.includes("direction")) score += 1;
    }

    if (role.title === "Project Coordinator") {
        if (hasAny(enjoyTasks, ["People Management"])) score += 2;
        if (hasAny(enjoyTasks, ["Strategy & Planning"])) score += 1;
        if (hasAny(enjoyTasks, ["Writing & Communication"])) score += 1;
        if (hasAny([workStyle], ["Team-Oriented", "On-Site", "Hybrid"])) score += 1;
        if (normalize(motivation) === normalize("Stability & Security")) score += 1;

        if (currentRole.includes("teacher")) score += 1;
        if (concern.includes("stuck")) score += 1;
    }



    if (role.title === "Marketing Specialist") {
        if (hasAny(enjoyTasks, ["Creative Work", "Writing & Communication"])) score += 3;
        if (normalize(motivation) === normalize("Impact & Purpose")) score += 2;
        if (hasAny([workStyle], ["Hybrid", "Fully Remote"])) score += 1;
    }

    return score;
}

export function getQuickMatches(profile) {
    const ranked = ROLE_LIBRARY
        .map((role) => ({
            ...role,
            score: scoreRole(profile, role)
        }))
        .sort((a, b) => b.score - a.score);

    return {
        primary: ranked[0] || null,
        secondary: ranked[1] || null
    };
}