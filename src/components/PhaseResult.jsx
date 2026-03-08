import React, { useMemo, useEffect } from "react";
import useGameStore from "../store/useGameStore";
import {
  GAME_PHASES,
  ROLES,
  ASSETS,
  EVIDENCE_CARDS,
  ATTACK_METHODS,
} from "../constants/gameData";
import { Trophy, Skull, RefreshCw, Layers } from "lucide-react";
import { useSfx } from "../hooks/useAudio";

const PhaseResult = () => {
  const { players, votes, scammerChoices, resetGame } = useGameStore();
  const { play: playSfx } = useSfx();

  // Calculation Logic
  const resultData = useMemo(() => {
    let correctVotesCount = 0;

    const voteDetails = votes.map((vote) => {
      const voter = players.find((p) => p.id === vote.playerId);
      const isSkipped = vote.suspectedScammerId === "SKIPPED";
      const chosenSuspect = isSkipped
        ? null
        : players.find((p) => p.id === vote.suspectedScammerId);

      const isScammerCorrect =
        !isSkipped && chosenSuspect?.role === ROLES.SCAMMER;

      const isEvidenceCorrect =
        !isSkipped &&
        vote.evidenceCards.length === 2 &&
        vote.evidenceCards.every((id) =>
          scammerChoices.evidenceCards.includes(id),
        );

      const isMethodCorrect =
        !isSkipped && vote.attackMethodCard === scammerChoices.attackMethodCard;

      const score =
        (isScammerCorrect ? 1 : 0) +
        (isEvidenceCorrect ? 1 : 0) +
        (isMethodCorrect ? 1 : 0);

      const isPassed = !isSkipped && score >= 2;

      if (isPassed) correctVotesCount++;

      return {
        voter,
        chosenSuspect,
        isScammerCorrect,
        isEvidenceCorrect,
        isMethodCorrect,
        isPassed,
        isSkipped,
      };
    });

    const totalVoters = votes.length;
    const usersWin = correctVotesCount > totalVoters / 2;

    return { correctVotesCount, totalVoters, usersWin, voteDetails };
  }, [players, votes, scammerChoices]);

  // Play win or lost SFX once when the result screen appears
  useEffect(() => {
    if (resultData.usersWin) {
      playSfx(ASSETS.sounds.win);
    } else {
      playSfx(ASSETS.sounds.lost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actual choices for display
  const trueScammers = players.filter((p) => p.role === ROLES.SCAMMER);
  const trueVictim = players.find((p) => p.id === scammerChoices.victimId);
  const trueEvidence = EVIDENCE_CARDS.filter((c) =>
    scammerChoices.evidenceCards.includes(c.id),
  );
  const trueMethod = ATTACK_METHODS.find(
    (c) => c.id === scammerChoices.attackMethodCard,
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 p-6 text-slate-100 font-mono pb-24 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col gap-10 mt-4 z-10 animate-fade-in-up">
        {/* Top Banner Win/Loss */}
        <div
          className={`relative p-10 text-center border-2 overflow-hidden ${
            resultData.usersWin
              ? "bg-blue-900/40 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
              : "bg-red-900/40 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)]"
          }`}
        >
          {/* Decorative background glows */}
          <div
            className={`absolute top-[-50%] left-[-10%] w-64 h-64 rounded-full blur-3xl opacity-20 ${resultData.usersWin ? "bg-blue-400" : "bg-red-400"}`}
          />
          <div
            className={`absolute bottom-[-50%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-20 ${resultData.usersWin ? "bg-blue-400" : "bg-red-400"}`}
          />

          {resultData.usersWin ? (
            <Trophy className="w-24 h-24 text-blue-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-bounce relative z-10" />
          ) : (
            <Skull className="w-24 h-24 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse relative z-10" />
          )}

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-4 relative z-10">
            {resultData.usersWin ? (
              <span className="text-blue-400 drop-shadow-md">
                ผู้ใช้งานชนะ!
              </span>
            ) : (
              <span className="text-red-400 drop-shadow-md">มิจฉาชีพชนะ!</span>
            )}
          </h1>

          <p className="text-xl text-slate-300 font-bold tracking-wide relative z-10">
            มีผู้เล่น{" "}
            <span
              className={`font-black text-2xl ${resultData.usersWin ? "text-blue-400" : "text-red-400"}`}
            >
              {resultData.correctVotesCount}
            </span>{" "}
            จาก {resultData.totalVoters} คน ที่วิเคราะห์เหตุการณ์ผ่านเกณฑ์
            <br />
            <span className="text-sm text-slate-500 tracking-widest block mt-4 uppercase">
              (ทุกคนทำได้ดีมาก 🎉🎉🎉)
            </span>
          </p>
        </div>

        {/* The Truth Section */}
        <div className="bg-slate-900/80 border border-slate-700/50 p-8 backdrop-blur-sm shadow-xl">
          <h2 className="text-2xl font-black text-slate-300 mb-8 flex items-center gap-4 tracking-[0.2em]">
            <Layers className="text-slate-500 w-8 h-8" />
            บทสรุปเหตุการณ์ที่แท้จริง
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-950/80 border-t-4 border-red-500 p-5 shadow-lg">
              <label className="text-xs tracking-widest text-slate-500 uppercase block mb-3 font-bold">
                ผู้ก่อเหตุ (Scammer)
              </label>
              <div className="flex flex-col gap-2">
                {trueScammers.map((s) => (
                  <span
                    key={s.id}
                    className="text-red-400 font-black text-xl tracking-wider"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/80 border-t-4 border-slate-500 p-5 shadow-lg">
              <label className="text-xs tracking-widest text-slate-500 uppercase block mb-3 font-bold">
                เหยื่อ (Victim)
              </label>
              <span className="text-slate-300 font-black text-xl tracking-wider">
                {trueVictim?.name || "Unknown"}
              </span>
            </div>

            <div className="bg-slate-950/80 border-t-4 border-blue-500 p-5 shadow-lg">
              <label className="text-xs tracking-widest text-slate-500 uppercase block mb-3 font-bold">
                หลักฐานที่พบ
              </label>
              <div className="flex flex-col gap-2">
                {trueEvidence.map((e) => (
                  <span
                    key={e.id}
                    className="text-blue-400 font-bold text-base tracking-wide border-l-2 border-blue-900 pl-2"
                  >
                    {e.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/80 border-t-4 border-orange-500 p-5 shadow-lg">
              <label className="text-xs tracking-widest text-slate-500 uppercase block mb-3 font-bold">
                วิธีการโจมตี
              </label>
              <span className="text-orange-400 font-bold text-base tracking-wide border-l-2 border-orange-900 pl-2 block">
                {trueMethod?.name || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Voting Breakdown */}
        <div className="bg-slate-900/60 p-6 border border-slate-800/80 pb-10">
          <h2 className="text-xl font-black text-slate-400 mb-6 tracking-widest uppercase ml-2 flex items-center gap-3">
            <span className="w-2 h-8 bg-slate-600 block" />
            สรุปผลโหวตรายบุคคล
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resultData.voteDetails.map((details, idx) => (
              <div
                key={idx}
                className={`p-5 border-l-4 bg-slate-950/90 shadow-lg transition-transform hover:-translate-y-1 ${
                  details.isSkipped
                    ? "border-l-slate-700 border-slate-800/80 opacity-60"
                    : details.isPassed
                      ? "border-l-blue-500 border-slate-700/50 shadow-[0_5px_15px_rgba(59,130,246,0.15)]"
                      : "border-l-slate-600 border-slate-800/80"
                }`}
              >
                <div className="flex justify-between items-center mb-4 border-b border-slate-800/80 pb-3">
                  <span className="font-black text-xl text-slate-200 tracking-wider">
                    {details.voter?.name ?? "?"}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs px-3 py-1 font-black tracking-widest uppercase border ${
                      details.isSkipped
                        ? "bg-slate-900 text-slate-500 border-slate-700"
                        : details.isPassed
                          ? "bg-green-950/60 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          : "bg-red-900/60 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    }`}
                  >
                    {details.isSkipped
                      ? "หมดเวลา"
                      : details.isPassed
                        ? "จับตัวได้แล้ว"
                        : "อาจจะยังน้า"}
                  </span>
                </div>

                {details.isSkipped ? (
                  <p className="text-slate-600 text-sm font-bold text-center py-2">
                    — ข้ามรอบ (หมดเวลา) —
                  </p>
                ) : (
                  <div className="flex flex-col gap-3 text-sm font-bold tracking-wide">
                    <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                      <span className="text-slate-500 text-xs uppercase">
                        ผู้ต้องสงสัย:
                      </span>
                      <span
                        className={
                          details.isScammerCorrect
                            ? "text-red-400"
                            : "text-slate-600 line-through"
                        }
                      >
                        {details.chosenSuspect?.name ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                      <span className="text-slate-500 text-xs uppercase">
                        หลักฐาน:
                      </span>
                      <span
                        className={
                          details.isEvidenceCorrect
                            ? "text-blue-400"
                            : "text-slate-600"
                        }
                      >
                        {details.isEvidenceCorrect
                          ? "ถูกทั้ง 2 ชิ้น"
                          : "ไม่ถูกต้อง"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                      <span className="text-slate-500 text-xs uppercase">
                        วิธีการ:
                      </span>
                      <span
                        className={
                          details.isMethodCorrect
                            ? "text-orange-400"
                            : "text-slate-600"
                        }
                      >
                        {details.isMethodCorrect ? "ถูกต้อง" : "ไม่ถูกต้อง"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-4 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="w-full max-w-5xl mx-auto flex justify-center items-center">
          <button
            onClick={resetGame}
            className="flex items-center gap-3 px-12 py-5 bg-slate-900 border border-green-500/50 text-green-400 hover:bg-green-900/40 hover:text-green-300 font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-1"
          >
            <RefreshCw className="w-6 h-6" />
            กลับสู่หน้าเริ่มต้น
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhaseResult;
