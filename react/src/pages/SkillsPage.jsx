import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SkillAnalysis from "../components/SkillAnalysis";
import { loadAppState } from "../utils/loadAppState";
function formatSkillLabel(value) {
    if (!value) return "";

    return String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
export default function SkillsPage() {
    const navigate = useNavigate();

    const appState = loadAppState();

    const fallbackData = {
        targetRole: "Design Director",
        have: [
            { name: "Creative Thinking", level: "strong" },
            { name: "Problem Solving", level: "strong" },
            { name: "Mentorship", level: "strong" }
        ],
        build: [
            {
                name: "Strategic Planning",
                priority: "high",
                description:
                    "Develop a stronger long-term vision and connect design decisions to business goals."
            },
            {
                name: "Leadership",
                priority: "high",
                description:
                    "Grow your ability to guide teams and create alignment across stakeholders."
            },
            {
                name: "Budget Management",
                priority: "medium",
                description:
                    "Learn how to manage project budgets and priorities."
            }
        ]
    };

    const pageData = useMemo(() => {
        const targetRole =
            appState?.matches?.primary?.title ||
            appState?.matches?.primary?.currentRole ||
            fallbackData.targetRole;

        const rawHave = Array.isArray(appState?.skillAnalysis?.have)
            ? appState.skillAnalysis.have
            : [];

        const rawBuild = Array.isArray(appState?.skillAnalysis?.build)
            ? appState.skillAnalysis.build
            : [];

        const hasRealSkillData = rawHave.length > 0 || rawBuild.length > 0;

        if (!hasRealSkillData) {
            return {
                targetRole,
                have: fallbackData.have,
                build: fallbackData.build
            };
        }

        const normalizedHave = rawHave.map((item, index) => {
            const backendScore =
                typeof item?.score === "number" ? item.score : null;

            let derivedLevel = "moderate";

            if (backendScore !== null) {
                if (backendScore >= 0.6) {
                    derivedLevel = "strong";
                } else if (backendScore >= 0.35) {
                    derivedLevel = "moderate";
                } else {
                    derivedLevel = "emerging";
                }
            }

            return {
                name:
                    formatSkillLabel(item?.name) ||
                    formatSkillLabel(item?.essential_skill) ||
                    `Skill ${index + 1}`,
                level: item?.level || derivedLevel
            };
        });

        const normalizedBuild = rawBuild.map((item, index) => {
            const backendScore =
                typeof item?.score === "number" ? item.score : null;

            let derivedPriority = "medium";

            if (backendScore !== null) {
                if (backendScore >= 0.3) {
                    derivedPriority = "high";
                } else if (backendScore >= 0.18) {
                    derivedPriority = "medium";
                } else {
                    derivedPriority = "low";
                }
            }

            const skillName =
                formatSkillLabel(item?.name) ||
                formatSkillLabel(item?.essential_skill) ||
                `Next Skill ${index + 1}`;

            return {
                name: skillName,
                priority: item?.priority || derivedPriority,
                description:
                    item?.description ||
                    `Develop stronger capability in ${skillName} for your target role.`
            };
        });

        return {
            targetRole,
            have: normalizedHave,
            build: normalizedBuild
        };
    }, [appState]);

    return (
        <>
            <SkillAnalysis
                targetRole={pageData.targetRole}
                skillsHave={pageData.have}
                skillsBuild={pageData.build}
            />

            <div style={{ textAlign: "center", margin: "24px 0 48px" }}>
                <button
                    onClick={() => navigate("/roadmap")}
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
                    Continue to roadmap →
                </button>
            </div>
        </>
    );
}