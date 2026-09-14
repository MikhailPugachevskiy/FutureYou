// =========================
// STEP 5 SKILL ANALYSIS
// using app-state.js
// =========================

function buildSkillAnalysis() {
    const state = getAppState();
    const profile = state.profile;
    const matches = state.matches;

    const enjoys = profile.enjoyTasks || [];
    const drains = profile.drainTasks || [];
    const experience = profile.experienceLevel || "";
    const motivation = profile.motivation || "";
    const currentRole = profile.currentRole || "";

    const targetRole =
        matches?.primary?.title || "Design Director";

    let skillsHave = [];
    let skillsBuild = [];

    // Base rules from interests
    if (enjoys.includes("Creative Work")) {
        skillsHave.push({ name: "Creative Thinking", level: "strong" });
    }

    if (enjoys.includes("Problem Solving")) {
        skillsHave.push({ name: "Problem Solving", level: "strong" });
    }

    if (enjoys.includes("Teaching & Mentoring")) {
        skillsHave.push({ name: "Mentorship", level: "strong" });
    }

    if (enjoys.includes("Building Things")) {
        skillsHave.push({ name: "Hands-on Execution", level: "moderate" });
    }

    if (enjoys.includes("Strategy & Planning")) {
        skillsHave.push({ name: "Strategic Thinking", level: "moderate" });
    }

    if (enjoys.includes("People Management")) {
        skillsHave.push({ name: "Collaboration", level: "strong" });
    }

    if (enjoys.includes("Writing & Communication")) {
        skillsHave.push({ name: "Communication", level: "strong" });
    }

    if (enjoys.includes("Data & Analysis")) {
        skillsHave.push({ name: "Analytical Thinking", level: "moderate" });
    }

    // Experience-based additions
    if (experience === "senior" || experience === "executive") {
        skillsHave.push({ name: "Project Management", level: "moderate" });
    }

    if (experience === "executive") {
        skillsHave.push({ name: "Leadership Readiness", level: "strong" });
    }

    // Current role hint
    if (currentRole) {
        skillsHave.push({ name: `Experience in ${currentRole}`, level: "moderate" });
    }

    // Build-next logic from career direction
    if (targetRole === "Design Director") {
        skillsBuild = [
            {
                name: "Strategic Planning",
                priority: "high",
                description:
                    "Develop a stronger long-term vision for projects and connect design decisions to business goals."
            },
            {
                name: "Leadership",
                priority: "high",
                description:
                    "Grow your ability to guide teams, delegate effectively, and create alignment across stakeholders."
            },
            {
                name: "Budget Management",
                priority: "medium",
                description:
                    "Learn how to manage project budgets, priorities, and resource trade-offs."
            },
            {
                name: "Client Management",
                priority: "medium",
                description:
                    "Strengthen your ability to manage expectations and communicate value to clients or stakeholders."
            },
            {
                name: "UX/UI Design Principles",
                priority: "low",
                description:
                    "Deepen your understanding of digital product thinking to broaden your strategic design perspective."
            }
        ];
    } else if (targetRole === "Experiential Designer") {
        skillsBuild = [
            {
                name: "Spatial Design Thinking",
                priority: "high",
                description:
                    "Build confidence in designing physical or immersive user environments."
            },
            {
                name: "Concept Development",
                priority: "high",
                description:
                    "Improve your ability to turn abstract ideas into clear experience concepts."
            },
            {
                name: "Cross-functional Collaboration",
                priority: "medium",
                description:
                    "Work more effectively with production, strategy, and technical teams."
            },
            {
                name: "Presentation Skills",
                priority: "medium",
                description:
                    "Communicate experiential ideas clearly to teams and stakeholders."
            },
            {
                name: "Emerging Tools & Technologies",
                priority: "low",
                description:
                    "Explore tools that support immersive or interactive experiences."
            }
        ];
    } else if (targetRole === "Design Strategist") {
        skillsBuild = [
            {
                name: "Business Strategy",
                priority: "high",
                description:
                    "Strengthen your ability to connect design recommendations with business priorities."
            },
            {
                name: "Research Synthesis",
                priority: "high",
                description:
                    "Turn research and insights into strategic recommendations and frameworks."
            },
            {
                name: "Stakeholder Alignment",
                priority: "medium",
                description:
                    "Improve communication and decision-making across teams and leadership."
            },
            {
                name: "Data Storytelling",
                priority: "medium",
                description:
                    "Use insight and evidence more clearly in presentations and strategy work."
            },
            {
                name: "Facilitation",
                priority: "low",
                description:
                    "Guide workshops and collaborative sessions more effectively."
            }
        ];
    } else {
        skillsBuild = [
            {
                name: "Leadership",
                priority: "high",
                description:
                    "Develop stronger ownership and decision-making skills."
            },
            {
                name: "Strategic Thinking",
                priority: "high",
                description:
                    "Learn to connect your daily work to bigger goals and long-term outcomes."
            },
            {
                name: "Communication",
                priority: "medium",
                description:
                    "Improve how you present ideas and align with others."
            },
            {
                name: "Adaptability",
                priority: "medium",
                description:
                    "Build flexibility for changing roles, tools, and work environments."
            },
            {
                name: "Specialization",
                priority: "low",
                description:
                    "Deepen one area of expertise to stand out more clearly."
            }
        ];
    }

    // Adjustments from motivation
    if (motivation === "High Income") {
        skillsBuild.unshift({
            name: "Commercial Awareness",
            priority: "high",
            description:
                "Understand how your work creates measurable value and supports business growth."
        });
    }

    if (motivation === "Growth & Learning") {
        skillsBuild.push({
            name: "Continuous Learning",
            priority: "medium",
            description:
                "Build habits and systems that help you learn efficiently over time."
        });
    }

    // Adjustments from drains
    if (drains.includes("Public Speaking")) {
        skillsBuild.push({
            name: "Confidence in Presentation",
            priority: "low",
            description:
                "Improve comfort when communicating ideas in front of others."
        });
    }

    // Remove duplicates from skillsHave by name
    skillsHave = skillsHave.filter(
        (skill, index, self) =>
            index === self.findIndex(s => s.name === skill.name)
    );

    updateSection("skillAnalysis", {
        have: skillsHave,
        build: skillsBuild
    });

    return getAppState().skillAnalysis;
}

function renderSkillAnalysis() {
    const state = getAppState();
    const analysis = buildSkillAnalysis();

    const targetRoleEl = document.getElementById("target-role");
    if (targetRoleEl && state.matches?.primary?.title) {
        targetRoleEl.textContent = state.matches.primary.title;
    }

    const haveList = document.getElementById("skills-have-list");
    const buildList = document.getElementById("skills-build-list");

    if (haveList) {
        haveList.innerHTML = analysis.have
            .map(skill => `
        <div class="skill-row">
          <div class="skill-left">
            <span class="row-ico ok">✓</span>
            <div>
              <h3>${skill.name}</h3>
            </div>
          </div>
          <span class="tag ${skill.level}">${skill.level}</span>
        </div>
      `)
            .join("");
    }

    if (buildList) {
        buildList.innerHTML = analysis.build
            .map(skill => `
        <div class="skill-card">
          <div class="skill-card-top">
            <div class="skill-card-title">
              <span class="row-ico up">↗</span>
              <h3>${skill.name}</h3>
            </div>
            <span class="tag ${skill.priority}">${skill.priority} priority</span>
          </div>
          <p>${skill.description}</p>
        </div>
      `)
            .join("");
    }
}

document.addEventListener("DOMContentLoaded", renderSkillAnalysis);