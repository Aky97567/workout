import { useState, useEffect } from "react";

export const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    // Function to update window height state
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };

    // Add event listener to update height on resize
    window.addEventListener("resize", updateWindowHeight);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateWindowHeight);
    };
  }, []); // Empty dependency array means it runs only on mount and unmount

  return windowHeight;
};

export default useWindowHeight;
