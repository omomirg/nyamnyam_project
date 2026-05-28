import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "start" | "game" | "correct" | "wrong" | "end";

interface Question {
  sentence: string;
  answer: boolean; // true = O, false = X
  explanation: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    sentence: "채소는 매일 먹어야 건강에 좋다.",
    answer: true,
    explanation: "채소에는 비타민, 미네랄, 식이섬유가 풍부해 매일 섭취하는 것이 건강에 매우 좋습니다.",
  },
  {
    sentence: "탄산음료는 물과 같은 수분 보충 효과가 있다.",
    answer: false,
    explanation: "탄산음료에는 당분과 카페인이 포함되어 있어 오히려 이뇨 작용으로 탈수를 유발할 수 있습니다.",
  },
  {
    sentence: "단백질은 근육을 만드는 데 필요한 영양소다.",
    answer: true,
    explanation: "단백질은 근육, 뼈, 피부 등 신체 조직을 구성하는 핵심 영양소입니다.",
  },
  {
    sentence: "과일을 많이 먹으면 살이 찌지 않는다.",
    answer: false,
    explanation: "과일에는 천연 당분(과당)이 포함되어 있어 과도하게 섭취하면 체중 증가로 이어질 수 있습니다.",
  },
  {
    sentence: "아침 식사를 거르면 집중력이 떨어질 수 있다.",
    answer: true,
    explanation: "뇌는 포도당을 주 에너지원으로 사용하므로, 아침을 거르면 집중력과 기억력이 저하됩니다.",
  },
  {
    sentence: "기름진 음식은 무조건 몸에 해롭다.",
    answer: false,
    explanation: "올리브오일, 견과류 등의 불포화지방은 심혈관 건강에 유익한 좋은 지방입니다.",
  },
  {
    sentence: "철분이 부족하면 빈혈이 생길 수 있다.",
    answer: true,
    explanation: "철분은 적혈구의 헤모글로빈 생성에 필수적이며, 부족하면 철결핍성 빈혈이 발생합니다.",
  },
  {
    sentence: "하루에 물을 1컵만 마셔도 충분하다.",
    answer: false,
    explanation: "성인 기준 하루 약 8컵(2L)의 물 섭취가 권장됩니다. 1컵은 턱없이 부족합니다.",
  },
  {
    sentence: "칼슘은 뼈와 치아를 튼튼하게 하는 데 도움을 준다.",
    answer: true,
    explanation: "칼슘은 뼈와 치아의 주요 구성 성분으로, 성장기와 노년기에 특히 중요합니다.",
  },
  {
    sentence: "식사를 빠르게 먹으면 소화에 더 좋다.",
    answer: false,
    explanation: "빠르게 먹으면 씹는 횟수가 줄어 소화 효소와 충분히 혼합되지 못해 소화 불량을 초래합니다.",
  },
];

const RESULT_MESSAGES = [
  { min: 0,  max: 3,  title: "🌱 영양 새싹",    desc: "아직 배울 것이 많아요! 다시 도전해보세요." },
  { min: 4,  max: 6,  title: "🥗 영양 탐험가",  desc: "꽤 잘 알고 있네요! 조금만 더 공부해봐요." },
  { min: 7,  max: 9,  title: "🥦 영양 전문가",  desc: "대단해요! 거의 완벽한 영양 지식을 갖췄어요." },
  { min: 10, max: 10, title: "🏆 영양 마스터",  desc: "완벽합니다! 당신은 진정한 영양 마스터예요!" },
];

const SIDEBAR_ITEMS = [
  { icon: "🍎", label: "영양 친구" },
  { icon: "🥗", label: "미니 게임" },
  { icon: "🏆", label: "나의 건강 캐릭터" },
  { icon: "🥦", label: "영양 배움터" },
  { icon: "🍑", label: "나의 영양 기록" },
];

