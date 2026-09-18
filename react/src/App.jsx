import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import MatchesPage from "./pages/MatchesPage";
import SkillsPage from "./pages/SkillsPage";
import RoadmapPage from "./pages/RoadmapPage";
import SnapshotPage from "./pages/SnapshotPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/questionnaire" element={<QuestionnairePage />} />
                <Route path="/snapshot" element={<SnapshotPage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

