import React, { useState } from "react";
import useGameStore from "../store/useGameStore";
import { GAME_PHASES, ASSETS } from "../constants/gameData";
import {
  BookOpen,
  Settings,
  X,
  Volume2,
  VolumeX,
  Medal,
  Info,
  PlaySquare,
} from "lucide-react";
import { useSfx } from "../hooks/useAudio";

const PhaseMainMenu = () => {
  const setPhase = useGameStore((state) => state.setPhase);
  const bgmEnabled = useGameStore((state) => state.bgmEnabled);
  const sfxEnabled = useGameStore((state) => state.sfxEnabled);
  const toggleBgm = useGameStore((state) => state.toggleBgm);
  const toggleSfx = useGameStore((state) => state.toggleSfx);

  // New settings state
  const voteTimer = useGameStore((state) => state.voteTimer);
  const quizQuestionCount = useGameStore((state) => state.quizQuestionCount);
  const quizDifficulty = useGameStore((state) => state.quizDifficulty);
  const setVoteTimer = useGameStore((state) => state.setVoteTimer);
  const setQuizQuestionCount = useGameStore(
    (state) => state.setQuizQuestionCount,
  );
  const setQuizDifficulty = useGameStore((state) => state.setQuizDifficulty);

  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const { play: playSfx } = useSfx();

  const handleClick = (fn) => {
    playSfx(ASSETS.sounds.click);
    fn();
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center text-green-400 font-mono relative overflow-hidden"
      style={{
        background: `linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.88)), url(${ASSETS.background}) center/cover no-repeat fixed`,
      }}
    >
      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      {/* Scan-line effect */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)] pointer-events-none opacity-40" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-green-500/50" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-green-500/50" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-green-500/50" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-500/50" />

      <div className="z-10 flex flex-col items-center w-full max-w-md md:max-w-xl px-6 pb-20 animate-fade-in-up">
        {/* Big Logo */}
        <div className="text-center w-full mb-2">
          <img
            src={ASSETS.logo}
            alt="Zero Trust Logo"
            className="w-full h-auto drop-shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:drop-shadow-[0_0_60px_rgba(34,197,94,0.9)] transition-all duration-500"
          />
        </div>

        <div className="flex flex-col w-full max-w-sm gap-6">
          <button
            onClick={() => handleClick(() => setPhase(GAME_PHASES.SETUP))}
            className="w-full bg-green-500 hover:bg-green-400 text-slate-950 text-white font-bold text-2xl md:text-3xl py-5 rounded-xl uppercase tracking-widest transition-all duration-150 shadow-[0_8px_0_#15803d,0_15px_20px_rgba(0,0,0,0.4)] active:shadow-[0_0_0_#15803d,0_0_0_rgba(0,0,0,0)] active:translate-y-[8px] flex items-center justify-center gap-3"
          >
            เริ่มเกม
          </button>

          <button
            onClick={() => handleClick(() => setPhase(GAME_PHASES.QUIZ))}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-white font-bold text-xl py-4 rounded-xl uppercase tracking-widest transition-all duration-150 shadow-[0_8px_0_#ca8a04,0_15px_20px_rgba(0,0,0,0.4)] active:shadow-[0_0_0_#ca8a04,0_0_0_rgba(0,0,0,0)] active:translate-y-[8px] flex items-center justify-center gap-3"
          >
            <Medal className="w-6 h-6 text-white" />
            แบบทดสอบ
          </button>

          <button
            onClick={() => handleClick(() => setShowRules(true))}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl py-4 rounded-xl uppercase tracking-widest transition-all duration-150 shadow-[0_8px_0_#334155,0_15px_20px_rgba(0,0,0,0.4)] active:shadow-[0_0_0_#334155,0_0_0_rgba(0,0,0,0)] active:translate-y-[8px] flex items-center justify-center gap-3"
          >
            <BookOpen className="w-6 h-6 text-blue-400" />
            คำอธิบายเกม
          </button>

          <div className="flex gap-4 w-full">
            <button
              onClick={() => handleClick(() => setShowSettings(true))}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl py-4 rounded-xl uppercase tracking-widest transition-all duration-150 shadow-[0_8px_0_#334155,0_15px_20px_rgba(0,0,0,0.4)] active:shadow-[0_0_0_#334155,0_0_0_rgba(0,0,0,0)] active:translate-y-[8px] flex items-center justify-center gap-3"
            >
              <Settings className="w-6 h-6 text-orange-400" />
              การตั้งค่า
            </button>

            <button
              onClick={() => handleClick(() => setShowCredits(true))}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl py-4 rounded-xl uppercase tracking-widest transition-all duration-150 shadow-[0_8px_0_#334155,0_15px_20px_rgba(0,0,0,0.4)] active:shadow-[0_0_0_#334155,0_0_0_rgba(0,0,0,0)] active:translate-y-[8px] flex items-center justify-center gap-3"
            >
              <Info className="w-6 h-6 text-pink-400" />
              เครดิต
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 text-xs text-slate-600 tracking-[0.3em] uppercase">
        {/* Status Bar */}
        <div className="w-full flex items-center justify-center gap-3 text-sm md:text-base text-green-500/80 tracking-widest font-bold mb-8">
          <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(34,197,94,1)]" />
          <span>ระบบออนไลน์ — ZERO TRUST v1.5</span>
        </div>
      </div>

      {/* ============ Rules Modal ============ */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-pop">
          {/* Header */}
          <div className="flex-shrink-0 px-4 pt-4 pb-2 text-center">
            <h2 className="font-bold text-lg text-white">
              คำอธิบายเกม ZERO TRUST ONLINE — อย่าไว้ใจใคร
            </h2>
          </div>

          {/* Scrollable image area — fills remaining height */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 flex flex-col gap-4 pb-2">
            <img
              src={ASSETS.ifogame}
              alt="Info"
              className="w-full h-auto object-contain rounded-xl border border-slate-700/50"
            />
            <img
              src={ASSETS.rules}
              alt="Rules"
              className="w-full h-auto object-contain rounded-xl border border-slate-700/50"
            />
          </div>

          {/* Close button pinned at bottom */}
          <div className="flex-shrink-0 px-4 py-3 flex justify-center">
            <button
              onClick={() => handleClick(() => setShowRules(false))}
              className="w-full max-w-xs bg-slate-800 text-slate-200 py-3 px-6 font-bold text-lg tracking-widest uppercase  rounded-lg border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5 text-red-400" />
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* ============ Settings Modal ============ */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-pop">
          <div className="relative w-full max-w-sm max-h-[90dvh] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] p-5 md:p-8 flex flex-col gap-4 md:gap-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-black text-white tracking-widest uppercase">
                  การตั้งค่า
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4 md:gap-6 pr-1 -mr-1">
              {/* Audio Settings */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                  เสียง (Audio)
                </h3>

                {/* BGM Toggle Row */}
                <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {bgmEnabled ? (
                      <Volume2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-slate-500" />
                    )}
                    <div>
                      <p className="font-bold text-white tracking-wide">
                        เพลงพื้นหลัง
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        BGM (Background Music)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      toggleBgm();
                    }}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ${
                      bgmEnabled
                        ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                        : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${bgmEnabled ? "translate-x-7" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                {/* SFX Toggle Row */}
                <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {sfxEnabled ? (
                      <Volume2 className="w-6 h-6 text-blue-400" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-slate-500" />
                    )}
                    <div>
                      <p className="font-bold text-white tracking-wide">
                        เสียงเอฟเฟกต์
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        SFX (คลิก, ชนะ, แพ้)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      toggleSfx();
                    }}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ${
                      sfxEnabled
                        ? "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                        : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${sfxEnabled ? "translate-x-7" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>

              {/* Game Settings */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                  เกมเพลย์ (Gameplay)
                </h3>

                {/* Vote Timer Select */}
                <div className="flex flex-col gap-2 bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                  <label className="font-bold text-white tracking-wide">
                    เวลาการโหวต (Vote Timer)
                  </label>
                  <select
                    value={voteTimer}
                    onChange={(e) => setVoteTimer(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value={0}>ไม่จับเวลา (No Limit)</option>
                    <option value={30}>30 วินาที</option>
                    <option value={60}>1 นาที</option>
                    <option value={180}>3 นาที</option>
                    <option value={300}>5 นาที</option>
                  </select>
                </div>
              </div>

              {/* Quiz Settings */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                  แบบทดสอบ (Quiz)
                </h3>

                {/* Question Count Select */}
                <div className="flex flex-col gap-2 bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                  <label className="font-bold text-white tracking-wide">
                    จำนวนคำถาม
                  </label>
                  <select
                    value={quizQuestionCount}
                    onChange={(e) =>
                      setQuizQuestionCount(Number(e.target.value))
                    }
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono outline-none focus:border-yellow-500 transition-colors"
                  >
                    <option value={5}>5 ข้อ</option>
                    <option value={10}>10 ข้อ</option>
                    <option value={20}>20 ข้อ</option>
                  </select>
                </div>

                {/* Question Difficulty Select */}
                <div className="flex flex-col gap-2 bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                  <label className="font-bold text-white tracking-wide">
                    ระดับความยาก
                  </label>
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg p-2 font-mono outline-none focus:border-yellow-500 transition-colors"
                  >
                    <option value="EASY">ง่าย (Easy)</option>
                    <option value="MEDIUM">ปานกลาง (Medium)</option>
                    <option value="HARD">ยาก (Hard)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => handleClick(() => setShowSettings(false))}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl uppercase tracking-widest transition-all border border-slate-600/50 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5 text-red-400" />
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* ============ Credits Modal ============ */}
      {showCredits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-pop">
          <div className="relative w-full max-w-sm max-h-[90vh] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] p-6 pt-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-pink-400" />
                <h2 className="text-xl font-black text-white tracking-widest uppercase">
                  เครดิต
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-1 flex flex-col gap-6">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <h3 className="text-pink-400 font-black mb-2 uppercase tracking-widest text-sm border-b border-pink-500/30 pb-2">
                  ผู้จัดทำ
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mt-2 font-sans font-bold">
                  ว่าที่ร้อยตรีกมลเพชร สิริรัตนศักดิ์กุล <br />
                  <span className="text-slate-400 font-normal">
                    ครูผู้ช่วย โรงเรียนวัดอุดมรังสี <br />
                    สำนักงานเขตหนองแขม กรุงเทพมหานคร
                  </span>
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <h3 className="text-pink-400 font-black mb-2 uppercase tracking-widest text-sm border-b border-pink-500/30 pb-2">
                  เสียงประกอบ (Sound Effects)
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mt-2 font-sans">
                  Sound Effect by{" "}
                  <a
                    href="https://pixabay.com/th/users/freesound_community-46691455/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=103694"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    freesound_community
                  </a>{" "}
                  และ{" "}
                  <a
                    href="https://pixabay.com/th/users/floraphonic-38928062/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=224562"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    floraphonic
                  </a>{" "}
                  from{" "}
                  <a
                    href="https://pixabay.com/sound-effects//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=103694"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    Pixabay
                  </a>
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => handleClick(() => setShowCredits(false))}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl uppercase tracking-widest transition-all border border-slate-600/50 flex items-center justify-center gap-2 mt-auto"
            >
              <X className="w-5 h-5 text-red-400" />
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseMainMenu;
