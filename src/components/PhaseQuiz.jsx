import React, { useState, useRef } from "react";
import useGameStore from "../store/useGameStore";
import { ASSETS, DEFENSE_CARDS, GAME_PHASES } from "../constants/gameData";
import { useSfx, useBgm } from "../hooks/useAudio";
import {
  BookOpen,
  Swords,
  ArrowLeft,
  ShieldCheck,
  Skull,
  Heart,
  Medal,
} from "lucide-react";

// Generate scenarios for Test mode based on Defense Cards
const generateScenarios = (count) => {
  const allScenarios = [
    {
      text: "ได้รับข้อความ SMS บอกว่าบัญชีธนาคารของคุณถูกระงับ ให้คลิกลิงก์... คุณควรรับมืออย่างไร?",
      correctId: "D8",
    },
    {
      text: "เพิ่งสมัครอีเมลงานใหม่ รหัสผ่านเก่าก็ใช้มาหลายเว็บแล้ว คุณควรทำสิ่งใดเพิ่มความปลอดภัย?",
      correctId: "D6",
    },
    {
      text: "มีเบอร์โทร +69 โทรเข้ามาอ้างตัวเป็นไปรษณีย์ไทย มีพัสดุตกค้าง คุณควรทำอย่างไร?",
      correctId: "D2",
    },
    {
      text: "โดนแฮกเกอร์โจมตี Ransomware ล็อกคอมพิวเตอร์และเรียกค่าไถ่ คุณดีใจที่เมื่อวานคุณได้...",
      correctId: "D5",
    },
    {
      text: "คอมพิวเตอร์แจ้งเตือนว่า Windows หมดอายุ และเบราว์เซอร์ให้อัปเดตทันที คุณควรทำอะไร?",
      correctId: "D4",
    },
    {
      text: "มีลิงก์แจกเงินฟรีใน Line กลุ่มครอบครัว แต่เมื่อกดเข้าไปพบหน้าตาแปลกๆ... คุณควรป้องกันก่อนหน้านี้ด้วยการ...",
      correctId: "D1",
    },
    {
      text: "พบเพจปลอมหลอกขายของออนไลน์และใช้รูปโปรไฟล์คุณ แอบอ้างว่าคุณเป็นคนขาย คุณควรทำอย่างไร?",
      correctId: "D3",
    },
    {
      text: "คุณต้องล็อกอินผ่านคอมพิวเตอร์สาธารณะ แม้รหัสผ่านจะถูกดักจับ แต่แฮกเกอร์ก็ยังเข้าไม่ได้ถ้าคุณ...",
      correctId: "D7",
    },
    {
      text: "ได้รับอีเมลแจ้งเตือนว่า 'เปลี่ยนรหัสผ่านสำเร็จ' ทั้งๆ ที่ไม่ได้เปลี่ยน คุณควรทำอย่างไรให้เร็วที่สุด?",
      correctId: "D6",
    },
    {
      text: "ในแชทกลุ่ม มีการแชร์ข่าวว่า ดาราชื่อดังแจกเงิน 5000 บาทฟรี คุณได้รับลิงก์ คุณต้องทำอะไรก่อนแชร์ต่อ?",
      correctId: "D1",
    },
    {
      text: "มีสายเข้าเบอร์แปลก อ้างว่าเป็นเจ้าหน้าที่ตำรวจจาก สภ.เมือง บอกว่าชื่อของมึงไปพัวพันกับคดีฟอกเงิน และขู่ให้โอนเงินมาตรวจสอบ?",
      correctId: "D2",
    },
    {
      text: "ได้รับ SMS เขียนว่า 'คุณได้รับสิทธิ์เงินกู้ฉุกเฉิน 50,000 บาท ดอกเบี้ย 0% อนุมัติไว กดรับสิทธิ์เลย: http://bit.ly/scam-link'?",
      correctId: "D8",
    },
    {
      text: "นักเรียนเพิ่งสมัครแอปกระเป๋าเงินออนไลน์ (Wallet) หรือบัญชีเกมที่เติมเงินไปเยอะมาก กลัวว่าถ้ารหัสผ่านหลุดไป ของในไอดีจะโดนขโมยหมด?",
      correctId: "D7",
    },
    {
      text: "มีข้อความเด้งเตือนจาก Google ว่า 'มีการพยายามเข้าสู่ระบบบัญชีของคุณจากอุปกรณ์ในประเทศรัสเซีย' ซึ่งนักเรียนก็อยู่เมืองไทยนี่แหละ?",
      correctId: "D6",
    },
    {
      text: "นักเรียนเผลอลบรูปภาพที่สำคัญทั้งหมดทิ้งจากเครื่องคอมพิวเตอร์ แต่นักเรียนหายห่วงเพราะนักเรียน?",
      correctId: "D5",
    },
    {
      text: "ไถหน้าฟีดเฟซบุ๊ก ไปเจอเพจที่ตั้งชื่อและใช้รูปโปรไฟล์เหมือนธนาคารเป๊ะ ๆ กำลังยิงแอดโฆษณาแจกเงิน หรือหลอกให้คนกรอกข้อมูล?",
      correctId: "D3",
    },
    {
      text: "คอมพิวเตอร์หรือมือถือของนักเรียนเด้งแจ้งเตือนมา 3 วันติดแล้วว่า 'มีแพทช์ซอฟต์แวร์เวอร์ชันใหม่ ช่วยอุดช่องโหว่ความปลอดภัยร้ายแรง' แต่นักเรียนกดข้ามตลอดเพราะขี้เกียจรอเครื่องรีสตาร์ท?",
      correctId: "D4",
    },
    {
      text: "มีคนแชร์บทความในไลน์กลุ่มครอบครัวว่า 'ด่วน! รัฐบาลแจกเงินดิจิทัลรอบพิเศษ ให้กรอกข้อมูลที่เว็บนี้...' ดูแล้วน่าเชื่อถือมาก",
      correctId: "D1",
    },
    {
      text: "เพื่อนสนิทของนักเรียนโทรมาบอกว่า 'เฮ้ พี่สาวโดนรถชนอยู่โรงพยาบาล ขอยืมเงิน 5,000 จ่ายค่ารักษาด่วน' แต่พูดด้วยน้ำเสียงแปลก ๆ ไม่เหมือนเพื่อนคนเดิม?",
      correctId: "D2",
    },
    {
      text: "มีอีเมลส่งมาบอกว่า 'บัญชี Netflix ของคุณกำลังจะถูกระงับเนื่องจากตัดบัตรไม่ผ่าน กรุณาอัปเดตข้อมูลการชำระเงินด่วน' ซึ่งหน้าตาอีเมลแนบเนียนมาก?",
      correctId: "D8",
    },
  ];

  // Shuffle without repetition using Fisher-Yates, then slice to count
  const shuffled = [...allScenarios];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map((s, idx) => ({ ...s, id: idx }));
};

