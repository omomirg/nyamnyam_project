import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "start" | "game" | "correct" | "wrong" | "end";

interface FoodItem {
  name: string;
  emoji: string;
  sugarG: number;   // 총 당 함량(g)
  serving: string;  // 1회 제공량 설명
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// 각설탕 1개 ≈ 3g 기준

const FOODS: FoodItem[] = [
  { name: "콜라 (355ml)",       emoji: "🥤", sugarG: 39, serving: "캔 1개" },
  { name: "초코파이",            emoji: "🍫", sugarG: 21, serving: "1개" },
  { name: "딸기 우유 (200ml)",   emoji: "🍓", sugarG: 18, serving: "1팩" },
  { name: "요구르트 (65ml)",     emoji: "🫙", sugarG: 11, serving: "1병" },
  { name: "오렌지 주스 (200ml)", emoji: "🍊", sugarG: 21, serving: "1팩" },
  { name: "아이스크림 바",        emoji: "🍦", sugarG: 15, serving: "1개" },
  { name: "스포츠음료 (500ml)",  emoji: "💧", sugarG: 34, serving: "1병" },
  { name: "빵 (식빵 2장)",       emoji: "🍞", sugarG: 6,  serving: "2장" },
  { name: "케첩 (1큰술)",        emoji: "🍅", sugarG: 4,  serving: "15ml" },
  { name: "그래놀라 바",          emoji: "🌾", sugarG: 12, serving: "1개" },
];

const toSugarCubes = (g: number) => Math.round(g / 3);

const SIDEBAR_ITEMS = [
  { icon: "🍓", label: "영양 친구" },
  { icon: "🌿", label: "미니 게임" },
  { icon: "🏆", label: "나의 건강 캐릭터" },
  { icon: "🌱", label: "영양 배움터" },
  { icon: "🍒", label: "나의 영양 기록" },
];

const NAV_LINKS = ["Home", "Games", "Lessons", "Leaderboard", "Support"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SugarCubeGame({ onGameComplete }: { onGameComplete?: () => void }) {
  const [screen, setScreen]         = useState<Screen>("start");
  const [round, setRound]           = useState(0);
  const [guess, setGuess]           = useState(1);
  const [score, setScore]           = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [retried, setRetried]       = useState(false);
  const [animKey, setAnimKey]       = useState(0);

  const food    = FOODS[round] ?? FOODS[0];
  const answer  = toSugarCubes(food.sugarG);
  const total   = FOODS.length;

  const handleSubmit = () => {
    const correct = guess === answer;
    setLastCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setScreen(correct ? "correct" : "wrong");
    setAnimKey((k) => k + 1);
  };

  const handleNext = () => {
    const next = round + 1;
    if (next >= total) {
      setScreen("end");
    } else {
      setRound(next);
      setGuess(1);
      setRetried(false);
      setScreen("game");
      setAnimKey((k) => k + 1);
    }
  };

  const handleRetry = () => {
    setRetried(true);
    setGuess(1);
    setScreen("game");
  };

  const handleRestart = () => {
    setRound(0);
    setGuess(1);
    setScore(0);
    setRetried(false);
    setScreen("start");
    setAnimKey((k) => k + 1);
  };

  const clampGuess = (v: number) => Math.max(1, Math.min(50, v));

  // ─── Cube visualizer ──────────────────────────────────────────────────────

  const CubeGrid = ({ count, highlight }: { count: number; highlight?: boolean }) => (
    <div style={s.cubeGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ ...s.cube, background: highlight ? "#F59E0B" : "#CBD5E1" }} />
      ))}
    </div>
  );

  // ─── Screens ──────────────────────────────────────────────────────────────

  const StartScreen = () => (
    <div style={s.centerWrap}>
      <div style={s.startCard}>
        <div style={s.startIconWrap}>
          <span style={{ fontSize: 52 }}>🍬</span>
        </div>
        <h1 style={s.gameTitle}>각설탕 게임</h1>
        <p style={s.gameTitleSub}>내가 먹는 음식 속 각설탕은?</p>
        <p style={s.gameDesc}>
          음식 이미지를 확인하고 각설탕을 접시에 올려<br />정확히 맞춰보세요.
          <br /><span style={s.hintChip}>💡 각설탕 1개 ≈ 당 3g</span>
        </p>
        <button style={s.btnDark} onClick={() => setScreen("game")}>
          라운드 시작 →
        </button>
      </div>
    </div>
  );

  const GameScreen = () => (
    <div style={s.gameWrap} key={animKey}>
      {/* Progress */}
      <div style={s.progressRow}>
        <span style={s.roundLabel}>라운드 {round + 1} / {total}</span>
        <div style={s.progressTrack}>
          <div style={{ ...s.progressFill, width: `${((round) / total) * 100 + 10}%` }} />
        </div>
      </div>

      <div style={s.gameLayout}>
        {/* Left panel */}
        <div style={s.gameLeft}>
          <p style={s.hintText}>💡 3g당 각설탕 1개</p>

          {/* Counter */}
          <div style={s.counterCard}>
            <p style={s.counterTitle}>각설탕 개수 선택</p>
            <div style={s.counterRow}>
              <button style={s.counterBtn} onClick={() => setGuess(clampGuess(guess - 1))}>－</button>
              <div style={s.counterCircle}>
                <span style={s.counterNum}>{guess}</span>
                <span style={s.counterSub}>개</span>
              </div>
              <button style={s.counterBtn} onClick={() => setGuess(clampGuess(guess + 1))}>＋</button>
            </div>
            <CubeGrid count={guess} highlight />
          </div>

          <button style={s.btnDark} onClick={handleSubmit}>정답 확인</button>
        </div>

        {/* Right: quiz card */}
        <div style={s.gameRight}>
          <div style={s.quizCard}>
            <div style={s.quizEmoji}>{food.emoji}</div>
            <div style={s.quizInfo}>
              <p style={s.quizName}>{food.name}</p>
              <p style={s.quizServing}>1회 제공량: {food.serving}</p>
              <p style={s.quizSugar}>총 당 함량: <strong>{food.sugarG}g</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div style={s.bottomBar}>
        <button style={s.btnOutline} onClick={() => { onGameComplete?.(); setScreen("end"); }}>게임 마치기</button>
      </div>
    </div>
  );

  const CorrectScreen = () => (
    <div style={s.feedbackWrap} key={animKey}>
      <div style={s.resultLayout}>
        <div style={s.resultLeft}>
          <span style={s.resultTagCorrect}>정답 ✓</span>
          <h2 style={s.resultHeading}>맞았어요! 🎉</h2>
          <p style={s.resultDesc}>
            <strong>{food.name}</strong>에는 당 {food.sugarG}g,<br />
            각설탕 <strong>{answer}개</strong>에 해당해요!
          </p>
          <button style={s.btnDark} onClick={handleNext}>
            {round + 1 >= total ? "결과 보기 →" : "다음 음식 →"}
          </button>
        </div>

        <div style={{ ...s.resultCard, borderColor: "#86EFAC" }}>
          <div style={s.resultCardEmoji}>{food.emoji}</div>
          <p style={s.resultCardName}>{food.name}</p>
          <div style={s.resultCardStat}>
            <span style={s.statBig}>{answer}</span>
            <span style={s.statUnit}>개</span>
          </div>
          <CubeGrid count={answer} highlight />
        </div>
      </div>
    </div>
  );

  const WrongScreen = () => (
    <div style={s.feedbackWrap} key={animKey}>
      <div style={s.resultLayout}>
        <div style={s.resultLeft}>
          <span style={s.resultTagWrong}>오답 ✗</span>
          <h2 style={s.resultHeading}>틀렸어요!</h2>
          <p style={s.resultDesc}>
            정답은 각설탕 <strong>{answer}개</strong>예요.<br />
            (당 {food.sugarG}g ÷ 3g = {answer}개)<br />
            {!retried && "다시 한번 도전해볼까요?"}
          </p>
          <div style={s.btnRow}>
            {!retried && (
              <button style={s.btnOutline} onClick={handleRetry}>다시 도전하기</button>
            )}
            <button style={s.btnDark} onClick={handleNext}>
              {round + 1 >= total ? "결과 보기 →" : "다음 음식 →"}
            </button>
          </div>
        </div>

        <div style={{ ...s.resultCard, borderColor: "#FCA5A5" }}>
          <div style={s.resultCardEmoji}>{food.emoji}</div>
          <p style={s.resultCardName}>{food.name}</p>
          <div style={s.resultCardStat}>
            <span style={{ ...s.statBig, color: "#DC2626" }}>{guess}</span>
            <span style={s.statUnit}>→</span>
            <span style={{ ...s.statBig, color: "#16A34A" }}>{answer}</span>
            <span style={s.statUnit}>개</span>
          </div>
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>내 답 → 정답</p>
          <CubeGrid count={answer} />
        </div>
      </div>
    </div>
  );

  const EndScreen = () => {
    const pct = Math.round((score / total) * 100);
    const msg =
      score === total ? "완벽해요! 영양 마스터! 🏆" :
      score >= 7      ? "훌륭해요! 거의 다 맞췄어요! 🥇" :
      score >= 4      ? "잘했어요! 조금만 더 공부해봐요. 💪" :
                        "다시 도전해봐요! 할 수 있어요. 🌱";

    return (
      <div style={s.endWrap} key={animKey}>
        <div style={s.endLeft}>
          <p style={s.endCaption}>게임 종료!</p>
          <div style={s.scoreBlock}>
            <span style={s.scoreBig}>{score}</span>
            <span style={s.scoreTotal}> / {total}</span>
          </div>
          <p style={s.endMsg}>{msg}</p>
          <div style={s.btnRow}>
            <button style={s.btnDark} onClick={handleRestart}>다시 시작</button>
            <button style={s.btnOutline} onClick={() => setScreen("start")}>게임 종료</button>
          </div>
        </div>

        <div style={s.endCard}>
          <div style={s.donutWrap}>
            <svg viewBox="0 0 64 64" width={120} height={120}>
              <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke="#16A34A"
                strokeWidth="8"
                strokeDasharray={`${pct * 1.759} 176`}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
              <text x="32" y="36" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1B3A2A">
                {pct}%
              </text>
            </svg>
          </div>
          <p style={s.endCardTitle}>최종 점수</p>
          <p style={s.endCardDesc}>{score}문제 정답</p>

          <div style={s.tagRow}>
            {score === total && <span style={s.tag}>🎯 퍼펙트</span>}
            {score >= 7      && <span style={s.tag}>⚡ 우수</span>}
            {score >= 4      && <span style={s.tag}>📚 도전중</span>}
            {score < 4       && <span style={s.tag}>🌱 성장중</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
  <>
    <style>{`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fade-up { animation: fadeUp 0.38s ease both; }
    `}</style>
    <div style={{ padding: "40px 48px" }}>
      <div className="fade-up" key={screen + animKey} style={s.screenInner}>
        {screen === "start"   && <StartScreen />}
        {screen === "game"    && <GameScreen />}
        {screen === "correct" && <CorrectScreen />}
        {screen === "wrong"   && <WrongScreen />}
        {screen === "end"     && <EndScreen />}
      </div>
    </div>
  </>
);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  // ── Header
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 28px", height: 58,
    background: "#fff", borderBottom: "1px solid #E5E7EB",
    position: "sticky", top: 0, zIndex: 100,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #FCD34D, #F59E0B)",
  },
  siteTitle: { fontSize: 15, fontWeight: 800, color: "#92400E" },
  nav: { display: "flex", gap: 22 },
  navLink: { fontSize: 13, fontWeight: 600, color: "#444", textDecoration: "none" },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#F3F4F6", borderRadius: 20, padding: "6px 14px",
  },
  searchInput: {
    border: "none", background: "transparent", outline: "none",
    fontSize: 13, fontFamily: "inherit", width: 130, color: "#333",
  },

  // ── Body
  bodyWrap: { display: "flex", minHeight: "calc(100vh - 58px)" },

  // ── Sidebar
  sidebar: {
    width: 196, background: "#1C1917", flexShrink: 0, padding: "24px 0",
  },
  sideList: { listStyle: "none", display: "flex", flexDirection: "column", gap: 2 },
  sideItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 18px", fontSize: 13, fontWeight: 600,
    color: "#D6D3D1", cursor: "pointer",
  },

  // ── Main
  main: { flex: 1, padding: "44px 52px", overflowY: "auto", background: "#F8F9FA" },
  screenInner: { maxWidth: 820, margin: "0 auto" },

  // ── Start
  centerWrap: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "55vh" },
  startCard: {
    background: "#fff", borderRadius: 28, padding: "52px 60px",
    textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: 440, width: "100%",
  },
  startIconWrap: {
    width: 88, height: 88, borderRadius: "50%",
    background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 20px",
  },
  gameTitle: { fontSize: 26, fontWeight: 900, color: "#1C1917", marginBottom: 4 },
  gameTitleSub: { fontSize: 14, color: "#A8A29E", marginBottom: 16, fontWeight: 600 },
  gameDesc: { fontSize: 14, color: "#57534E", lineHeight: 1.85, marginBottom: 28 },
  hintChip: {
    display: "inline-block", marginTop: 10,
    background: "#FEF9C3", color: "#854D0E", borderRadius: 20,
    padding: "4px 14px", fontSize: 12, fontWeight: 700,
  },

  // ── Game
  gameWrap: { display: "flex", flexDirection: "column", gap: 24 },
  progressRow: { display: "flex", flexDirection: "column", gap: 6 },
  roundLabel: { fontSize: 12, fontWeight: 700, color: "#A8A29E", letterSpacing: "0.5px" },
  progressTrack: { height: 7, background: "#E7E5E4", borderRadius: 99, overflow: "hidden" },
  progressFill: {
    height: "100%", background: "linear-gradient(90deg, #F59E0B, #D97706)",
    borderRadius: 99, transition: "width 0.5s ease",
  },
  gameLayout: { display: "flex", gap: 28, alignItems: "flex-start" },
  gameLeft: { width: 260, display: "flex", flexDirection: "column", gap: 18, flexShrink: 0 },
  hintText: { fontSize: 13, color: "#78716C", fontWeight: 600, background: "#FEF3C7", padding: "8px 14px", borderRadius: 10 },
  counterCard: {
    background: "#fff", borderRadius: 20, padding: "20px 20px 16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    display: "flex", flexDirection: "column", gap: 12, alignItems: "center",
  },
  counterTitle: { fontSize: 13, fontWeight: 700, color: "#78716C" },
  counterRow: { display: "flex", alignItems: "center", gap: 16 },
  counterBtn: {
    width: 36, height: 36, borderRadius: "50%", border: "2px solid #E7E5E4",
    background: "#fff", fontSize: 18, fontWeight: 700, color: "#1C1917",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  counterCircle: {
    width: 72, height: 72, borderRadius: "50%",
    background: "linear-gradient(135deg, #FEF3C7, #FCD34D)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  counterNum: { fontSize: 26, fontWeight: 900, color: "#92400E", lineHeight: 1 },
  counterSub: { fontSize: 11, color: "#92400E", fontWeight: 700 },

  // cube grid
  cubeGrid: { display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", maxWidth: 200 },
  cube: { width: 14, height: 14, borderRadius: 3 },

  gameRight: { flex: 1 },
  quizCard: {
    background: "#fff", borderRadius: 24, overflow: "hidden",
    boxShadow: "0 6px 28px rgba(0,0,0,0.09)",
    display: "flex", flexDirection: "column",
  },
  quizEmoji: {
    fontSize: 96, textAlign: "center" as const,
    background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    padding: "40px 20px",
  },
  quizInfo: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 6 },
  quizName: { fontSize: 20, fontWeight: 900, color: "#1C1917" },
  quizServing: { fontSize: 13, color: "#A8A29E" },
  quizSugar: { fontSize: 14, color: "#57534E" },

  bottomBar: { display: "flex", justifyContent: "flex-end", paddingTop: 8 },

  // ── Feedback
  feedbackWrap: { display: "flex", flexDirection: "column", gap: 0 },
  resultLayout: { display: "flex", gap: 32, alignItems: "flex-start" },
  resultLeft: { flex: 1, display: "flex", flexDirection: "column", gap: 14 },
  resultTagCorrect: {
    display: "inline-block", background: "#DCFCE7", color: "#15803D",
    borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 800,
    width: "fit-content",
  },
  resultTagWrong: {
    display: "inline-block", background: "#FEE2E2", color: "#DC2626",
    borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 800,
    width: "fit-content",
  },
  resultHeading: { fontSize: 26, fontWeight: 900, color: "#1C1917" },
  resultDesc: { fontSize: 14, color: "#57534E", lineHeight: 1.8 },
  btnRow: { display: "flex", gap: 10, flexWrap: "wrap" as const },

  resultCard: {
    width: 220, background: "#fff", borderRadius: 24, padding: "28px 24px",
    boxShadow: "0 6px 28px rgba(0,0,0,0.08)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    border: "2px solid transparent", textAlign: "center" as const,
    flexShrink: 0,
  },
  resultCardEmoji: { fontSize: 52 },
  resultCardName: { fontSize: 14, fontWeight: 700, color: "#1C1917" },
  resultCardStat: { display: "flex", alignItems: "baseline", gap: 4 },
  statBig: { fontSize: 36, fontWeight: 900, color: "#16A34A" },
  statUnit: { fontSize: 14, color: "#A8A29E", fontWeight: 600 },

  // ── End
  endWrap: { display: "flex", gap: 40, alignItems: "flex-start" },
  endLeft: { flex: 1, display: "flex", flexDirection: "column", gap: 14 },
  endCaption: { fontSize: 12, fontWeight: 800, color: "#A8A29E", letterSpacing: "0.5px", textTransform: "uppercase" as const },
  scoreBlock: { display: "flex", alignItems: "baseline", gap: 0 },
  scoreBig: { fontSize: 72, fontWeight: 900, color: "#D97706", lineHeight: 1 },
  scoreTotal: { fontSize: 28, color: "#A8A29E" },
  endMsg: { fontSize: 15, color: "#57534E", lineHeight: 1.7 },
  endCard: {
    width: 240, background: "#fff", borderRadius: 24, padding: "32px 24px",
    boxShadow: "0 8px 36px rgba(0,0,0,0.09)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    textAlign: "center" as const, flexShrink: 0,
  },
  donutWrap: { marginBottom: 4 },
  endCardTitle: { fontSize: 16, fontWeight: 800, color: "#1C1917" },
  endCardDesc: { fontSize: 13, color: "#78716C" },
  tagRow: { display: "flex", gap: 6, flexWrap: "wrap" as const, justifyContent: "center" },
  tag: { background: "#FEF3C7", color: "#92400E", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 },

  // ── Shared buttons
  btnDark: {
    background: "#1C1917", color: "#fff", border: "none",
    borderRadius: 12, padding: "12px 26px", fontSize: 14, fontWeight: 700,
  },
  btnOutline: {
    background: "transparent", color: "#1C1917", border: "2px solid #1C1917",
    borderRadius: 12, padding: "10px 22px", fontSize: 14, fontWeight: 700,
  },
};
