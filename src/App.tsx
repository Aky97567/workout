import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WorkoutPlan } from ".//workout-plan";
import { AuthProvider } from "./features";
import { Portal } from "./features";
import "./App.css";

const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setViewportHeight();
window.addEventListener("resize", setViewportHeight);

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/workout">
        <Routes>
          <Route path="/portal" element={<Portal />} />
          <Route path="/" element={<WorkoutPlan />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
