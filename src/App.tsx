import "./App.css";
import { WorkoutPlan } from "./workout-plan/WorkoutPlan";

const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

// Initial setting of the variable
setViewportHeight();

// Update the variable on resize
window.addEventListener("resize", setViewportHeight);

const App = () => <WorkoutPlan />;

export default App;
