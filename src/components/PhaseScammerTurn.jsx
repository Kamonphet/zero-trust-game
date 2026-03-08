import React, { useState, useMemo, useEffect } from "react";
import useGameStore from "../store/useGameStore";
import {
  GAME_PHASES,
  ROLES,
  EVIDENCE_CARDS,
  ATTACK_METHODS,
  ASSETS,
} from "../constants/gameData";
import { Bug, ArrowRight, Skull } from "lucide-react";

const PhaseScammerTurn = () => {
  const { players, boardCards, setBoardCards, setScammerChoices, setPhase } =
    useGameStore();

  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [selectedAttackMethod, setSelectedAttackMethod] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  // Compute available targets — excluding Scammer and Admin
  const availableTargets = useMemo(
    () =>
      players.filter((p) => p.role !== ROLES.SCAMMER && p.role !== ROLES.ADMIN),
    [players],
  );

  const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

  // Initialize board cards into the store exactly ONCE (on first mount only)
  // This ensures Scammer and Voting phases always read the same card set.
  useEffect(() => {
    if (boardCards.evidence.length === 0) {
      const evidence = shuffleArray(EVIDENCE_CARDS).slice(0, 10);
      const attacks = shuffleArray(ATTACK_METHODS);
      setBoardCards(evidence, attacks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read directly from the store so both phases use identical data
  const boardEvidence = boardCards.evidence;
  const boardAttackMethods = boardCards.attackMethods;

  const handleFlipCard = (cardId) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleSelectEvidence = (cardId) => {
    if (selectedEvidence.includes(cardId)) {
      setSelectedEvidence(selectedEvidence.filter((id) => id !== cardId));
    } else {
      if (selectedEvidence.length < 2) {
        setSelectedEvidence([...selectedEvidence, cardId]);
      }
    }
  };

  const handleConfirmAction = () => {
    if (
      !selectedTarget ||
      selectedEvidence.length !== 2 ||
      !selectedAttackMethod
    ) {
      alert(
        "⚠️ กรุณาเลือกเหยื่อ 1 คน, วางหลักฐาน 2 ชิ้น และเลือกวิธีการโจมตี 1 ชนิด",
      );
      return;
    }
    setScammerChoices({
      victimId: selectedTarget,
      evidenceCards: selectedEvidence,
      attackMethodCard: selectedAttackMethod,
    });
    setPhase(GAME_PHASES.NIGHT_ADMIN);
  };

  // Helper to get image based on original player index
  const getRoleImage = (role, playerInfo) => {
    if (role === ROLES.ADMIN) return ASSETS.roles.ADMIN;
    if (role === ROLES.SCAMMER) return ASSETS.roles.SCAMMER[0]; // Shouldn't happen for victims
    const idx = players.findIndex((p) => p.id === playerInfo.id);
    return ASSETS.roles.USER[Math.max(0, idx) % ASSETS.roles.USER.length];
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 p-6 text-slate-100 font-mono relative">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col gap-6 mt-4 pb-24 z-10 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-4 bg-red-950/40 border-l-4 border-red-500 p-4 shadow-[0_0_20px_rgba(239,68,68,0.15)] backdrop-blur-sm">
          <Bug className="w-12 h-12 text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <div>
            <h2 className="text-2xl font-black text-red-400 uppercase tracking-widest drop-shadow-md">
              ปฏิบัติการแทรกซึม
            </h2>
            <p className="text-sm text-red-300/80 tracking-widest mt-1">
              หน้าจอของ Scammer
            </p>
          </div>
        </div>

        {/* Action 1: Select Victim */}
        <div className="bg-slate-900/80 border border-slate-700/50 p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 transform translate-x-8 -translate-y-8 rotate-45" />
          <h3 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-3 tracking-widest uppercase">
            <span className="bg-red-500 text-slate-900 w-7 h-7 flex items-center justify-center text-sm font-black shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              1
            </span>
            เลือกเป้าหมาย (เหยื่อ)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {availableTargets.map((player) => {
              const isSelected = selectedTarget === player.id;
              return (
                <div key={player.id} className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedTarget(player.id)}
                    className={`relative aspect-[3/4] overflow-hidden border-2 transition-all p-1 ${
                      isSelected
                        ? "bg-red-900/50 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-105"
                        : "bg-slate-900 border-slate-700 hover:border-red-400/50 hover:bg-slate-800"
                    }`}
                  >
                    <img
                      src={getRoleImage(player.role, player)}
                      alt={player.name}
                      className={`w-full h-full object-cover border border-slate-800 transition-opacity ${isSelected ? "opacity-100" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"}`}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center backdrop-blur-[1px]">
                        <Skull className="w-12 h-12 text-red-500 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] animate-pulse" />
                        <span className="bg-red-600 text-white text-xs font-black px-3 py-1 mt-2 tracking-widest shadow-lg uppercase">
                          TARGET
                        </span>
                      </div>
                    )}
                  </button>
                  <p
                    className={`text-center font-bold text-sm tracking-widest truncate ${isSelected ? "text-red-400" : "text-slate-400"}`}
                  >
                    {player.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action 2: Select Evidence */}
        <div className="bg-slate-900/80 border border-slate-700/50 p-6 backdrop-blur-sm shadow-xl">
          <div className="flex justify-between items-end mb-6 pb-2 border-b border-slate-800/50">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-3 tracking-widest uppercase">
              <span className="bg-blue-500 text-slate-900 w-7 h-7 flex items-center justify-center text-sm font-black shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                2
              </span>
              วางหลักฐานปลอม (เลือก 2 ชิ้น)
            </h3>
            <span className="text-xs font-black tracking-widest px-3 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
              {selectedEvidence.length}/2 เลือกแล้ว
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {boardEvidence.map((card) => {
              const isSelected = selectedEvidence.includes(card.id);
              const isDisabled = selectedEvidence.length >= 2 && !isSelected;
              const isFlipped = flippedCards[card.id];

              return (
                <div key={card.id} className="flex flex-col gap-2">
                  <div
                    className={`relative cursor-pointer transition-all border-2 aspect-[3/4] overflow-hidden ${
                      isSelected
                        ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105"
                        : isDisabled
                          ? "border-slate-800 opacity-30 cursor-not-allowed"
                          : "border-slate-600 hover:border-blue-400/50 hover:shadow-lg"
                    }`}
                    onClick={() => {
                      if (!isDisabled) {
                        if (!isFlipped) handleFlipCard(card.id);
                        else handleSelectEvidence(card.id);
                      }
                    }}
                  >
                    {isFlipped ? (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover animate-flip"
                      />
                    ) : (
                      <img
                        src={ASSETS.backCover}
                        alt="Card Back"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-end pb-3 backdrop-blur-[1px]">
                        <span className="bg-blue-600 text-white text-[10px] sm:text-xs font-black px-3 py-1 tracking-widest shadow-lg uppercase">
                          SELECTED
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-xs font-bold text-slate-400 leading-tight truncate px-1">
                    {isFlipped ? card.name : "???"}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 text-blue-300/80 text-xs tracking-widest text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
            แตะที่การ์ดเพื่อเปิดดูหลักฐาน และแตะอีกครั้งเพื่อยืนยันการเลือก
          </div>
        </div>

        {/* Action 3: Select Attack Method */}
        <div className="bg-slate-900/80 border border-slate-700/50 p-6 backdrop-blur-sm shadow-xl">
          <div className="flex justify-between items-end mb-6 pb-2 border-b border-slate-800/50">
            <h3 className="text-lg font-bold text-orange-400 flex items-center gap-3 tracking-widest uppercase">
              <span className="bg-orange-500 text-slate-900 w-7 h-7 flex items-center justify-center text-sm font-black shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                3
              </span>
              เลือกอาวุธในการโจมตี (เลือก 1 ชนิด)
            </h3>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {boardAttackMethods.map((card) => {
              const isSelected = selectedAttackMethod === card.id;
              return (
                <div key={card.id} className="flex flex-col gap-2">
                  <div
                    className={`relative cursor-pointer transition-all border-2 aspect-[3/4] overflow-hidden ${
                      isSelected
                        ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] scale-105"
                        : "border-slate-600 opacity-60 hover:opacity-100 hover:border-orange-400/50"
                    }`}
                    onClick={() => setSelectedAttackMethod(card.id)}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-orange-500/20 flex flex-col items-center justify-end pb-3 backdrop-blur-[1px]">
                        <span className="bg-orange-600 text-white text-[10px] sm:text-xs font-black px-2 py-1 tracking-widest shadow-lg uppercase">
                          SELECTED
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-xs font-bold text-slate-400 leading-tight">
                    {card.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-4 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="w-full max-w-5xl mx-auto flex justify-between items-center">
          <div className="text-xs text-slate-400 hidden md:flex gap-6 tracking-widest font-bold">
            <span className="flex items-center gap-2">
              เป้าหมาย:{" "}
              <span className="text-red-400 bg-red-950/50 px-2 py-1 rounded">
                {selectedTarget
                  ? players.find((p) => p.id === selectedTarget)?.name
                  : "—"}
              </span>
            </span>
            <span className="flex items-center gap-2">
              หลักฐาน:{" "}
              <span className="text-blue-400 bg-blue-950/50 px-2 py-1 rounded">
                {selectedEvidence.length}/2
              </span>
            </span>
            <span className="flex items-center gap-2">
              การโจมตี:{" "}
              <span className="text-orange-400 bg-orange-950/50 px-2 py-1 rounded">
                {selectedAttackMethod ? "1" : "0"}/1
              </span>
            </span>
          </div>
          <button
            onClick={handleConfirmAction}
            className={`flex items-center justify-center gap-3 px-10 py-4 font-black text-sm uppercase tracking-[0.2em] transition-all w-full md:w-auto ${
              selectedTarget &&
              selectedEvidence.length === 2 &&
              selectedAttackMethod
                ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]"
                : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
            }`}
          >
            ยืนยันการโจมตี <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhaseScammerTurn;
