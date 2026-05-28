import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "start" | "guide" | "game" | "result";

interface Card {
  id: number;
  snack: string;
  snackEmoji: string;
  healthy: string;
  healthyEmoji: string;
  flipped: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CARD_DATA: Omit<Card, "id" | "flipped">[] = [
  { snack: "감자칩",    snackEmoji: "🥔", healthy: "사과 슬라이스", healthyEmoji: "🍎" },
  { snack: "탄산음료",  snackEmoji: "🥤", healthy: "물",            healthyEmoji: "💧" },
  { snack: "초코 쿠키", snackEmoji: "🍪", healthy: "견과류",         healthyEmoji: "🥜" },
  { snack: "사탕",      snackEmoji: "🍬", healthy: "딸기",           healthyEmoji: "🍓" },
  { snack: "라면",      snackEmoji: "🍜", healthy: "샐러드",         healthyEmoji: "🥗" },
  { snack: "아이스크림",snackEmoji: "🍦", healthy: "요거트",         healthyEmoji: "🫙" },
];

const MENU_ITEMS = [
  { icon: "🍅", label: "영양 친구" },
  { icon: "🧩", label: "미니 게임" },
  { icon: "🏆", label: "나의 건강 캐릭터" },
  { icon: "📚", label: "영양 배움터" },
  { icon: "🧠", label: "나의 영양 기록" },
];

const NAV_LINKS = ["Home", "Games", "Lessons", "Leaderboard", "Support"];

const GUIDE_STEPS = [
  {
    icon: "💡",
    title: "1) 힌트 확인",
    desc: "화면의 텍스트 힌트를 확인하세요.",
    color: "#FFF3CC",
  },
  {
    icon: "👆",
    title: "2) 선택하기",
    desc: "올바른 건강 음식을 선택합니다.",
    color: "#CCF0D8",
  },
  {
    icon: "✅",
    title: "3) 결과 반영",
    desc: "선택 결과가 바로 적용됩니다.",
    color: "#CCE5FF",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NutritionGame({ onGameComplete }: { onGameComplete?: () => void }) {
  const [screen, setScreen] = useState<Screen>("start");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCount, setFlippedCount] = useState(0);

  const initCards = () => {
    const fresh = CARD_DATA.map((c, i) => ({ ...c, id: i, flipped: false }));
    setCards(fresh);
    setFlippedCount(0);
  };

  useEffect(() => {
    if (screen === "game") initCards();
  }, [screen]);

  const flipCard = (id: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id && !c.flipped ? { ...c, flipped: true } : c))
    );
    setFlippedCount((n) => n + 1);
  };

  const allFlipped = cards.length > 0 && cards.every((c) => c.flipped);

  // ─── Render helpers ──────────────────────────────────────────────────────────

  const StartScreen = () => (
    <section style={styles.centerSection}>
      <div style={styles.startBox}>
        <div style={styles.startEmoji}>🥦</div>
        <h2 style={styles.title}>인식게임: 간식 대체 게임</h2>
        <p style={styles.subtitle}>카드를 뒤집고 올바른 '대체식'을 확인하세요.</p>
        <button style={styles.primaryBtn} onClick={() => setScreen("guide")}>
          게임 시작 →
        </button>
      </div>
    </section>
  );

  const GuideScreen = () => (
    <section style={styles.guideSection}>
      <div style={styles.guideLeft}>
        <h2 style={styles.title}>기본 진행 방식</h2>
        <p style={styles.subtitle}>
          라운드마다 제시되는 힌트를 보고<br />해당되는 항목을 선택합니다.
        </p>
        <div style={styles.btnRow}>
          <button style={styles.outlineBtn} onClick={() => setScreen("start")}>← 이전</button>
          <button style={styles.primaryBtn} onClick={() => setScreen("game")}>다음 →</button>
        </div>
      </div>

      <div style={styles.guideRight}>
        {GUIDE_STEPS.map((step) => (
          <div key={step.title} style={{ ...styles.guideCard, background: step.color }}>
            <span style={styles.guideIcon}>{step.icon}</span>
            <div>
              <h3 style={styles.guideCardTitle}>{step.title}</h3>
              <p style={styles.guideCardDesc}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const GameScreen = () => (
    <section style={styles.gameSection}>
      <div style={styles.gameHeader}>
        <h2 style={styles.title}>카드 6장</h2>
        <p style={styles.subtitle}>카드를 클릭하면 건강한 음식으로 변경됩니다.</p>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(flippedCount / cards.length) * 100}%`,
            }}
          />
        </div>
        <p style={styles.progressText}>{flippedCount} / {cards.length} 완료</p>
      </div>

      <div style={styles.cardGrid}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={styles.cardWrapper}
            onClick={() => flipCard(card.id)}
          >
            <div style={{ ...styles.cardInner, ...(card.flipped ? styles.cardFlipped : {}) }}>
              {/* Front */}
              <div style={{ ...styles.cardFace, ...styles.cardFront }}>
                <span style={styles.cardEmoji}>{card.snackEmoji}</span>
                <p style={styles.cardLabel}>{card.snack}</p>
                <p style={styles.cardHint}>탭해서 대체하기</p>
              </div>
              {/* Back */}
              <div style={{ ...styles.cardFace, ...styles.cardBack }}>
                <span style={styles.cardEmoji}>{card.healthyEmoji}</span>
                <p style={styles.cardLabel}>{card.healthy}</p>
                <p style={{ ...styles.cardHint, color: "#2e7d32" }}>✓ 건강 식품!</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.gameBottom}>
        <button
          style={{ ...styles.primaryBtn, opacity: allFlipped ? 1 : 0.4 }}
          disabled={!allFlipped}
          onClick={() => { onGameComplete?.(); setScreen("result"); }}
        >
          게임 마치기
        </button>
      </div>
    </section>
  );

  const ResultScreen = () => (
    <section style={styles.resultSection}>
      <div style={styles.resultLeft}>
        <div style={styles.resultBadge}>🏅</div>
        <h2 style={styles.title}>인식게임 결과 안내</h2>
        <p style={styles.subtitle}>뒤집힌 카드가 건강한 음식으로 변경되었습니다.</p>

        <div style={styles.resultStats}>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{cards.length}</span>
            <span style={styles.statLabel}>총 카드</span>
          </div>
          <div style={styles.statBox}>
            <span style={{ ...styles.statNum, color: "#2e7d32" }}>{flippedCount}</span>
            <span style={styles.statLabel}>대체 완료</span>
          </div>
        </div>

        <div style={styles.btnRow}>
          <button style={styles.outlineBtn} onClick={() => { initCards(); setScreen("game"); }}>
            다시 시작
          </button>
          <button style={styles.primaryBtn} onClick={() => setScreen("start")}>
            게임 종료
          </button>
        </div>
      </div>

      <div style={styles.resultRight}>
        {cards.map((card) => (
          <div key={card.id} style={styles.resultRow}>
            <span style={styles.resultEmoji}>{card.snackEmoji}</span>
            <span style={styles.resultArrow}>→</span>
            <span style={styles.resultEmoji}>{card.healthyEmoji}</span>
            <span style={styles.resultItemLabel}>{card.snack} → {card.healthy}</span>
          </div>
        ))}
      </div>
    </section>
  );

  // ─── Main render ─────────────────────────────────────────────────────────────

  return (
  <div style={{ padding: "40px 48px" }}>
    {screen === "start"  && <StartScreen />}
    {screen === "guide"  && <GuideScreen />}
    {screen === "game"   && <GameScreen />}
    {screen === "result" && <ResultScreen />}
  </div>
);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const BASE_FONT = "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif";

const styles: Record<string, React.CSSProperties> = {
  // Layout
  layout: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: BASE_FONT,
    background: "#F7F9F4",
  },

  // Sidebar
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "#1A3C2E",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "28px 20px",
    gap: 32,
    flexShrink: 0,
  },
  logo: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.4,
    color: "#A8E6C1",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  menu: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  menuItem: {
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#C8E6D6",
    transition: "background 0.2s",
  },

  // Main
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #E5EDE8",
    padding: "0 32px",
    height: 56,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    gap: 28,
  },
  navLink: {
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    color: "#444",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "40px 48px",
  },

  // Typography
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1A3C2E",
    margin: "0 0 12px",
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    lineHeight: 1.7,
    margin: "0 0 28px",
  },

  // Buttons
  primaryBtn: {
    background: "#1A3C2E",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "13px 28px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: BASE_FONT,
    transition: "opacity 0.2s, transform 0.1s",
  },
  outlineBtn: {
    background: "transparent",
    color: "#1A3C2E",
    border: "2px solid #1A3C2E",
    borderRadius: 12,
    padding: "11px 24px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: BASE_FONT,
  },
  btnRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  // Start screen
  centerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  startBox: {
    textAlign: "center",
    background: "#fff",
    borderRadius: 24,
    padding: "56px 64px",
    boxShadow: "0 4px 32px rgba(26,60,46,0.08)",
    maxWidth: 480,
  },
  startEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },

  // Guide screen
  guideSection: {
    display: "flex",
    gap: 48,
    alignItems: "flex-start",
  },
  guideLeft: {
    flex: 1,
    maxWidth: 320,
  },
  guideRight: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  guideCard: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "20px 24px",
    borderRadius: 16,
  },
  guideIcon: {
    fontSize: 36,
    flexShrink: 0,
  },
  guideCardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1A3C2E",
    margin: "0 0 4px",
  },
  guideCardDesc: {
    fontSize: 14,
    color: "#555",
    margin: 0,
  },

  // Game screen
  gameSection: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  gameHeader: {
    maxWidth: 520,
  },
  progressBar: {
    height: 8,
    background: "#E0EDE6",
    borderRadius: 99,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    background: "#2E7D52",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  progressText: {
    fontSize: 13,
    color: "#888",
    margin: 0,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
    maxWidth: 700,
  },
  cardWrapper: {
    height: 180,
    perspective: 800,
    cursor: "pointer",
  },
  cardInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transition: "transform 0.55s cubic-bezier(.4,2,.6,1)",
  },
  cardFlipped: {
    transform: "rotateY(180deg)",
  },
  cardFace: {
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    backfaceVisibility: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    boxShadow: "0 4px 18px rgba(26,60,46,0.10)",
  },
  cardFront: {
    background: "#fff",
    border: "2px solid #E0EDE6",
  },
  cardBack: {
    background: "#E8F5EE",
    border: "2px solid #A8E6C1",
    transform: "rotateY(180deg)",
  },
  cardEmoji: {
    fontSize: 40,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1A3C2E",
    margin: 0,
  },
  cardHint: {
    fontSize: 11,
    color: "#aaa",
    margin: 0,
  },
  gameBottom: {
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: 700,
  },

  // Result screen
  resultSection: {
    display: "flex",
    gap: 48,
    alignItems: "flex-start",
  },
  resultLeft: {
    flex: 1,
    maxWidth: 340,
  },
  resultBadge: {
    fontSize: 56,
    marginBottom: 12,
  },
  resultStats: {
    display: "flex",
    gap: 16,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    background: "#fff",
    borderRadius: 14,
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 12px rgba(26,60,46,0.07)",
  },
  statNum: {
    fontSize: 32,
    fontWeight: 900,
    color: "#1A3C2E",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  resultRight: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#fff",
    borderRadius: 20,
    padding: "24px 28px",
    boxShadow: "0 4px 24px rgba(26,60,46,0.08)",
  },
  resultRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  resultEmoji: {
    fontSize: 28,
  },
  resultArrow: {
    fontSize: 16,
    color: "#aaa",
  },
  resultItemLabel: {
    fontSize: 14,
    color: "#444",
    marginLeft: 4,
  },
};