const NAV_LINKS = ["Home", "Games", "Lessons", "Leaderboard", "Support"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OXGame({ onGameComplete }: { onGameComplete?: () => void }){
  const [screen, setScreen] = useState<Screen>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [cardAnim, setCardAnim] = useState<"" | "shake" | "pop">("");

  const q = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;

  const getResultInfo = useCallback((s: number) =>
    RESULT_MESSAGES.find((r) => s >= r.min && s <= r.max)!, []);

  const handleAnswer = (chosen: boolean) => {
    const correct = chosen === q.answer;
    setLastCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setCardAnim(correct ? "pop" : "shake");
    setTimeout(() => {
      setCardAnim("");
      setScreen(correct ? "correct" : "wrong");
      setAnimKey((k) => k + 1);
    }, 420);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= total) {
      setScreen("end");
    } else {
      setCurrentIndex(nextIndex);
      setScreen("game");
      setAnimKey((k) => k + 1);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentIndex(0);
    setScreen("start");
    setAnimKey((k) => k + 1);
  };

  const result = getResultInfo(score);
  const progressPct = ((currentIndex) / total) * 100;

  // ─── Screen renders ──────────────────────────────────────────────────────────

  const StartScreen = () => (
    <div style={s.centerWrap}>
      <div style={s.startCard} key="start">
        <div style={s.startIconRing}>
          <span style={{ fontSize: 52 }}>🧠</span>
        </div>
        <h1 style={s.gameTitle}>O/X 게임</h1>
        <p style={s.gameSubtitle}>한 문장씩 10번</p>
        <p style={s.gameDesc}>
          맞는 말이면 <span style={s.oTag}>O</span>, 틀린 말이면 <span style={s.xTag}>X</span>!<br />
          총 10문장을 끝내면 최종 점수를 확인해요.
        </p>
        <button style={s.btnPrimary} onClick={() => { setCurrentIndex(0); setScore(0); setScreen("game"); setAnimKey(k => k+1); }}>
          O/X 시작 →
        </button>
      </div>
    </div>
  );

  const GameScreen = () => (
    <div style={s.gameWrap} key={animKey}>
      {/* Progress */}
      <div style={s.progressArea}>
        <span style={s.progressLabel}>문장 {currentIndex + 1} / {total}</span>
        <div style={s.progressTrack}>
          <div style={{ ...s.progressBar, width: `${progressPct + 10}%` }} />
        </div>
      </div>

      {/* Sentence card */}
      <div style={{
        ...s.sentenceCard,
        ...(cardAnim === "shake" ? s.shake : cardAnim === "pop" ? s.pop : {}),
      }}>
        <span style={s.qNum}>Q{currentIndex + 1}</span>
        <p style={s.sentenceText}>{q.sentence}</p>
      </div>

      {/* O / X buttons */}
      <div style={s.oxRow}>
        <button style={s.btnO} onClick={() => handleAnswer(true)}>
          <span style={s.oxSymbol}>O</span>
          <span style={s.oxLabel}>맞아요</span>
        </button>
        <button style={s.btnX} onClick={() => handleAnswer(false)}>
          <span style={s.oxSymbol}>X</span>
          <span style={s.oxLabel}>틀려요</span>
        </button>
      </div>

      <div style={s.gameFooter}>
        <button style={s.btnOutline} onClick={() => { onGameComplete?.(); setScreen("end"); }}>게임 마치기</button>
      </div>
    </div>
  );

  const FeedbackScreen = ({ isCorrect }: { isCorrect: boolean }) => (
    <div style={s.feedbackWrap} key={animKey}>
      <div style={{ ...s.feedbackBadge, background: isCorrect ? "#E8F5E9" : "#FFEBEE" }}>
        <span style={{ fontSize: 52 }}>{isCorrect ? "✅" : "❌"}</span>
        <h2 style={{ ...s.feedbackTitle, color: isCorrect ? "#2E7D32" : "#C62828" }}>
          {isCorrect ? "정답" : "오답"}
        </h2>
      </div>

      <div style={s.feedbackCard}>
        <p style={s.feedbackSentence}>"{q.sentence}"</p>
        <div style={{ ...s.answerTag, background: q.answer ? "#E3F2FD" : "#FFF3E0" }}>
          정답: <strong>{q.answer ? "O (맞아요)" : "X (틀려요)"}</strong>
        </div>
        {!isCorrect && (
          <p style={s.explanationText}>{q.explanation}</p>
        )}
        {isCorrect && (
          <p style={{ ...s.explanationText, color: "#388E3C" }}>{q.explanation}</p>
        )}
      </div>

      <button style={s.btnPrimary} onClick={handleNext}>
        {currentIndex + 1 >= total ? "결과 보기 →" : "다음으로 넘어가기 →"}
      </button>
    </div>
  );

  const EndScreen = () => (
    <div style={s.endWrap} key={animKey}>
      <div style={s.endLeft}>
        <p style={s.endCaption}>O/X 최종 점수</p>
        <h2 style={s.endTitle}>
          <span style={s.scoreNum}>{score}</span>
          <span style={s.scoreDen}> / {total}</span>
        </h2>
        <p style={s.endDesc}>정답 개수에 따라 다른 메시지가 나와요.</p>

        <div style={s.endBtns}>
          <button style={s.btnPrimary} onClick={handleRestart}>다시 시작하기</button>
          <button style={s.btnOutline} onClick={() => setScreen("start")}>게임 마치기</button>
        </div>
      </div>

      <div style={s.resultCard}>
        <div style={s.resultEmoji}>{result.title.split(" ")[0]}</div>
        <h3 style={s.resultCardTitle}>{result.title.slice(3)}</h3>
        <p style={s.resultCardDesc}>{result.desc}</p>

        {/* Score dots */}
        <div style={s.dotRow}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{
              ...s.dot,
              background: i < score ? "#2E7D52" : "#E0E0E0",
            }} />
          ))}
        </div>

        <div style={s.tagRow}>
          {score === total && <span style={s.tag}>🎯 퍼펙트</span>}
          {score >= 7 && <span style={s.tag}>⚡ 우수</span>}
          {score >= 4 && <span style={s.tag}>📚 도전중</span>}
        </div>
      </div>
    </div>
  );

  // ─── Main layout ─────────────────────────────────────────────────────────────