// Generate 4 choices: 1 correct + 3 random wrong cards, all shuffled
const generateChoices = (correctId) => {
  const correct = DEFENSE_CARDS.find((c) => c.id === correctId);
  const wrong = DEFENSE_CARDS.filter((c) => c.id !== correctId);
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
  }
  const four = [correct, ...wrong.slice(0, 3)];
  for (let i = four.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [four[i], four[j]] = [four[j], four[i]];
  }
  return four;
};

const PhaseQuiz = () => {
  const { setPhase, quizQuestionCount, quizDifficulty } = useGameStore();
  const { play: playSfx } = useSfx();
  const { play: playBgm, stop: stopBgm } = useBgm();

  const topRef = useRef(null);
  const [mode, setMode] = useState(null); // 'KNOWLEDGE' or 'TEST'
  const [currentDefIndex, setCurrentDefIndex] = useState(0);

  // Test Mode State
  const [scenarios, setScenarios] = useState([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [hackerHp, setHackerHp] = useState(100);
  const [scammerHp, setScammerHp] = useState(100);
  const [quizStatus, setQuizStatus] = useState("PLAYING"); // PLAYING, WON, LOST
  const [shakeTarget, setShakeTarget] = useState(null); // 'HACKER' or 'SCAMMER'
  const [streak, setStreak] = useState(0);
  const [bonusShown, setBonusShown] = useState(null);
  const [currentChoices, setCurrentChoices] = useState([]); // 4 cards shown per scenario

  const handleModeSelect = (newMode) => {
    setMode(newMode);
    if (newMode === "TEST") {
      const generated = generateScenarios(quizQuestionCount);
      setScenarios(generated);
      setHackerHp(100);
      setScammerHp(100);
      setCurrentScenarioIndex(0);
      setQuizStatus("PLAYING");
      setStreak(0);
      setBonusShown(null);
      setCurrentChoices(generateChoices(generated[0].correctId));
    }
  };

  const handleClick = (fn) => {
    playSfx(ASSETS.sounds.click);
    fn();
  };

  const calculateDamage = () => {
    // Determine damage multiplier
    const totalQuestions = quizQuestionCount;
    // Base damage to kill the scammer precisely if all are correct
    let scammerDmg = Math.ceil(100 / totalQuestions);

    // Hacker damage depends on difficulty
    let hackerDmg = 10;
    if (quizDifficulty === "EASY")
      hackerDmg = Math.ceil(100 / (totalQuestions * 0.8)); // forgive 20%
    if (quizDifficulty === "MEDIUM")
      hackerDmg = Math.ceil(100 / (totalQuestions * 0.5)); // forgive 50%
    if (quizDifficulty === "HARD")
      hackerDmg = Math.ceil(100 / (totalQuestions * 0.3)); // forgive 30%

    return { scammerDmg, hackerDmg };
  };

  const getStreakBonus = (newStreak) => {
    if (newStreak >= 4) return 20;
    if (newStreak === 3) return 10;
    if (newStreak === 2) return 5;
    return 0;
  };

  const handleAnswer = (cardId) => {
    if (quizStatus !== "PLAYING") return;
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const currentScenario = scenarios[currentScenarioIndex];
    const isCorrect = cardId === currentScenario.correctId;
    const { scammerDmg, hackerDmg } = calculateDamage();

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = getStreakBonus(newStreak);
      const totalDmg = scammerDmg + bonus;

      if (bonus > 0) {
        setBonusShown(bonus);
        setTimeout(() => setBonusShown(null), 1200);
      }

      playSfx(ASSETS.sounds.correct); // Positive feedback
      setShakeTarget("SCAMMER");
      const newHp = Math.max(0, scammerHp - totalDmg);
      setScammerHp(newHp);

      if (newHp === 0 || currentScenarioIndex === scenarios.length - 1) {
        checkWinCondition(newHp, hackerHp);
      } else {
        setTimeout(() => {
          setShakeTarget(null);
          const nextIdx = currentScenarioIndex + 1;
          setCurrentScenarioIndex(nextIdx);
          setCurrentChoices(generateChoices(scenarios[nextIdx].correctId));
        }, 800);
      }
    } else {
      setStreak(0);
      playSfx(ASSETS.sounds.incorrect);
      setShakeTarget("HACKER");
      const newHp = Math.max(0, hackerHp - hackerDmg);
      setHackerHp(newHp);

      if (newHp === 0 || currentScenarioIndex === scenarios.length - 1) {
        checkWinCondition(scammerHp, newHp);
      } else {
        setTimeout(() => {
          setShakeTarget(null);
          const nextIdx = currentScenarioIndex + 1;
          setCurrentScenarioIndex(nextIdx);
          setCurrentChoices(generateChoices(scenarios[nextIdx].correctId));
        }, 800);
      }
    }
  };

  const checkWinCondition = (finalScammerHp, finalHackerHp) => {
    setTimeout(() => {
      setShakeTarget(null);
      stopBgm(); // Stop background music on result screen
      if (finalScammerHp <= finalHackerHp && finalHackerHp > 0) {
        setQuizStatus("WON");
        playSfx(ASSETS.sounds.win);
      } else {
        setQuizStatus("LOST");
        playSfx(ASSETS.sounds.lost);
      }
    }, 800);
  };

  // =============== RENDER MODE SELECT SELECTION ===============
  if (!mode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-yellow-400 font-mono relative p-6">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(202,138,4,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(202,138,4,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="z-10 w-full max-w-2xl bg-slate-900 border border-yellow-500/50 rounded-2xl p-8 shadow-[0_0_30px_rgba(202,138,4,0.2)] animate-fade-in-up">
          <h2 className="text-3xl font-black mb-8 text-center tracking-widest uppercase flex items-center justify-center gap-3">
            <Medal className="w-8 h-8" /> เลือกระบบแบบทดสอบ
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Knowledge Mode */}
            <button
              onClick={() => handleClick(() => handleModeSelect("KNOWLEDGE"))}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-yellow-400 p-8 rounded-xl flex flex-col items-center gap-4 transition-all group"
            >
              <BookOpen className="w-16 h-16 text-slate-400 group-hover:text-yellow-400 transition-colors" />
              <h3 className="text-xl font-bold text-white tracking-wider">
                โหมดให้ความรู้
              </h3>
              <p className="text-sm text-slate-400 text-center">
                เรียนรู้วิธีการป้องกันตัวจากภัยไซเบอร์ต่างๆ ผ่านการ์ดความรู้
              </p>
            </button>

            {/* Test Mode */}
            <button
              onClick={() => handleClick(() => handleModeSelect("TEST"))}
              className="flex-1 bg-gradient-to-br from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 border-2 border-yellow-400 p-8 rounded-xl flex flex-col items-center gap-4 transition-all shadow-[0_0_20px_rgba(202,138,4,0.4)] group"
            >
              <Swords className="w-16 h-16 text-slate-900 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-900 tracking-wider">
                โหมดทดสอบ
              </h3>
              <p className="text-sm text-slate-800 text-center font-semibold">
                สวมบทบาทเป็น Hacker ที่ดี ปราบ Scammer ให้สิ้นซาก
              </p>
            </button>
          </div>

          <button
            onClick={() => handleClick(() => setPhase(GAME_PHASES.MENU))}
            className="mt-8 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors py-2 uppercase tracking-widest text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  // =============== RENDER KNOWLEDGE MODE ===============
  if (mode === "KNOWLEDGE") {
    const card = DEFENSE_CARDS[currentDefIndex];
    return (
      <div className="flex min-h-screen flex-col items-center bg-slate-950 text-white font-mono relative p-4 md:p-8">
        <div className="w-full max-w-4xl z-10 flex flex-col gap-6 animate-fade-in-up pb-20">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <button
              onClick={() => handleClick(() => setMode(null))}
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-5 h-5" /> กลับ
            </button>
            <h2 className="text-xl md:text-2xl font-black text-yellow-400 tracking-widest uppercase">
              โหมดให้ความรู้
            </h2>
            <div className="w-20" /> {/* Spacer */}
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-slate-900/50 p-6 md:p-10 rounded-2xl border border-slate-800">
            {/* Image */}
            <div className="w-full md:w-1/3 aspect-[3/4] relative rounded-xl overflow-hidden border-4 border-yellow-500/30 shadow-[0_0_30px_rgba(202,138,4,0.15)] flex-shrink-0">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold tracking-widest uppercase border border-yellow-500/50 pb-1.5">
                  ความสามารถในการป้องกัน
                </span>
                <h3 className="text-3xl font-black text-white mt-4 drop-shadow-md">
                  {card.name}
                </h3>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border-l-4 border-blue-500">
                <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> คำอธิบาย
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  {card.description}
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-xl border-l-4 border-green-500">
                <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> ตัวอย่างสถานการณ์
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base italic">
                  "{card.example}"
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() =>
                handleClick(() =>
                  setCurrentDefIndex((prev) => Math.max(0, prev - 1)),
                )
              }
              disabled={currentDefIndex === 0}
              className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl transition-all hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              ก่อนหน้า
            </button>
            <div className="text-slate-500 font-bold tracking-widest">
              {currentDefIndex + 1} / {DEFENSE_CARDS.length}
            </div>
            <button
              onClick={() =>
                handleClick(() =>
                  setCurrentDefIndex((prev) =>
                    Math.min(DEFENSE_CARDS.length - 1, prev + 1),
                  ),
                )
              }
              disabled={currentDefIndex === DEFENSE_CARDS.length - 1}
              className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-xl transition-all hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =============== RENDER TEST MODE ===============
  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div
      id="quiz-top"
      className="flex min-h-screen flex-col items-center bg-slate-950 text-white font-mono relative p-4 pb-24 overflow-hidden"
    >
      {/* Scroll anchor - placed at the very top so scrollIntoView works */}
      <div
        ref={topRef}
        className="absolute top-0 left-0 w-0 h-0"
        aria-hidden="true"
      />
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 z-10 pt-4">
        <button
          onClick={() => handleClick(() => setMode(null))}
          className="flex items-center gap-2 text-slate-400 hover:text-white font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-5 h-5" /> ยอมแพ้
        </button>
        <div className="bg-slate-900 border border-slate-700 px-6 py-2 rounded-full font-black text-yellow-400 tracking-[0.2em]">
          BATTLE: {Math.min(currentScenarioIndex + 1, scenarios.length)} /{" "}
          {scenarios.length}
        </div>
      </div>

      {/* Battle Arena */}
      <div className="w-full max-w-5xl grid grid-cols-2 gap-4 md:gap-12 z-10 mb-8 px-2">
        {/* Hacker (Player) */}
        <div
          className={`flex flex-col items-center transition-transform ${shakeTarget === "HACKER" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
        >
          <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4">
            <img
              src={ASSETS.test.hacker}
              alt="Hacker"
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
            />
            {shakeTarget === "HACKER" && (
              <div className="absolute inset-0 bg-red-500/40 rounded-full animate-ping" />
            )}
          </div>
          <h3 className="font-black text-blue-400 text-xl tracking-widest mb-2 uppercase">
            Hacker (เรา)
          </h3>
          {/* HP Bar */}
          <div className="w-full bg-slate-800 h-6 rounded-full overflow-hidden border-2 border-slate-700 relative">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
              style={{ width: `${hackerHp}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black shadow-black drop-shadow-md">
              {hackerHp} HP
            </span>
          </div>
        </div>

        {/* Scammer (Enemy) */}
        <div
          className={`flex flex-col items-center transition-transform ${shakeTarget === "SCAMMER" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
        >
          <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4">
            <img
              src={ASSETS.test.scammer}
              alt="Scammer"
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]"
            />
            {shakeTarget === "SCAMMER" && (
              <div className="absolute inset-0 bg-red-500/40 rounded-full animate-ping" />
            )}
          </div>
          <h3 className="font-black text-red-400 text-xl tracking-widest mb-2 uppercase">
            Scammer
          </h3>
          {/* HP Bar */}
          <div className="w-full bg-slate-800 h-6 rounded-full overflow-hidden border-2 border-slate-700 relative">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 ease-out"
              style={{ width: `${scammerHp}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black shadow-black drop-shadow-md">
              {scammerHp} HP
            </span>
          </div>
        </div>
      </div>

      {quizStatus === "PLAYING" ? (
        <div className="w-full max-w-5xl flex flex-col items-center z-10 animate-fade-in-up">
          {/* Scenario Question */}
          <div className="bg-slate-900 border-2 border-blue-500/50 p-6 md:p-8 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.15)] w-full mb-8 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <h4 className="text-xl md:text-2xl font-bold leading-loose text-white relative z-10 drop-shadow-sm">
              {currentScenario?.text}
            </h4>
          </div>

          {/* Streak Banner */}
          {streak >= 2 && (
            <div
              className={`flex items-center justify-center gap-2 py-2 px-6 rounded-xl border font-black tracking-widest text-sm uppercase select-none
                ${
                  streak >= 4
                    ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                    : streak === 3
                      ? "bg-orange-500/20 border-orange-400 text-orange-300"
                      : "bg-blue-500/20 border-blue-400 text-blue-300"
                }`}
            >
              🔥 Combo x{streak}
              {streak >= 4
                ? " — โบนัส +20!"
                : streak === 3
                  ? " — โบนัส +10!"
                  : " — โบนัส +5!"}
            </div>
          )}

          {/* Bonus Damage Popup */}
          {bonusShown !== null && (
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
              <span className="text-5xl font-black text-yellow-300 drop-shadow-[0_0_20px_rgba(234,179,8,0.9)] animate-bounce select-none">
                +{bonusShown}⚡
              </span>
            </div>
          )}

          <p className="text-white uppercase tracking-widest text-sm font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />{" "}
            เลือกการ์ดเพื่อป้องกันจากสถานการณ์นี้
          </p>

          {/* Defense Cards Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full px-2">
            {currentChoices.map((card) => (
              <button
                key={card.id}
                onClick={() => handleAnswer(card.id)}
                disabled={shakeTarget !== null}
                className="bg-slate-900 border border-slate-700 hover:border-yellow-400 rounded-xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(202,138,4,0.15)] transition-all flex flex-col"
              >
                <div className="aspect-[3/4] w-full border-b border-slate-800 p-2 pb-0">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover rounded-t-lg shadow-inner"
                  />
                </div>
                <div className="p-3 text-center flex-1 flex items-center justify-center">
                  <span className="font-bold text-xs sm:text-sm text-slate-300">
                    {card.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-slate-900 border-2 border-slate-700 p-8 rounded-2xl flex flex-col items-center text-center z-10 mt-8 animate-pop">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl ${quizStatus === "WON" ? "bg-green-500/20 shadow-green-500/30" : "bg-red-500/20 shadow-red-500/30"}`}
          >
            {quizStatus === "WON" ? (
              <Heart className="w-12 h-12 text-green-400 animate-pulse" />
            ) : (
              <Skull className="w-12 h-12 text-red-500 animate-pulse" />
            )}
          </div>

          <h2
            className={`text-3xl font-black tracking-widest uppercase mb-4 ${quizStatus === "WON" ? "text-green-400" : "text-red-500"}`}
          >
            {quizStatus === "WON"
              ? "ภารกิจป้องกันสำเร็จ!"
              : "ระบบถูกเจาะทำลาย!"}
          </h2>

          <p className="text-slate-300 font-bold mb-8 text-lg">
            {quizStatus === "WON"
              ? "คุณสามารถกำจัดไวรัสและรับมือกับ Scammer ได้อย่างยอดเยี่ยม"
              : "คุณรับมือกับภัยคุกคามผิดพลาด ข้อมูลสำคัญของคุณถูกขโมยไปแล้ว!"}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                handleClick(() => {
                  const newScenarios = generateScenarios(quizQuestionCount);
                  setScenarios(newScenarios);
                  setHackerHp(100);
                  setScammerHp(100);
                  setCurrentScenarioIndex(0);
                  setQuizStatus("PLAYING");
                  setCurrentChoices(generateChoices(newScenarios[0].correctId));
                  setStreak(0);
                  setBonusShown(null);
                  playBgm(ASSETS.sounds.game); // Restart BGM for next game
                });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-widest transition-all"
            >
              ลองอีกครั้ง
            </button>
            <button
              onClick={() => handleClick(() => setPhase(GAME_PHASES.MENU))}
              className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-widest shadow-[0_0_15px_rgba(202,138,4,0.3)] transition-all"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseQuiz;
