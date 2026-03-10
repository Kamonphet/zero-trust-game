import React, { useState, useEffect, useCallback } from "react";
import useGameStore from "../store/useGameStore";
import { GAME_PHASES, ROLES, ASSETS } from "../constants/gameData";
import {
  EyeOff,
  User,
  Fingerprint,
  Crosshair,
  ArrowRight,
  Skull,
  Timer,
} from "lucide-react";
import { useSfx } from "../hooks/useAudio";

// Helper to get role image
const getRoleImage = (role, playerInfo, players) => {
  if (role === ROLES.ADMIN) return ASSETS.roles.ADMIN;
  if (role === ROLES.SCAMMER) return ASSETS.roles.SCAMMER[0]; // Specific scammer image not needed here unless it's their actual role
  const idx = players.findIndex((p) => p.id === playerInfo.id);
  return ASSETS.roles.USER[Math.max(0, idx) % ASSETS.roles.USER.length];
};

const PhaseVoting = () => {
  const {
    players,
    boardCards,
    addVote,
    turnIndex,
    nextTurn,
    setPhase,
    scammerChoices,
    voteTimer,
  } = useGameStore();

  const [suspectId, setSuspectId] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isVotingStarted, setIsVotingStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(voteTimer);
  const { play: playSfx } = useSfx();
  const handleClick = (fn) => {
    playSfx(ASSETS.sounds.click);
    fn();
  };

  // Voting players excludes ADMIN and the VICTIM
  const votingPlayers = players.filter(
    (p) => p.role !== ROLES.ADMIN && p.id !== scammerChoices.victimId,
  );

  const handleTimeUp = useCallback(() => {
    // Check bounds to prevent crashing
    if (votingPlayers.length === 0 || turnIndex >= votingPlayers.length) return;

    // Force submit an empty vote to skip this player
    addVote({
      playerId: votingPlayers[turnIndex].id,
      suspectedScammerId: "SKIPPED",
      evidenceCards: [],
      attackMethodCard: "SKIPPED",
    });

    setSuspectId(null);
    setSelectedEvidence([]);
    setSelectedMethod(null);
    setIsVotingStarted(false);

    if (turnIndex + 1 < votingPlayers.length) {
      nextTurn();
      setTimeLeft(voteTimer);
    } else {
      setPhase(GAME_PHASES.RESULT);
    }
  }, [addVote, nextTurn, setPhase, turnIndex, voteTimer, votingPlayers]);

  useEffect(() => {
    if (!isVotingStarted || voteTimer === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => handleTimeUp(), 0); // Defer to break the cycle
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVotingStarted, voteTimer, handleTimeUp]);

  if (votingPlayers.length === 0 || turnIndex >= votingPlayers.length) {
    return (
      <div className="p-10 text-white font-mono">Error in voting index.</div>
    );
  }

  const currentPlayer = votingPlayers[turnIndex];

  // Available suspects: exclude self, Admin, and the Victim (victim can't be the Scammer)
  const availableSuspects = players.filter(
    (p) =>
      p.id !== currentPlayer.id &&
      p.role !== ROLES.ADMIN &&
      p.id !== scammerChoices.victimId,
  );

  const handleSelectEvidence = (cardId) => {
    if (selectedEvidence.includes(cardId)) {
      setSelectedEvidence(selectedEvidence.filter((id) => id !== cardId));
    } else {
      if (selectedEvidence.length < 2) {
        setSelectedEvidence([...selectedEvidence, cardId]);
      }
    }
  };

  const handleSubmitVote = () => {
    if (!suspectId || selectedEvidence.length !== 2 || !selectedMethod) {
      alert(
        "⚠️ กรุณาเลือกผู้ต้องสงสัย 1 คน, หลักฐาน 2 ชิ้น และวิธีการโจมตี 1 ชนิด",
      );
      return;
    }

    addVote({
      playerId: currentPlayer.id,
      suspectedScammerId: suspectId,
      evidenceCards: selectedEvidence,
      attackMethodCard: selectedMethod,
    });

    setSuspectId(null);
    setSelectedEvidence([]);
    setSelectedMethod(null);
    setIsVotingStarted(false);

    if (turnIndex + 1 < votingPlayers.length) {
      nextTurn();
    } else {
      setPhase(GAME_PHASES.RESULT);
    }
  };

  // Pass Device Screen
  if (!isVotingStarted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-slate-100 font-mono relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="text-center w-full max-w-md bg-slate-900/80 border border-green-500/50 p-8 shadow-[0_0_30px_rgba(34,197,94,0.2)] backdrop-blur-md z-10 relative overflow-hidden animate-pop">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full blur-2xl" />
          <p className="text-xs font-boldtracking-[0.3em] text-slate-400 uppercase mb-4">
            ส่งต่อให้
          </p>
          <img
            src={getRoleImage(currentPlayer.role, currentPlayer, players)}
            alt={currentPlayer.name}
            className="w-24 h-24 object-cover mx-auto mb-4 border-2 border-slate-700 opacity-80"
          />
          <h2 className="text-4xl font-black text-green-400 tracking-wider mb-8 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
            {currentPlayer.name}
          </h2>
          <button
            onClick={() => handleClick(() => setIsVotingStarted(true))}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-5 uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:scale-[1.02]"
          >
            ฉันคือ {currentPlayer.name}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 p-6 text-slate-100 font-mono relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col gap-8 mt-4 pb-28 z-10 animate-fade-in-up">
        {/* Pass Device Warning Banner */}
        <div className="text-center w-full bg-slate-900/80 border-b-2 border-green-500/50 p-4 shadow-[0_10px_30px_rgba(34,197,94,0.05)] backdrop-blur-md flex flex-col items-center relative overflow-hidden">
          {/* Timer Display */}
          {voteTimer > 0 && (
            <div
              className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full font-black text-sm tracking-widest bg-slate-800 border ${timeLeft <= 10 ? "text-red-400 border-red-500/50 animate-pulse" : "text-yellow-400 border-yellow-500/50"}`}
            >
              <Timer className="w-4 h-4" />
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}

          <p className="text-sm font-bold tracking-[0.3em] text-white uppercase mb-1">
            การลงคะแนนลับโดย
          </p>
          <h2 className="text-2xl font-black text-green-400 tracking-wider drop-shadow-md">
            {currentPlayer.name}
          </h2>
          <span className="text-[10px] sm:text-xs text-red-400 font-bold mt-2 bg-red-950/40 px-3 py-1 border border-red-500/30 flex items-center gap-2 tracking-widest animate-pulse">
            <EyeOff className="w-4 h-4" /> ห้ามให้ผู้อื่นเห็นหน้าจอนี้
          </span>
        </div>

        {/* Section 1: Suspect */}
        <div className="flex flex-col gap-4 border-l-4 border-red-500/50 pl-4 md:pl-6 bg-slate-900/40 py-2">
          <h3 className="text-lg md:text-xl font-black text-red-400 flex items-center gap-3 uppercase tracking-widest">
            <span className="bg-red-500 text-slate-900 w-8 h-8 flex items-center justify-center text-sm font-black shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              1
            </span>
            ใครคือ SCAMMER?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {availableSuspects.map((p) => {
              const isSelected = suspectId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleClick(() => setSuspectId(p.id))}
                  className={`relative p-4 overflow-hidden border-2 transition-all flex flex-col items-center justify-center gap-2 group ${
                    isSelected
                      ? "bg-red-900/50 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-105"
                      : "bg-slate-900 border-slate-700 hover:border-red-400/50 hover:bg-slate-800"
                  }`}
                >
                  {isSelected ? (
                    <Skull className="w-8 h-8 text-red-500 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] animate-pulse" />
                  ) : (
                    <User className="w-8 h-8 text-slate-500 group-hover:text-red-400/50 transition-colors" />
                  )}
                  <div
                    className={`text-center font-bold text-sm tracking-widest truncate w-full ${isSelected ? "text-red-400" : "text-slate-400"}`}
                  >
                    {p.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Evidence */}
        <div className="flex flex-col gap-4 border-l-4 border-blue-500/50 pl-4 md:pl-6 bg-slate-900/40 py-2">
          <div className="flex justify-between items-end border-b border-slate-800/50 pb-2">
            <h3 className="text-lg md:text-xl font-black text-blue-400 flex items-center gap-3 uppercase tracking-widest">
              <span className="bg-blue-500 text-slate-900 w-8 h-8 flex items-center justify-center text-sm font-black shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                2
              </span>
              หลักฐานคืออะไร? (เลือก 2 ชิ้น)
            </h3>
            <span className="text-xs font-black tracking-widest px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700">
              {selectedEvidence.length}/2
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {boardCards.evidence.map((card) => {
              const isSelected = selectedEvidence.includes(card.id);
              const isDisabled = selectedEvidence.length >= 2 && !isSelected;
              return (
                <div key={card.id} className="flex flex-col gap-2 relative">
                  <button
                    disabled={isDisabled}
                    onClick={() =>
                      handleClick(() => handleSelectEvidence(card.id))
                    }
                    className={`relative aspect-[3/4] overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105"
                        : isDisabled
                          ? "border-slate-800 opacity-30 cursor-not-allowed"
                          : "border-slate-700 hover:border-blue-400/50 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/30 flex items-end justify-center pb-2 backdrop-blur-[1px]">
                        <span className="bg-blue-600 text-white text-[10px] px-3 py-1 font-black tracking-widest shadow-lg">
                          SELECTED
                        </span>
                      </div>
                    )}
                  </button>
                  <p className="text-center text-xs font-bold text-slate-400 leading-tight truncate px-1">
                    {card.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Attack Method */}
        <div className="flex flex-col gap-4 border-l-4 border-orange-500/50 pl-4 md:pl-6 bg-slate-900/40 py-2">
          <div className="flex justify-between items-end border-b border-slate-800/50 pb-2">
            <h3 className="text-lg md:text-xl font-black text-orange-400 flex items-center gap-3 uppercase tracking-widest">
              <span className="bg-orange-500 text-slate-900 w-8 h-8 flex items-center justify-center text-sm font-black shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                3
              </span>
              รูปแบบการโจมตีคืออะไร? (เลือก 1 ชนิด)
            </h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {boardCards.attackMethods.map((card) => {
              const isSelected = selectedMethod === card.id;
              return (
                <div key={card.id} className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      handleClick(() => setSelectedMethod(card.id))
                    }
                    className={`relative aspect-[3/4] overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-105"
                        : "border-slate-700 opacity-60 hover:opacity-100 hover:border-orange-400/50 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-orange-500/30 flex items-end justify-center pb-2 backdrop-blur-[1px]">
                        <span className="bg-orange-600 text-white text-[10px] px-2 py-1 font-black tracking-widest shadow-lg">
                          SELECTED
                        </span>
                      </div>
                    )}
                  </button>
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
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-2 md:border-b-0 md:pb-0">
          <div className="text-xs text-slate-400 font-bold tracking-[0.2em] uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            ลงคะแนนแล้ว: {turnIndex}/{votingPlayers.length}
          </div>
          <button
            onClick={() => handleClick(handleSubmitVote)}
            className={`flex items-center justify-center gap-3 px-10 py-4 font-black text-sm uppercase tracking-[0.2em] transition-all w-full md:w-auto shadow-xl ${
              suspectId && selectedEvidence.length === 2 && selectedMethod
                ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-green-400"
                : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
            }`}
          >
            ยืนยันผลโหวต <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhaseVoting;
