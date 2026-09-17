import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#f5f5fb",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    maxWidth: "760px",
                    width: "100%",
                    textAlign: "center"
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        borderRadius: "999px",
                        background: "#ecebff",
                        color: "#6c63ff",
                        fontWeight: 600,
                        fontSize: "14px",
                        marginBottom: "24px"
                    }}
                >
                    FutureYou
                </div>

                <h1
                    style={{
                        fontSize: "56px",
                        lineHeight: 1.1,
                        margin: "0 0 20px",
                        color: "#111827"
                    }}
                >
                    Find your next
                    <br />
                    career steps
                </h1>

                <p
                    style={{
                        fontSize: "20px",
                        lineHeight: 1.6,
                        color: "#6b7280",
                        maxWidth: "680px",
                        margin: "0 auto 32px"
                    }}
                >
                    FutureYou analyzes your skills, values, and experience to reveal
                    career paths you&apos;ll need — plus a roadmap to get there.
                </p>

                <button
                    onClick={() => navigate("/questionnaire")}
                    style={{
                        padding: "16px 32px",
                        borderRadius: "14px",
                        border: "none",
                        background: "#6c63ff",
                        color: "white",
                        fontSize: "18px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 10px 30px rgba(108, 99, 255, 0.25)",
                        marginBottom: "18px"
                    }}
                >
                    Start Now
                </button>

                <div
                    style={{
                        color: "#9ca3af",
                        fontSize: "14px",
                        marginBottom: "64px"
                    }}
                >
                    Free &nbsp;|&nbsp; Takes 3 minutes &nbsp;|&nbsp; No signup required
                </div>

                <section>
                    <h2
                        style={{
                            fontSize: "36px",
                            marginBottom: "32px",
                            color: "#111827"
                        }}
                    >
                        How it works
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "20px"
                        }}
                    >
                        <article
                            style={{
                                background: "white",
                                borderRadius: "20px",
                                padding: "24px",
                                textAlign: "left",
                                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)"
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "12px",
                                    background: "#ecebff",
                                    color: "#6c63ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    marginBottom: "16px"
                                }}
                            >
                                1
                            </div>
                            <h3 style={{ margin: "0 0 12px", fontSize: "20px" }}>
                                Get Started
                            </h3>
                            <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6 }}>
                                Answer a few questions about your experience, skills,
                                and goals.
                            </p>
                        </article>

                        <article
                            style={{
                                background: "white",
                                borderRadius: "20px",
                                padding: "24px",
                                textAlign: "left",
                                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)"
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "12px",
                                    background: "#ecebff",
                                    color: "#6c63ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    marginBottom: "16px"
                                }}
                            >
                                2
                            </div>
                            <h3 style={{ margin: "0 0 12px", fontSize: "20px" }}>
                                Career Match
                            </h3>
                            <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6 }}>
                                We analyze your input to identify suitable career paths.
                            </p>
                        </article>

                        <article
                            style={{
                                background: "white",
                                borderRadius: "20px",
                                padding: "24px",
                                textAlign: "left",
                                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)"
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "12px",
                                    background: "#ecebff",
                                    color: "#6c63ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    marginBottom: "16px"
                                }}
                            >
                                3
                            </div>
                            <h3 style={{ margin: "0 0 12px", fontSize: "20px" }}>
                                Next Steps
                            </h3>
                            <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6 }}>
                                Get clear guidance on skills to build and actions to take.
                            </p>
                        </article>
                    </div>
                </section>
            </div>
        </main>
    );
}