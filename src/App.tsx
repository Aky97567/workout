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
      <Portal />
    </AuthProvider>
  );
};

export default App;
