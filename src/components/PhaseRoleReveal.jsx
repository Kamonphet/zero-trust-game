import React, { useState } from "react";
import useGameStore from "../store/useGameStore";
import { GAME_PHASES, ROLES, ASSETS } from "../constants/gameData";
import { Eye, EyeOff, ShieldAlert, User, Bug } from "lucide-react";

const PhaseRoleReveal = () => {
  const {
    players,
    turnIndex,
    nextTurn,
    resetTurn,
    setPhase,
    setRolesDistributed,
  } = useGameStore();
  const [isRevealed, setIsRevealed] = useState(false);

  // Fallback if players empty
  if (!players || players.length === 0) {
    return <div className="text-white p-4">Error: No players found.</div>;
  }

  const currentPlayer = players[turnIndex];

  const handleNext = () => {
    setIsRevealed(false);

    if (turnIndex + 1 < players.length) {
      nextTurn();
    } else {
      setRolesDistributed(true);
      resetTurn(); // Reset so Scammer Phase starts clean
      setPhase(GAME_PHASES.NIGHT_SCAMMER);
    }
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return {
          title: "แอดมินผู้เถรตรง (ADMIN)",
          desc: "เป้าหมายของคุณคือการชี้นำผู้ใช้งานไปยังมิจฉาชีพโดยใช้เบาะแสที่มี",
          icon: <ShieldAlert className="w-16 h-16 text-blue-500 mb-2" />,
          color: "text-blue-500",
          bg: "bg-blue-500/10 border-blue-500",
        };
      case ROLES.SCAMMER:
        return {
          title: "มิจฉาชีพ (SCAMMER)",
          desc: "เป้าหมายของคุณคือการหลีกเลี่ยงการตรวจจับโดยการเลือกหลักฐานและวิธีการโจมตี ทำให้ผู้ใช้สับสน",
          icon: <Bug className="w-16 h-16 text-red-500 mb-2" />,
          color: "text-red-500",
          bg: "bg-red-500/10 border-red-500",
        };
      case ROLES.USER:
      default:
        return {
          title: "ผู้ใช้งานใสซื่อ (USER)",
          desc: "วิเคราะห์เบาะแสของแอดมินเพื่อเดาตัวตนของมิจฉาชีพ หลักฐาน และวิธีการโจมตีได้อย่างถูกต้อง",
          icon: <User className="w-16 h-16 text-green-500 mb-2" />,
          color: "text-green-500",
          bg: "bg-green-500/10 border-green-500",
        };
    }
  };

  // Map role to correct role image
  const getRoleImage = (role, playerIndex) => {
    if (role === ROLES.ADMIN) return ASSETS.roles.ADMIN;
    if (role === ROLES.SCAMMER)
      return ASSETS.roles.SCAMMER[playerIndex % ASSETS.roles.SCAMMER.length];
    return ASSETS.roles.USER[playerIndex % ASSETS.roles.USER.length];
  };

  const roleInfo = getRoleInfo(currentPlayer.role);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-slate-100 font-mono relative">
      {/* Grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="max-w-md w-full flex flex-col items-center gap-6 z-10 animate-fade-in-up">
        <div className="text-center w-full">
          <p className="text-xl tracking-[0.3em] text-white font-bold uppercase mb-2">
            ส่งต่อให้
          </p>
          <h2 className="text-4xl font-bold text-green-400 tracking-wider bg-slate-900 border border-green-500/30 py-4 px-8 w-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            {currentPlayer.name}
          </h2>
        </div>

        {!isRevealed ? (
          <div className="flex flex-col items-center w-full mt-8 animate-fade-in-up">
            <div className="bg-red-950/30 border border-red-500/50 p-6 rounded-sm mb-8 text-center w-full">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3 animate-pulse" />
              <h3 className="text-xl font-bold text-red-400 mb-1">WARNING</h3>
              <p className="text-sm text-red-300">
                อย่าให้ผู้เล่นคนอื่นเห็นการ์ดบทบาทเรานะ
                <br />
                (Do not let other players see your role card)
              </p>
            </div>

            <button
              onClick={() => setIsRevealed(true)}
              className="group relative flex items-center justify-center gap-3 w-full border-2 border-green-500 bg-green-500/10 hover:bg-green-500 hover:text-slate-900 py-6 px-6 font-bold text-xl uppercase tracking-widest transition-all"
            >
              <Eye className="w-6 h-6" />
              เปิดดูบทบาท
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full mt-4 animate-pop">
            <div
              className={`flex flex-col items-center w-full border-2 p-6 mb-6 ${roleInfo.bg}`}
            >
              <img
                src={getRoleImage(currentPlayer.role, turnIndex)}
                alt={roleInfo.title}
                className="w-40 h-40 object-cover mb-4 border border-current opacity-90"
              />
              {roleInfo.icon}
              <h3
                className={`text-2xl font-bold mb-4 uppercase text-center ${roleInfo.color}`}
              >
                {roleInfo.title}
              </h3>
              <p className="text-center text-slate-300 text-sm leading-relaxed">
                {roleInfo.desc}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-3 w-full border border-slate-600 bg-slate-800 hover:bg-slate-700 py-4 px-6 font-bold text-lg uppercase tracking-wider transition-all"
            >
              <EyeOff className="w-6 h-6 text-slate-400" />
              ซ่อนแล้วส่งต่อ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseRoleReveal;
