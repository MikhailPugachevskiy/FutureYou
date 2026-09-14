// =========================
// STEP 6 ROADMAP
// using app-state.js
// =========================

function buildRoadmap() {
    const state = getAppState();
    const matchTitle = state.matches?.primary?.title || "your next role";
    const skillsToBuild = state.skillAnalysis?.build || [];

    const topSkills = skillsToBuild.slice(0, 4);

    const roadmapSteps = [
        {
            title: "Week 1–2: Build the foundation",
            description: topSkills[0]
                ? `Start with ${topSkills[0].name}. ${topSkills[0].description}`
                : "Start by building the most important missing skill for your target role."
        },
        {
            title: "Week 3–4: Practice through a mini project",
            description: topSkills[1]
                ? `Apply ${topSkills[1].name} in a small real-world or portfolio project.`
                : "Apply what you learned through a small portfolio or practice project."
        },
        {
            title: "Week 5–6: Strengthen collaboration and communication",
            description: topSkills[2]
                ? `Focus on ${topSkills[2].name} and improve how you present your work and decisions.`
                : "Strengthen the way you communicate your work and collaborate with others."
        },
        {
            title: "Week 7+: Prepare for the next move",
            description: topSkills[3]
                ? `Build confidence in ${topSkills[3].name} and prepare for interviews, applications, or internal progression.`
                : "Prepare for your next step with portfolio improvements, applications, or internal opportunities."
        }
    ];

    updateSection("roadmap", {
        title: matchTitle,
        saved: false,
        steps: roadmapSteps
    });

    return getAppState().roadmap;
}

function renderRoadmap() {
    const roadmap = buildRoadmap();

    const titleEl = document.getElementById("roadmap-role");
    const subtitleEl = document.getElementById("roadmap-subtitle");
    const contentEl = document.getElementById("roadmap-content");

    if (titleEl) {
        titleEl.textContent = roadmap.title || "your next role";
    }

    if (subtitleEl) {
        subtitleEl.textContent =
            `A week-by-week plan to help you move toward ${roadmap.title || "your next role"}.`;
    }

    if (contentEl && roadmap.steps) {
        contentEl.innerHTML = roadmap.steps
            .map(
                (step) => `
          <article class="roadmap-step">
            <h3>${step.title}</h3>
            <p>${step.description}</p>
          </article>
        `
            )
            .join("");
    }
}

function saveRoadmapPlan() {
    const state = getAppState();
    updateSection("roadmap", {
        ...state.roadmap,
        saved: true
    });

    alert("Your plan has been saved.");
}

// ---------- PDF DOWNLOAD ----------

function splitText(doc, text, maxWidth) {
    return doc.splitTextToSize(text, maxWidth);
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 7) {
    const lines = splitText(doc, text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
}

function downloadRoadmapPDF() {
    const state = getAppState();
    const roadmap = state.roadmap || {};
    const profile = state.profile || {};

    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF library could not be loaded.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("FutureYou", margin, y);

    y += 10;

    doc.setFontSize(18);
    doc.text("Learning Roadmap", margin, y);

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    y = addWrappedText(
        doc,
        `Target role: ${roadmap.title || "your next role"}`,
        margin,
        y,
        contentWidth
    );

    y += 4;

    // Profile summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Profile Summary", margin, y);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const profileLines = [
        `Current role: ${profile.currentRole || "Not provided"}`,
        `Experience level: ${profile.experienceLevel || "Not provided"}`,
        `Motivation: ${profile.motivation || "Not provided"}`,
        `Work style: ${profile.workStyle || "Not provided"}`
    ];

    profileLines.forEach((line) => {
        y = addWrappedText(doc, line, margin, y, contentWidth, 6);
    });

    y += 6;

    // Roadmap steps
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Your Roadmap", margin, y);

    y += 8;

    const steps = roadmap.steps || [];

    steps.forEach((step, index) => {
        if (y > pageHeight - 35) {
            doc.addPage();
            y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        y = addWrappedText(doc, `${index + 1}. ${step.title}`, margin, y, contentWidth, 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        y = addWrappedText(doc, step.description, margin + 4, y + 1, contentWidth - 4, 6);

        y += 4;
    });

    // Skill gaps
    const skillBuild = state.skillAnalysis?.build || [];

    if (skillBuild.length > 0) {
        if (y > pageHeight - 50) {
            doc.addPage();
            y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Skills To Build Next", margin, y);

        y += 8;

        skillBuild.forEach((skill) => {
            if (y > pageHeight - 25) {
                doc.addPage();
                y = 20;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            y = addWrappedText(doc, `• ${skill.name} (${skill.priority} priority)`, margin, y, contentWidth, 6);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            y = addWrappedText(doc, skill.description, margin + 4, y, contentWidth - 4, 5.5);

            y += 3;
        });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(
            `Generated by FutureYou • Page ${i} of ${pageCount}`,
            margin,
            pageHeight - 10
        );
    }

    const safeTitle = (roadmap.title || "career-roadmap")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    doc.save(`futureyou-roadmap-${safeTitle}.pdf`);
}

document.addEventListener("DOMContentLoaded", () => {
    renderRoadmap();

    const saveBtn = document.getElementById("savePlanBtn");
    const pdfBtn = document.getElementById("downloadPdfBtn");

    if (saveBtn) {
        saveBtn.addEventListener("click", saveRoadmapPlan);
    }

    if (pdfBtn) {
        pdfBtn.addEventListener("click", downloadRoadmapPDF);
    }
});