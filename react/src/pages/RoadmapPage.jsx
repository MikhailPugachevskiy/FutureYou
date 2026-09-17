import LearningRoadmap from "../components/LearningRoadmap";
import { loadAppState } from "../utils/loadAppState";

export default function RoadmapPage() {
    const appState = loadAppState();
    return <LearningRoadmap appState={appState} />;
}