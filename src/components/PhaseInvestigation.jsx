import React, { useState } from "react";
import useGameStore from "../store/useGameStore";
import { GAME_PHASES, CLUE_CARDS, ASSETS } from "../constants/gameData";
import { Search, BrainCircuit } from "lucide-react";
import { useSfx } from "../hooks/useAudio";

// Helper to shuffle cards
const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

const PhaseInvestigation = () => {
  const { players, scammerChoices, setPhase, addClue, resetTurn } =
    useGameStore();
  const { play: playSfx } = useSfx();
  const handleClick = (fn) => {
    playSfx(ASSETS.sounds.click);
    fn();
  };
  const [activeTab, setActiveTab] = useState("ADMIN"); // Force Admin first
  const [clueTokens, setClueTokens] = useState({}); // { cardId: optionIndex }

  // Random 3 clue cards for the Admin to use
  const [randomClues] = useState(() => shuffleArray(CLUE_CARDS).slice(0, 3));

  const victim = players.find((p) => p.id === scammerChoices.victimId);

  // Admin Token Placement
  const handlePlaceToken = (cardId, optionIndex) => {
    setClueTokens({ ...clueTokens, [cardId]: optionIndex });
  };

  // Transition to Voting
  const handleProceedToVote = () => {
    // Save clues to global store
    Object.entries(clueTokens).forEach(([cardId, optionIndex]) => {
      addClue({ clueCardId: cardId, selectedOptionIndex: optionIndex });
    });
    resetTurn(); // Reset turnIndex to 0 before voting starts
    setPhase(GAME_PHASES.VOTING);
  };

  const isSetupComplete = Object.keys(clueTokens).length === 3;

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 text-slate-100 font-mono relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Top Navigation Tabs */}
      <div className="w-full bg-slate-900 border-b border-slate-800 flex sticky top-0 z-10 shadow-lg">
        <button
          onClick={() => setActiveTab("PUBLIC")}
          className={`flex-1 py-4 font-black tracking-widest uppercase transition-all flex justify-center items-center gap-3 ${
            activeTab === "PUBLIC"
              ? "text-purple-400 border-b-2 border-purple-500 bg-slate-800/80 shadow-[inset_0_-4px_10px_rgba(168,85,247,0.1)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Search className="w-5 h-5" />
          มุมมองผู้เล่น
        </button>
        <button
          onClick={() => handleClick(() => setActiveTab("ADMIN"))}
          className={`flex-1 py-4 font-black tracking-widest uppercase transition-all flex justify-center items-center gap-3 ${
            activeTab === "ADMIN"
              ? "text-blue-400 border-b-2 border-blue-500 bg-slate-800/80 shadow-[inset_0_-4px_10px_rgba(59,130,246,0.1)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <BrainCircuit className="w-5 h-5" />
          การตั้งค่าเบาะแส (Admin)
        </button>
      </div>

      <div className="w-full max-w-5xl p-6 pb-24 z-10">
        {/* ===================== PUBLIC VIEW ===================== */}
        {activeTab === "PUBLIC" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-purple-500/30 p-8 text-center shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

              <h2 className="text-2xl text-purple-400 font-black tracking-widest mb-3 uppercase drop-shadow-md">
                แจ้งเตือนการโจมตีทางไซเบอร์!
              </h2>
              <p className="text-slate-300 mb-6 font-bold tracking-wider">
                ได้รับรายงานการแทรกซึมระบบ... ผู้ใช้งานที่ตกเป็นเหยื่อคือ:
              </p>
              <div className="inline-block bg-slate-950 border border-slate-700 px-10 py-4 text-3xl font-black tracking-[0.2em] text-purple-300 shadow-inner">
                {victim ? victim.name : "Unknown"}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest mb-6 border-b-2 border-slate-800 pb-3 flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-500 inline-block" />
                เบาะแสจาก Admin
              </h3>

              {Object.keys(clueTokens).length < 3 ? (
                <div className="bg-slate-900 border border-slate-800 border-dashed p-10 text-center font-bold tracking-widest text-slate-500 uppercase flex flex-col items-center gap-4">
                  <Search className="w-12 h-12 text-slate-700 animate-pulse" />
                  รอ Admin เลือกเบาะแสให้ครบ...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(clueTokens).map(([cardId, optionIndex]) => {
                    const card = randomClues.find((c) => c.id === cardId);
                    if (!card) return null; // Fallback
                    return (
                      <div
                        key={cardId}
                        className="bg-slate-900 border border-slate-700 overflow-hidden relative group shadow-xl hover:border-purple-500/50 transition-colors"
                      >
                        {card.image && (
                          <div className="relative h-32 w-full">
                            <img
                              src={card.image}
                              alt={card.category}
                              className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                          </div>
                        )}
                        <div
                          className={`p-3 font-black text-center tracking-widest uppercase border-b border-slate-700 ${card.image ? "mt-[-30px] relative z-10 text-purple-300" : "bg-slate-800 text-purple-400"}`}
                        >
                          {card.category}
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                          {card.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className={`p-3 text-sm font-bold flex items-center justify-between transition-colors ${
                                idx === optionIndex
                                  ? "bg-purple-900/40 text-purple-300 border border-purple-500 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]"
                                  : "text-slate-500"
                              }`}
                            >
                              <span
                                className={
                                  idx === optionIndex ? "drop-shadow-sm" : ""
                                }
                              >
                                {opt}
                              </span>
                              {idx === optionIndex && (
                                <img
                                  src={ASSETS.token}
                                  alt="Token"
                                  className="w-6 h-6 object-contain animate-bounce drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={() => handleClick(handleProceedToVote)}
                disabled={!isSetupComplete}
                className={`py-5 px-10 font-black uppercase tracking-[0.2em] transition-all w-full md:w-auto shadow-2xl ${
                  isSetupComplete
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] border border-purple-400"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed hidden"
                }`}
              >
                ดำเนินการสืบสวนต่อ
              </button>
            </div>
          </div>
        )}

        {/* ===================== ADMIN SETUP ===================== */}
        {activeTab === "ADMIN" && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            {/* Guide Text */}
            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-5 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <p className="text-blue-300 font-bold tracking-wide leading-relaxed">
                ให้ Admin
                เลือกตัวเลือกที่คิดว่าใกล้เคียงกับเบาะแสการโจมตีมากที่สุด
                โดยการวาง Token บนตัวเลือกนั้น (สุ่มการ์ดขึ้นมาให้ 3 ใบ)
              </p>
            </div>

            {/* Hint Assignment */}
            <div className="bg-slate-900/80 border border-slate-700/50 p-6 backdrop-blur-sm shadow-xl relative">
              <div className="flex justify-between items-center mb-8 border-b-2 border-slate-800 pb-4">
                <h3 className="text-xl font-black text-blue-400 tracking-widest uppercase flex items-center gap-3">
                  <span className="bg-blue-500 text-slate-900 w-8 h-8 flex items-center justify-center text-sm font-black">
                    1
                  </span>
                  แจกจ่ายเบาะแส
                </h3>
                <span className="text-sm font-black tracking-widest px-4 py-2 bg-slate-800 text-blue-300 border border-slate-700 uppercase">
                  {Object.keys(clueTokens).length}/3 Tokens Placed
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {randomClues.map((card) => {
                  const selectedIdx = clueTokens[card.id];

                  return (
                    <div
                      key={card.id}
                      className="border border-slate-700 bg-slate-950 overflow-hidden hover:border-blue-500/50 transition-colors shadow-lg"
                    >
                      {card.image && (
                        <div className="relative h-24 w-full">
                          <img
                            src={card.image}
                            alt={card.category}
                            className="w-full h-full object-cover opacity-60"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                        </div>
                      )}
                      <div
                        className={`p-4 font-black tracking-widest text-center uppercase border-b border-slate-700 ${card.image ? "mt-[-40px] relative z-10 text-blue-300 text-lg drop-shadow-md" : "bg-slate-800 text-blue-400 text-lg"}`}
                      >
                        {card.category}
                      </div>

                      <div className="p-4 flex flex-col gap-3">
                        {card.options.map((opt, idx) => {
                          const isSelected = selectedIdx === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() =>
                                handleClick(() =>
                                  handlePlaceToken(card.id, idx),
                                )
                              }
                              className={`text-left px-4 py-3 font-bold text-sm transition-all border break-words relative flex justify-between items-center ${
                                isSelected
                                  ? "bg-blue-900/40 border-blue-500 text-blue-300 shadow-[inset_0_0_15px_rgba(59,130,246,0.3)] scale-105 z-10"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                              }`}
                            >
                              <span
                                className={
                                  isSelected ? "drop-shadow-sm w-4/5" : "w-4/5"
                                }
                              >
                                {opt}
                              </span>
                              {isSelected ? (
                                <img
                                  src={ASSETS.token}
                                  alt="Token"
                                  className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full border border-dashed border-slate-700 flex items-center justify-center shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Submit */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => handleClick(() => setActiveTab("PUBLIC"))}
                disabled={!isSetupComplete}
                className={`flex items-center justify-center gap-3 px-10 py-5 font-black uppercase tracking-[0.2em] transition-all w-full md:w-auto shadow-2xl ${
                  isSetupComplete
                    ? "bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 border border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                }`}
              >
                ยืนยันเบาะแสและเปลี่ยนเป็นมุมมองผู้เล่น
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseInvestigation;