return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Noto Sans KR', sans-serif; background: #F4F7F4; }
      button { font-family: 'Noto Sans KR', sans-serif; cursor: pointer; transition: opacity 0.15s, transform 0.15s; }
      button:hover { opacity: 0.88; transform: translateY(-1px); }
      button:active { transform: translateY(0); }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-10px); }
        40%      { transform: translateX(10px); }
        60%      { transform: translateX(-6px); }
        80%      { transform: translateX(6px); }
      }
      @keyframes pop {
        0%   { transform: scale(1); }
        50%  { transform: scale(1.04); }
        100% { transform: scale(1); }
      }
      .animate-in { animation: fadeSlideUp 0.4s ease both; }
    `}</style>
    <div style={{ padding: "40px 48px" }}>
      <div className="animate-in" key={screen + animKey} style={s.screenWrap}>
        {screen === "start"   && <StartScreen />}
        {screen === "game"    && <GameScreen />}
        {screen === "correct" && <FeedbackScreen isCorrect={true} />}
        {screen === "wrong"   && <FeedbackScreen isCorrect={false} />}
        {screen === "end"     && <EndScreen />}
      </div>
    </div>
  </>
);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  // Header
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: 60,
    background: "#fff",
    borderBottom: "1px solid #E8EDE8",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4CAF50, #1B5E20)",
  },
  logoText: {
    fontSize: 16,
    fontWeight: 800,
    color: "#1B5E20",
    letterSpacing: "-0.3px",
  },
  headerNav: {
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  navLink: {
    fontSize: 14,
    fontWeight: 600,
    color: "#444",
    textDecoration: "none",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#F4F7F4",
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 13,
  },
  searchInput: {
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: 13,
    fontFamily: "'Noto Sans KR', sans-serif",
    width: 140,
    color: "#333",
  },

  // Layout
  layout: {
    display: "flex",
    minHeight: "calc(100vh - 60px)",
  },

  // Sidebar
  sidebar: {
    width: 200,
    background: "#1B3A2A",
    padding: "28px 0",
    flexShrink: 0,
  },
  sideMenu: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  sideItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#B2DFBB",
    cursor: "pointer",
  },

  // Main
  main: {
    flex: 1,
    padding: "48px 56px",
    overflowY: "auto",
  },
  screenWrap: {
    maxWidth: 760,
    margin: "0 auto",
  },

  // Start
  centerWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "55vh",
  },
  startCard: {
    background: "#fff",
    borderRadius: 28,
    padding: "56px 64px",
    textAlign: "center",
    boxShadow: "0 8px 40px rgba(27,94,32,0.10)",
    maxWidth: 440,
    width: "100%",
  },
  startIconRing: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #C8E6C9, #A5D6A7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  gameTitle: {
    fontSize: 30,
    fontWeight: 900,
    color: "#1B3A2A",
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 15,
    color: "#888",
    marginBottom: 16,
    fontWeight: 600,
  },
  gameDesc: {
    fontSize: 15,
    color: "#555",
    lineHeight: 1.8,
    marginBottom: 32,
  },
  oTag: {
    background: "#E3F2FD",
    color: "#1565C0",
    borderRadius: 6,
    padding: "2px 8px",
    fontWeight: 800,
    fontSize: 16,
  },
  xTag: {
    background: "#FFEBEE",
    color: "#C62828",
    borderRadius: 6,
    padding: "2px 8px",
    fontWeight: 800,
    fontSize: 16,
  },

  // Game
  gameWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  progressArea: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#888",
    letterSpacing: "0.5px",
  },
  progressTrack: {
    height: 8,
    background: "#E0EDE0",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #4CAF50, #1B5E20)",
    borderRadius: 99,
    transition: "width 0.5s ease",
  },
  sentenceCard: {
    background: "#fff",
    borderRadius: 22,
    padding: "36px 40px",
    boxShadow: "0 6px 32px rgba(27,94,32,0.09)",
    minHeight: 140,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "transform 0.2s",
  },
  shake: {
    animation: "shake 0.4s ease",
  },
  pop: {
    animation: "pop 0.4s ease",
  },
  qNum: {
    fontSize: 12,
    fontWeight: 900,
    color: "#4CAF50",
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1B3A2A",
    lineHeight: 1.6,
  },
  oxRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  btnO: {
    background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
    border: "2px solid #90CAF9",
    borderRadius: 18,
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    color: "#1565C0",
  },
  btnX: {
    background: "linear-gradient(135deg, #FFEBEE, #FFCDD2)",
    border: "2px solid #EF9A9A",
    borderRadius: 18,
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    color: "#C62828",
  },
  oxSymbol: {
    fontSize: 44,
    fontWeight: 900,
    lineHeight: 1,
  },
  oxLabel: {
    fontSize: 14,
    fontWeight: 700,
  },
  gameFooter: {
    display: "flex",
    justifyContent: "flex-end",
  },

  // Feedback
  feedbackWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    alignItems: "center",
    maxWidth: 520,
    margin: "0 auto",
    textAlign: "center",
  },
  feedbackBadge: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 900,
  },
  feedbackCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px 32px",
    width: "100%",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    textAlign: "left",
  },
  feedbackSentence: {
    fontSize: 16,
    fontWeight: 700,
    color: "#333",
    fontStyle: "italic",
    lineHeight: 1.6,
  },
  answerTag: {
    display: "inline-block",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 14,
    color: "#333",
  },
  explanationText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 1.75,
  },

  // End
  endWrap: {
    display: "flex",
    gap: 40,
    alignItems: "flex-start",
  },
  endLeft: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  endCaption: {
    fontSize: 13,
    fontWeight: 700,
    color: "#888",
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
  },
  endTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1B3A2A",
  },
  scoreNum: {
    fontSize: 64,
    fontWeight: 900,
    color: "#2E7D52",
    lineHeight: 1,
  },
  scoreDen: {
    fontSize: 28,
    color: "#999",
  },
  endDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  endBtns: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap" as const,
    marginTop: 4,
  },

  resultCard: {
    flex: 1,
    background: "#fff",
    borderRadius: 24,
    padding: "36px 32px",
    boxShadow: "0 8px 40px rgba(27,94,32,0.10)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    textAlign: "center",
  },
  resultEmoji: {
    fontSize: 56,
  },
  resultCardTitle: {
    fontSize: 22,
    fontWeight: 900,
    color: "#1B3A2A",
  },
  resultCardDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 1.7,
  },
  dotRow: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap" as const,
    justifyContent: "center",
    marginTop: 4,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    transition: "background 0.3s",
  },
  tagRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap" as const,
    justifyContent: "center",
    marginTop: 4,
  },
  tag: {
    background: "#E8F5E9",
    color: "#2E7D32",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 700,
  },

  // Buttons
  btnPrimary: {
    background: "#1B3A2A",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "13px 28px",
    fontSize: 15,
    fontWeight: 700,
  },
  btnOutline: {
    background: "transparent",
    color: "#1B3A2A",
    border: "2px solid #1B3A2A",
    borderRadius: 12,
    padding: "11px 24px",
    fontSize: 15,
    fontWeight: 700,
  },
};
