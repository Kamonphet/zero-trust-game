import React from "react";
import useGameStore from "../store/useGameStore";
import {
  GAME_PHASES,
  ROLES,
  EVIDENCE_CARDS,
  ATTACK_METHODS,
} from "../constants/gameData";
import { ShieldCheck, ArrowRight, EyeOff } from "lucide-react";

const PhaseAdminTurn = () => {
  const { players, scammerChoices, setPhase } = useGameStore();

  const victim = players.find((p) => p.id === scammerChoices.victimId);
  const scammers = players.filter((p) => p.role === ROLES.SCAMMER);

  const chosenEvidence = EVIDENCE_CARDS.filter((c) =>
    scammerChoices.evidenceCards.includes(c.id),
  );
  const chosenAttack = ATTACK_METHODS.find(
    (c) => c.id === scammerChoices.attackMethodCard,
  );

  const handleAcknowledge = () => {
    setPhase(GAME_PHASES.DAY_INVESTIGATION);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 p-6 text-slate-100 font-mono relative">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-2xl flex flex-col gap-6 mt-4 pb-8 z-10">
        {/* Header */}
        <div className="flex items-center gap-4 bg-blue-950/40 border-l-4 border-blue-500 p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)] backdrop-blur-sm">
          <ShieldCheck className="w-12 h-12 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          <div>
            <h2 className="text-2xl font-black text-blue-400 uppercase tracking-widest drop-shadow-md">
              ศูนย์ปฏิบัติการ (Admin)
            </h2>
            <p className="text-sm text-blue-300/80 tracking-widest mt-1">
              SYSTEM OVERRIDE ACTIVATED
            </p>
          </div>
        </div>

        {/* Security Incident Report */}
        <div className="bg-slate-900/80 border border-slate-700/50 shadow-xl backdrop-blur-sm relative overflow-hidden">
          <div className="bg-slate-800 px-5 py-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-black text-slate-300 tracking-[0.2em]">
              รายงานเหตุการณ์ #404
            </h3>
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 border border-red-500/50 animate-pulse font-bold tracking-widest">
              CONFIDENTIAL
            </span>
          </div>

          <div className="p-6 flex flex-col gap-8">
            {/* Scammer Identity */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-red-500 font-bold tracking-widest uppercase">
                &gt; ข้อมูลผู้ก่อเหตุ (Scammer)
              </label>
              <div className="flex flex-wrap gap-2">
                {scammers.map((s) => (
                  <span
                    key={s.id}
                    className="bg-red-950/50 text-red-400 border border-red-800 px-4 py-2 font-black text-lg tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Identity */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-blue-500 font-bold tracking-widest uppercase">
                &gt; เป้าหมายการโจมตี (Victim)
              </label>
              <div className="text-slate-200 text-2xl font-black px-4 py-2 bg-blue-950/20 border-l-2 border-blue-500 tracking-widest inline-block w-fit">
                {victim ? victim.name : "Unknown User"}
              </div>
            </div>

            {/* Attack Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800/50 relative">
              <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-xs text-slate-600 font-bold tracking-widest">
                ATTACK VECTOR DATA
              </div>

              {/* Evidence */}
              <div className="flex flex-col gap-3">
                <label className="text-xs text-blue-400 font-bold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                  หลักฐานปลอม 2 ชิ้น
                </label>
                <div className="flex flex-col gap-2">
                  {chosenEvidence.map((e) => (
                    <div
                      key={e.id}
                      className="bg-slate-800/50 border border-slate-600 px-4 py-3 flex items-center justify-between hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-blue-300 font-bold tracking-wide">
                        {e.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Method */}
              <div className="flex flex-col gap-3">
                <label className="text-xs text-orange-400 font-bold tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                  รูปแบบการโจมตี
                </label>
                <div className="bg-slate-800/50 border border-slate-600 px-4 py-3 h-full flex flex-col justify-center hover:bg-slate-800 transition-colors">
                  <span className="text-orange-400 font-bold text-lg tracking-wide text-center">
                    {chosenAttack?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-950/20 border border-blue-500/30 p-5 flex gap-4 text-blue-400 mt-2 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <EyeOff className="w-8 h-8 shrink-0 text-blue-500" />
          <p className="text-sm font-bold tracking-wide leading-relaxed">
            จดจำข้อมูลเหล่านี้ไว้ให้ดี! ในฐานะ Admin คุณต้องเลือก "คำใบ้"
            ใบ้ให้ผู้ใช้งาน (Users) แกะรอยหาตัว Scammer ให้ได้ <br />
            <span className="text-red-400">
              *ห้ามเปิดเผยหน้าจอนี้ให้ผู้อื่นเห็นเด็ดขาด*
            </span>
          </p>
        </div>

        <button
          onClick={handleAcknowledge}
          className="mt-4 flex items-center justify-center gap-3 w-full border border-blue-500 bg-blue-600 hover:bg-blue-500 py-4 px-6 font-black text-lg uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
        >
          รับทราบข้อมูล <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PhaseAdminTurn;
