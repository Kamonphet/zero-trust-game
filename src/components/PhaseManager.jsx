import React, { useEffect } from "react";
import useGameStore from "../store/useGameStore";
import { GAME_PHASES, ASSETS } from "../constants/gameData";
import { useBgm } from "../hooks/useAudio";
import PhaseMainMenu from "./PhaseMainMenu";
import PhaseSetup from "./PhaseSetup";
import PhaseRoleReveal from "./PhaseRoleReveal";
import PhaseScammerTurn from "./PhaseScammerTurn";
import PhaseAdminTurn from "./PhaseAdminTurn";
import PhaseInvestigation from "./PhaseInvestigation";
import PhaseVoting from "./PhaseVoting";
import PhaseResult from "./PhaseResult";
import PhaseQuiz from "./PhaseQuiz";

const LoadingScreen = () => (
  <div className="flex flex-col min-h-screen items-center justify-center bg-slate-950 text-green-400 relative overflow-hidden font-mono">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
    <img
      src={ASSETS.token}
      alt="Loading"
      className="w-24 h-24 sm:w-32 sm:h-32 animate-[spin_3s_linear_infinite] drop-shadow-[0_0_20px_rgba(34,197,94,0.8)] relative z-10"
    />
    <h2 className="mt-8 text-xl md:text-2xl font-black tracking-[0.3em] text-green-500 uppercase animate-pulse relative z-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
      กำลังเข้ารหัสข้อมูล...
    </h2>
  </div>
);

const RESULT_PHASES = [GAME_PHASES.RESULT];
const MENU_PHASES = [GAME_PHASES.MENU];

const PhaseManager = () => {
  const { phase, isLoading, bgmEnabled } = useGameStore();
  const { play, setMuted } = useBgm();

  // ── Start BGM on first user interaction (browser autoplay policy) ──
  useEffect(() => {
    const startBgm = () => {
      if (MENU_PHASES.includes(phase)) play(ASSETS.sounds.main);
      else if (!RESULT_PHASES.includes(phase)) play(ASSETS.sounds.game);
    };

    document.addEventListener("click", startBgm, { once: true });
    document.addEventListener("touchstart", startBgm, { once: true });

    return () => {
      document.removeEventListener("click", startBgm);
      document.removeEventListener("touchstart", startBgm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Manage BGM transitions when phase changes ──
  useEffect(() => {
    if (MENU_PHASES.includes(phase)) {
      play(ASSETS.sounds.main);
    } else if (!RESULT_PHASES.includes(phase)) {
      play(ASSETS.sounds.game);
    }
    // Result SFX is handled in PhaseResult itself
  }, [phase, play]);

  // Mute/unmute BGM when the toggle changes (without interrupting playback)
  useEffect(() => {
    setMuted(!bgmEnabled);
    if (bgmEnabled) {
      // Re-trigger playback if BGM was just re-enabled
      if (MENU_PHASES.includes(phase)) play(ASSETS.sounds.main);
      else if (!RESULT_PHASES.includes(phase)) play(ASSETS.sounds.game);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgmEnabled]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  switch (phase) {
    case GAME_PHASES.MENU:
      return <PhaseMainMenu />;
    case GAME_PHASES.SETUP:
      return <PhaseSetup />;
    case GAME_PHASES.ROLE_REVEAL:
      return <PhaseRoleReveal />;
    case GAME_PHASES.NIGHT_SCAMMER:
      return <PhaseScammerTurn />;
    case GAME_PHASES.NIGHT_ADMIN:
      return <PhaseAdminTurn />;
    case GAME_PHASES.DAY_INVESTIGATION:
      return <PhaseInvestigation />;
    case GAME_PHASES.VOTING:
      return <PhaseVoting />;
    case GAME_PHASES.RESULT:
      return <PhaseResult />;
    case GAME_PHASES.QUIZ:
      return <PhaseQuiz />;
    default:
      return (
        <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
          <h1 className="text-2xl font-mono">
            Error: Phase "{phase}" mapping collapsed.
          </h1>
        </div>
      );
  }
};

export default PhaseManager;
