import React, { useState } from "react";
import useGameStore from "../store/useGameStore";
import {
  GAME_PHASES,
  ROLES,
  MIN_PLAYERS,
  MAX_PLAYERS,
  ASSETS,
} from "../constants/gameData";
import { Users, UserPlus, Play } from "lucide-react";
import { useSfx } from "../hooks/useAudio";

const PhaseSetup = () => {
  const setPhase = useGameStore((state) => state.setPhase);
  const setPlayers = useGameStore((state) => state.setPlayers);
  const { play: playSfx } = useSfx();

  const [playerCount, setPlayerCount] = useState(MIN_PLAYERS);
  const [playerNames, setPlayerNames] = useState(Array(MAX_PLAYERS).fill(""));

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const activeNames = playerNames.slice(0, playerCount);
    if (activeNames.some((name) => name.trim() === "")) {
      alert("กรุณาใส่ชื่อผู้เล่นให้ครบทุกคน");
      return;
    }

    const numScammers = playerCount >= 7 ? 2 : 1;
    const numAdmins = 1;
    const numUsers = playerCount - numScammers - numAdmins;

    let rolePool = [
      ...Array(numScammers).fill(ROLES.SCAMMER),
      ...Array(numAdmins).fill(ROLES.ADMIN),
      ...Array(numUsers).fill(ROLES.USER),
    ];

    for (let i = rolePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rolePool[i], rolePool[j]] = [rolePool[j], rolePool[i]];
    }

    const newPlayers = activeNames.map((name, idx) => ({
      id: `p${idx}`,
      name: name.trim() || `ผู้เล่น ${idx + 1}`,
      role: rolePool[idx],
      hasVoted: false,
    }));

    setPlayers(newPlayers);
    setPhase(GAME_PHASES.ROLE_REVEAL);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 p-6 text-green-400 font-mono relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-md w-full flex flex-col gap-5 mt-8 z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="h-px flex-1 bg-green-500/30" />
            <Users className="w-6 h-6 text-green-500" />
            <div className="h-px flex-1 bg-green-500/30" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
            ตั้งค่าผู้เล่น
          </h2>
          <p className="text-xs text-slate-500 tracking-widest mt-1">
            SYSTEM INITIALIZATION
          </p>
        </div>

        {/* Player count */}
        <div className="bg-slate-900 border border-green-500/20 p-4 flex flex-col gap-3">
          <label className="text-xs tracking-widest text-green-500/70 uppercase">
            จำนวนผู้เล่น
          </label>
          <div className="flex gap-2">
            {[5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => {
                  playSfx(ASSETS.sounds.click);
                  setPlayerCount(num);
                }}
                className={`flex-1 py-3 text-lg font-bold transition-all border ${
                  playerCount === num
                    ? "bg-green-500 text-slate-900 border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:border-green-500/50 hover:text-green-400"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {playerCount >= 7
              ? "1 ผู้ดูแลระบบ · 2 มิจฉาชีพ · "
              : "1 ผู้ดูแลระบบ · 1 มิจฉาชีพ · "}
            {playerCount - (playerCount >= 7 ? 3 : 2)} ผู้ใช้งาน
          </p>
        </div>

        {/* Player names */}
        <div className="bg-slate-900 border border-green-500/20 p-4 flex flex-col gap-3">
          <label className="text-xs tracking-widest text-green-500/70 uppercase">
            ชื่อผู้เล่น
          </label>
          <div className="flex flex-col gap-2 mt-1">
            {Array.from({ length: playerCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <span className="text-xs text-slate-600 w-6 text-right shrink-0">
                  {i + 1}.
                </span>
                <div className="relative flex-1">
                  <UserPlus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    placeholder={`ผู้เล่น ${i + 1}...`}
                    value={playerNames[i]}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-green-300 pl-10 pr-3 py-2 w-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 placeholder-slate-700 transition-all font-sans text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            playSfx(ASSETS.sounds.click);
            handleStart();
          }}
          className="mt-2 flex items-center justify-center gap-3 w-full border-2 border-green-500 bg-green-500 text-white hover:bg-green-400 py-4 px-6 font-bold text-lg uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
        >
          <Play className="w-5 h-5 " />
          เชื่อมต่อและเริ่มต้น
        </button>

        <button
          onClick={() => {
            playSfx(ASSETS.sounds.click);
            setPhase(GAME_PHASES.MENU);
          }}
          className="text-red-400 hover:text-red-500 text-md font-bold tracking-widest uppercase transition-colors pb-4"
        >
          ← ยกเลิกและกลับ
        </button>
      </div>
    </div>
  );
};

export default PhaseSetup;
