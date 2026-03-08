import React, { useState, useEffect } from "react";
import PhaseManager from "./components/PhaseManager";
import "./index.css"; // Import Tailwind CSS v4

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-green-500/30">
      {/* Interactive Cursor Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34,197,94,0.08), transparent 80%)`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full min-h-screen">
        <PhaseManager />
      </div>
    </div>
  );
}

export default App;
