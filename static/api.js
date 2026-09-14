function mapProfileToBackendPayload(profile) {
    return {
        currentRole: profile.currentRole || "",
        interests: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks : [],
        level: profile.experienceLevel || "",
        goals: profile.motivation || "",

        // new edited
        workStyle: profile.workStyle || "",
        careerConcern: profile.careerConcern || "",

        skills: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks : []
    };
}

async function generateCareerPath() {
    const state = window.getAppState();
    const profile = state.profile || {};
    const payload = mapProfileToBackendPayload(profile);

    try {
        const response = await fetch("http://localhost:3000/api/careerpath", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Backend validation error:", data);
            alert(data?.error || "Backend request failed.");
            return null;
        }

        console.log("Career path response:", JSON.stringify(data, null, 2));

        if (data.matches) {
            window.updateSection("matches", data.matches);
        }

        if (data.skillAnalysis) {
            window.updateSection("skillAnalysis", data.skillAnalysis);
        }

        if (data.roadmap) {
            window.updateSection("roadmap", data.roadmap);
        }

        return data;

    } catch (error) {
        console.error("Request to /api/careerpath failed:", error);
        alert("Backend request failed. Check console / backend logs.");
        return null;
    }
}

window.generateCareerPath = generateCareerPath;