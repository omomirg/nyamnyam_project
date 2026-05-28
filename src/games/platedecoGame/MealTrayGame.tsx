import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "start" | "info" | "game" | "result";
type GroupKey = "grain" | "protein" | "veggie" | "fruit" | "dairy" | "soup";

interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  group: GroupKey;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GROUP_INFO: Record<GroupKey, { icon: string; name: string; color: string; bg: string }> = {
  grain:   { icon: "🌾", name: "곡류",              color: "#B45309", bg: "#FEF3C7" },
  protein: { icon: "🥩", name: "고기·생선·달걀·콩류", color: "#9A3412", bg: "#FFEDD5" },
  veggie:  { icon: "🥦", name: "채소류",             color: "#166534", bg: "#DCFCE7" },
  fruit:   { icon: "🍉", name: "과일류",             color: "#9D174D", bg: "#FCE7F3" },
  dairy:   { icon: "🥛", name: "우유·유제품류",       color: "#1E40AF", bg: "#DBEAFE" },
  soup:    { icon: "🍜", name: "국 종류",            color: "#5B21B6", bg: "#EDE9FE" },
};

const FOODS: FoodItem[] = [
  // 곡류
  { id: "f01", name: "잡곡밥",     emoji: "🍚", group: "grain" },
  { id: "f02", name: "옥수수",     emoji: "🌽", group: "grain" },
  { id: "f03", name: "고구마",     emoji: "🍠", group: "grain" },
  { id: "f04", name: "감자",       emoji: "🥔", group: "grain" },
  { id: "f05", name: "식빵",       emoji: "🍞", group: "grain" },
  // 단백질
  { id: "f06", name: "닭갈비",     emoji: "🍗", group: "protein" },
  { id: "f07", name: "제육볶음",   emoji: "🥩", group: "protein" },
  { id: "f08", name: "두부조림",   emoji: "🫘", group: "protein" },
  { id: "f09", name: "달걀프라이", emoji: "🍳", group: "protein" },
  { id: "f10", name: "고등어구이", emoji: "🐟", group: "protein" },
  // 채소
  { id: "f11", name: "당근",       emoji: "🥕", group: "veggie" },
  { id: "f12", name: "브로콜리",   emoji: "🥦", group: "veggie" },
  { id: "f13", name: "오이",       emoji: "🥒", group: "veggie" },
  { id: "f14", name: "김치",       emoji: "🌶️", group: "veggie" },
  { id: "f15", name: "버섯볶음",   emoji: "🍄", group: "veggie" },
  // 과일
  { id: "f16", name: "사과",       emoji: "🍎", group: "fruit" },
  { id: "f17", name: "포도",       emoji: "🍇", group: "fruit" },
  { id: "f18", name: "딸기",       emoji: "🍓", group: "fruit" },
  { id: "f19", name: "귤",         emoji: "🍊", group: "fruit" },
  { id: "f20", name: "키위",       emoji: "🥝", group: "fruit" },
  // 유제품
  { id: "f21", name: "우유",       emoji: "🥛", group: "dairy" },
  { id: "f22", name: "치즈",       emoji: "🧀", group: "dairy" },
  { id: "f23", name: "요구르트",   emoji: "🫙", group: "dairy" },
  // 국
  { id: "f24", name: "김치찌개",   emoji: "🍲", group: "soup" },
  { id: "f25", name: "미역국",     emoji: "🍵", group: "soup" },
  { id: "f26", name: "콩나물국",   emoji: "🥣", group: "soup" },
  { id: "f27", name: "두부된장국", emoji: "♨️", group: "soup" },
];

const SCORE_RULES = [
  { groups: 5, score: 100, label: "5가지 분류군 모두 포함", msg: "100점! 참 잘했어요! 앞으로도 건강한 식사를 규칙적으로 맛있게 먹어요.", tier: "gold" },
  { groups: 4, score: 70,  label: "4가지 분류군 포함",      msg: "70점! 조금 아쉽네요! 더 건강한 식사를 위해 노력해봐요.",             tier: "silver" },
  { groups: 3, score: 40,  label: "3가지 분류군 포함",      msg: "40점! 노력이 필요해요! 다양한 음식을 섭취하면 좋을 것 같아요.",       tier: "bronze" },
  { groups: 0, score: 0,   label: "1~2가지 분류군 포함",    msg: "0점! 오늘 식사는 건강하지 않아요! 영양에 대한 공부가 필요해요.",      tier: "none" },
];

const SIDEBAR_ITEMS = [
  { icon: "🍓", label: "영양 친구" },
  { icon: "🥗", label: "미니 게임" },
  { icon: "🏆", label: "나의 건강 캐릭터" },
  { icon: "🌿", label: "영양 배움터" },
  { icon: "🍒", label: "나의 영양 기록" },
];

const NAV_LINKS = ["Home", "Games", "Lessons", "Leaderboard", "Support"];
const SLOTS = 6;

function calcScore(slots: (FoodItem | null)[]) {
  const filled = slots.filter(Boolean) as FoodItem[];
  const groups = new Set(filled.map((f) => f.group)).size;
  const rule = SCORE_RULES.find((r) => groups >= r.groups)!;
  return { score: rule.score, msg: rule.msg, tier: rule.tier, groups, filled };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MealTrayGame({ onGameComplete }: { onGameComplete?: () => void }) {
  const [screen, setScreen] = useState<Screen>("start");
  const [slots, setSlots]   = useState<(FoodItem | null)[]>(Array(SLOTS).fill(null));
  const [foodPage, setFoodPage] = useState(0);
  const [animKey, setAnimKey]   = useState(0);
  const [dragging, setDragging] = useState<FoodItem | null>(null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);

  const filledCount = slots.filter(Boolean).length;
  const pageSize = 12;
  const pagedFoods = [
    FOODS.slice(0, pageSize),
    FOODS.slice(pageSize),
  ];

  const goTo = (s: Screen) => { setScreen(s); setAnimKey((k) => k + 1); };

  const placeFood = (food: FoodItem, slotIdx: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = food;
      return next;
    });
  };

  const removeFood = (slotIdx: number) => {
    setSlots((prev) => { const n = [...prev]; n[slotIdx] = null; return n; });
  };

  const clearTray = () => setSlots(Array(SLOTS).fill(null));

  const result = calcScore(slots);

  // Slot layout: top row 4, bottom row: 1 wide + 1 round
  const slotMeta = [
    { id: 0, style: {} },
    { id: 1, style: {} },
    { id: 2, style: {} },
    { id: 3, style: {} },
    { id: 4, wide: true },
    { id: 5, round: true },
  ];

  // ─── Sub-screens ──────────────────────────────────────────────────────────

  const StartScreen = () => (
    <div style={s.centerWrap}>
      <div style={s.startCard}>
        <div style={s.startIcon}>🍱</div>
        <h1 style={s.gameTitle}>식판 꾸미기</h1>
        <p style={s.gameDesc}>
          식판 6칸에 원하는 음식을 담아<br />
          분류군 다양성으로 점수를 받아요.
        </p>
        <div style={s.startBtns}>
          <button style={s.btnPrimary} onClick={() => goTo("game")}>식판 꾸미기 시작</button>
          <button style={s.btnGhost}   onClick={() => goTo("info")}>게임 규칙</button>
        </div>
      </div>
    </div>
  );

  const InfoScreen = () => (
    <div style={s.infoLayout}>
      <div style={s.infoLeft}>
        <h2 style={s.sectionTitle}>게임 설명</h2>
        <p style={s.infoDesc}>식판에 들어간 분류군 수에 따라 점수가 달라져요.</p>
        <button style={s.btnPrimary} onClick={() => goTo("game")}>게임 시작하기</button>

        <div style={s.scoreCards}>
          {SCORE_RULES.map((r) => {
            const tierColor: Record<string, string> = {
              gold: "#D97706", silver: "#6B7280", bronze: "#92400E", none: "#DC2626",
            };
            const tierBg: Record<string, string> = {
              gold: "#FFFBEB", silver: "#F9FAFB", bronze: "#FEF3C7", none: "#FEF2F2",
            };
            return (
              <div key={r.tier} style={{ ...s.scoreCard, background: tierBg[r.tier], borderColor: tierColor[r.tier] }}>
                <div style={s.scoreCardRow}>
                  <p style={{ ...s.scoreCardTitle, color: tierColor[r.tier] }}>{r.label}</p>
                  <span style={{ ...s.scoreBadge, background: tierColor[r.tier] }}>{r.score}점</span>
                </div>
                <p style={s.scoreCardDesc}>{r.msg}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={s.infoRight}>
        <div style={s.groupGrid}>
          {(Object.entries(GROUP_INFO) as [GroupKey, typeof GROUP_INFO[GroupKey]][]).map(([key, g]) => (
            <div key={key} style={{ ...s.groupCard, background: g.bg }}>
              <span style={s.groupIcon}>{g.icon}</span>
              <p style={{ ...s.groupName, color: g.color }}>{g.name}</p>
              <p style={s.groupItems}>
                {FOODS.filter((f) => f.group === key).map((f) => f.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const GameScreen = () => (
    <div style={s.gameWrap}>
      <div style={s.gameLayout}>
        {/* Tray */}
        <div style={s.trayArea}>
          <h2 style={s.sectionTitle}>나의 식판</h2>

          <div style={s.tray}>
            {/* Top 4 slots */}
            <div style={s.trayTopRow}>
              {[0, 1, 2, 3].map((idx) => (
                <SlotCell key={idx} idx={idx} />
              ))}
            </div>
            {/* Bottom row */}
            <div style={s.trayBottomRow}>
              <SlotCell idx={4} wide />
              <SlotCell idx={5} round />
            </div>
          </div>

          <p style={s.trayStatus}>
            <span style={{ color: filledCount > 0 ? "#16A34A" : "#A8A29E", fontWeight: 800 }}>{filledCount}</span>
            <span style={{ color: "#A8A29E" }}> / 6 칸 채워짐</span>
          </p>
        </div>

        {/* Food picker */}
        <div style={s.pickerArea}>
          <div style={s.pickerHeader}>
            <h2 style={s.sectionTitle}>음식 선택</h2>
            <div style={s.pageBtns}>
              {[0, 1].map((p) => (
                <button
                  key={p}
                  style={{ ...s.pageBtn, ...(foodPage === p ? s.pageBtnActive : {}) }}
                  onClick={() => setFoodPage(p)}
                >
                  {p + 1}
                </button>
              ))}
            </div>
          </div>

          <div style={s.foodGrid}>
            {pagedFoods[foodPage].map((food) => {
              const inTray = slots.some((sl) => sl?.id === food.id);
              return (
                <div
                  key={food.id}
                  draggable
                  onDragStart={() => setDragging(food)}
                  onDragEnd={() => setDragging(null)}
                  style={{
                    ...s.foodChip,
                    background: GROUP_INFO[food.group].bg,
                    borderColor: GROUP_INFO[food.group].color,
                    opacity: inTray ? 0.4 : 1,
                    cursor: inTray ? "not-allowed" : "grab",
                  }}
                  onClick={() => {
                    if (inTray) return;
                    const emptyIdx = slots.findIndex((sl) => sl === null);
                    if (emptyIdx !== -1) placeFood(food, emptyIdx);
                  }}
                >
                  <span style={{ fontSize: 22 }}>{food.emoji}</span>
                  <span style={{ ...s.foodChipName, color: GROUP_INFO[food.group].color }}>
                    {food.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Group legend */}
          <div style={s.legend}>
            {(Object.entries(GROUP_INFO) as [GroupKey, typeof GROUP_INFO[GroupKey]][]).map(([k, g]) => (
              <span key={k} style={{ ...s.legendChip, background: g.bg, color: g.color }}>
                {g.icon} {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={s.gameBottomBar}>
        <button style={s.btnClear} onClick={clearTray}>초기화</button>
        <button style={s.btnScore} onClick={() => { onGameComplete?.(); goTo("result"); }}>점수 보기</button>
      </div>
    </div>
  );

  // Slot cell component
  const SlotCell = ({ idx, wide, round }: { idx: number; wide?: boolean; round?: boolean }) => {
    const food = slots[idx];
    const isHover = hoverSlot === idx;
    return (
      <div
        style={{
          ...s.slot,
          ...(wide  ? s.slotWide  : {}),
          ...(round ? s.slotRound : {}),
          ...(isHover ? s.slotHover : {}),
          background: food ? GROUP_INFO[food.group].bg : isHover ? "#F0FDF4" : "#F8F9FA",
          borderColor: food ? GROUP_INFO[food.group].color : isHover ? "#86EFAC" : "#E5E7EB",
        }}
        onDragOver={(e) => { e.preventDefault(); setHoverSlot(idx); }}
        onDragLeave={() => setHoverSlot(null)}
        onDrop={(e) => {
          e.preventDefault();
          setHoverSlot(null);
          if (dragging) placeFood(dragging, idx);
        }}
        onClick={() => { if (food) removeFood(idx); }}
      >
        {food ? (
          <>
            <span style={{ fontSize: round ? 28 : 24 }}>{food.emoji}</span>
            <span style={{ ...s.slotFoodName, color: GROUP_INFO[food.group].color }}>{food.name}</span>
            <span style={s.slotRemove}>✕</span>
          </>
        ) : (
          <span style={s.slotHint}>{isHover ? "놓기!" : "여기에 놓기"}</span>
        )}
      </div>
    );
  };

  const ResultScreen = () => {
    const tierColor: Record<string, string> = {
      gold: "#D97706", silver: "#6B7280", bronze: "#92400E", none: "#DC2626",
    };
    const tierBg: Record<string, string> = {
      gold: "#FFFBEB", silver: "#F9FAFB", bronze: "#FFF7ED", none: "#FFF1F2",
    };
    const groupsFound = new Set(result.filled.map((f) => f.group));

    return (
      <div style={s.resultWrap}>
        <div style={s.resultTop}>
          <div style={s.resultScoreBox}>
            <p style={s.resultLabel}>총점</p>
            <p style={{ ...s.resultScore, color: tierColor[result.tier] }}>{result.score}점</p>
          </div>
          <div style={{ ...s.resultMsgBox, background: tierBg[result.tier], borderColor: tierColor[result.tier] }}>
            <p style={{ ...s.resultMsg, color: tierColor[result.tier] }}>{result.msg}</p>
            <p style={s.resultGroups}>{result.groups}가지 분류군 섭취</p>
          </div>
        </div>

        {/* Filled tray summary */}
        <div style={s.resultTray}>
          {slots.map((food, i) => (
            <div key={i} style={{
              ...s.resultSlot,
              background: food ? GROUP_INFO[food.group].bg : "#F3F4F6",
            }}>
              {food ? (
                <>
                  <span style={{ fontSize: 26 }}>{food.emoji}</span>
                  <span style={{ ...s.resultSlotName, color: GROUP_INFO[food.group].color }}>{food.name}</span>
                </>
              ) : (
                <span style={s.slotHint}>비어있음</span>
              )}
            </div>
          ))}
        </div>

        {/* Group coverage */}
        <div style={s.groupCoverage}>
          {(Object.entries(GROUP_INFO) as [GroupKey, typeof GROUP_INFO[GroupKey]][]).map(([k, g]) => {
            const has = groupsFound.has(k);
            return (
              <div key={k} style={{ ...s.coverChip, background: has ? g.bg : "#F3F4F6", opacity: has ? 1 : 0.45 }}>
                <span>{g.icon}</span>
                <span style={{ color: has ? g.color : "#9CA3AF", fontWeight: 700, fontSize: 12 }}>
                  {has ? "✓ " : "✗ "}{g.name}
                </span>
              </div>
            );
          })}
        </div>

        <div style={s.resultActions}>
          <button style={s.btnGhost} onClick={() => { clearTray(); goTo("game"); }}>다시 시작하기</button>
          <button style={s.btnPrimary} onClick={() => goTo("start")}>게임 마치기</button>
        </div>
      </div>
    );
  };

  // ─── Layout ───────────────────────────────────────────────────────────────

  return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Noto Sans KR', sans-serif; background: #F8FAF8; }
      button { font-family: 'Noto Sans KR', sans-serif; cursor: pointer; transition: opacity 0.15s, transform 0.12s; }
      button:hover { opacity: 0.86; transform: translateY(-1px); }
      button:active { transform: scale(0.97); }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fu { animation: fadeUp 0.35s ease both; }
    `}</style>
    <div style={{ padding: "40px 48px" }}>
      <div className="fu" key={screen + animKey} style={s.screenInner}>
        {screen === "start"  && <StartScreen />}
        {screen === "info"   && <InfoScreen />}
        {screen === "game"   && <GameScreen />}
        {screen === "result" && <ResultScreen />}
      </div>
    </div>
  </>
);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  // Navbar
  navbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 28px", height: 58,
    background: "#fff", borderBottom: "1px solid #E5E7EB",
    position: "sticky", top: 0, zIndex: 100,
  },
  navLogo: { display: "flex", alignItems: "center", gap: 10 },
  logoDot: {
    width: 30, height: 30, borderRadius: "50%",
    background: "linear-gradient(135deg, #86EFAC, #16A34A)",
  },
  logoText: { fontSize: 15, fontWeight: 800, color: "#14532D" },
  navLinks: { display: "flex", gap: 22 },
  navLink: { fontSize: 13, fontWeight: 600, color: "#374151", textDecoration: "none" },
  navSearch: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#F3F4F6", borderRadius: 20, padding: "6px 14px", fontSize: 13,
  },
  searchInput: {
    border: "none", background: "transparent", outline: "none",
    fontSize: 13, fontFamily: "inherit", width: 130, color: "#374151",
  },

  // Layout
  layout: { display: "flex", minHeight: "calc(100vh - 58px)" },

  // Sidebar
  sidebar: {
    width: 190, background: "#14532D", flexShrink: 0,
    display: "flex", flexDirection: "column", padding: "20px 0", gap: 2,
  },
  sidebarItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 18px", fontSize: 13, fontWeight: 600,
    color: "#BBF7D0", textDecoration: "none",
  },

  // Main
  main: { flex: 1, padding: "40px 48px", overflowY: "auto" },
  screenInner: { maxWidth: 1000, margin: "0 auto" },

  // ── Start
  centerWrap: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "58vh" },
  startCard: {
    background: "#fff", borderRadius: 28, padding: "52px 60px",
    textAlign: "center", boxShadow: "0 8px 40px rgba(20,83,45,0.10)",
    maxWidth: 440, width: "100%",
  },
  startIcon: {
    fontSize: 64, marginBottom: 16,
    display: "block",
  },
  gameTitle: { fontSize: 30, fontWeight: 900, color: "#14532D", marginBottom: 12 },
  gameDesc: { fontSize: 15, color: "#4B5563", lineHeight: 1.8, marginBottom: 28 },
  startBtns: { display: "flex", flexDirection: "column", gap: 10, alignItems: "center" },

  // ── Info
  infoLayout: { display: "flex", gap: 40, alignItems: "flex-start" },
  infoLeft: { width: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 900, color: "#14532D" },
  infoDesc: { fontSize: 14, color: "#4B5563", lineHeight: 1.7 },
  scoreCards: { display: "flex", flexDirection: "column", gap: 10 },
  scoreCard: {
    borderRadius: 14, padding: "14px 16px",
    border: "1.5px solid", display: "flex", flexDirection: "column", gap: 6,
  },
  scoreCardRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  scoreCardTitle: { fontSize: 13, fontWeight: 800 },
  scoreBadge: {
    color: "#fff", borderRadius: 20, padding: "3px 12px",
    fontSize: 12, fontWeight: 800, flexShrink: 0,
  },
  scoreCardDesc: { fontSize: 12, color: "#6B7280", lineHeight: 1.6 },
  infoRight: { flex: 1 },
  groupGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
  },
  groupCard: {
    borderRadius: 16, padding: "16px 18px",
    display: "flex", flexDirection: "column", gap: 4,
  },
  groupIcon: { fontSize: 28, marginBottom: 4 },
  groupName: { fontSize: 13, fontWeight: 800 },
  groupItems: { fontSize: 12, color: "#6B7280", lineHeight: 1.6 },

  // ── Game
  gameWrap: { display: "flex", flexDirection: "column", gap: 24 },
  gameLayout: { display: "flex", gap: 28, alignItems: "flex-start" },
  trayArea: { display: "flex", flexDirection: "column", gap: 12, flexShrink: 0, width: 380 },
  tray: {
    background: "#fff", borderRadius: 24, padding: 16,
    boxShadow: "0 6px 28px rgba(20,83,45,0.10)",
    display: "flex", flexDirection: "column", gap: 10,
  },
  trayTopRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 },
  trayBottomRow: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 },
  slot: {
    borderRadius: 14, border: "2px dashed #E5E7EB",
    minHeight: 80, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 4,
    transition: "all 0.18s", cursor: "pointer", padding: 6,
    position: "relative",
  },
  slotWide: { borderRadius: 16, minHeight: 88 },
  slotRound: { borderRadius: "50%", minHeight: 88, aspectRatio: "1" },
  slotHover: { transform: "scale(1.03)" },
  slotHint: { fontSize: 11, color: "#D1D5DB", fontWeight: 600, textAlign: "center" as const },
  slotFoodName: { fontSize: 11, fontWeight: 800, textAlign: "center" as const },
  slotRemove: {
    position: "absolute", top: 4, right: 6,
    fontSize: 10, color: "#9CA3AF", opacity: 0,
  },
  trayStatus: { fontSize: 13, textAlign: "center" as const },

  pickerArea: { flex: 1, display: "flex", flexDirection: "column", gap: 14 },
  pickerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  pageBtns: { display: "flex", gap: 6 },
  pageBtn: {
    width: 32, height: 32, borderRadius: 8, border: "1.5px solid #E5E7EB",
    background: "#fff", fontSize: 13, fontWeight: 700, color: "#6B7280",
  },
  pageBtnActive: { background: "#14532D", color: "#fff", borderColor: "#14532D" },
  foodGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
  },
  foodChip: {
    borderRadius: 12, border: "1.5px solid",
    padding: "10px 8px", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 4,
    transition: "opacity 0.2s, transform 0.12s",
  },
  foodChipName: { fontSize: 11, fontWeight: 700, textAlign: "center" as const },
  legend: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 },
  legendChip: {
    borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700,
  },
  gameBottomBar: { display: "flex", justifyContent: "flex-end", gap: 10 },

  // ── Result
  resultWrap: { display: "flex", flexDirection: "column", gap: 24 },
  resultTop: { display: "flex", gap: 20, alignItems: "center" },
  resultScoreBox: {
    background: "#fff", borderRadius: 20, padding: "20px 28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
    flexShrink: 0,
  },
  resultLabel: { fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const },
  resultScore: { fontSize: 52, fontWeight: 900, lineHeight: 1 },
  resultMsgBox: { flex: 1, borderRadius: 16, border: "1.5px solid", padding: "16px 20px" },
  resultMsg: { fontSize: 15, fontWeight: 700, lineHeight: 1.7 },
  resultGroups: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  resultTray: { display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 },
  resultSlot: {
    borderRadius: 14, padding: "14px 8px",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 5,
  },
  resultSlotName: { fontSize: 11, fontWeight: 700, textAlign: "center" as const },
  groupCoverage: { display: "flex", flexWrap: "wrap", gap: 8 },
  coverChip: {
    display: "flex", alignItems: "center", gap: 6,
    borderRadius: 20, padding: "6px 14px", fontSize: 12,
  },
  resultActions: { display: "flex", gap: 10, justifyContent: "flex-end" },

  // ── Buttons
  btnPrimary: {
    background: "#14532D", color: "#fff", border: "none",
    borderRadius: 12, padding: "12px 26px", fontSize: 14, fontWeight: 700,
  },
  btnGhost: {
    background: "transparent", color: "#14532D",
    border: "2px solid #14532D", borderRadius: 12,
    padding: "10px 22px", fontSize: 14, fontWeight: 700,
  },
  btnClear: {
    background: "#F3F4F6", color: "#374151", border: "none",
    borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 700,
  },
  btnScore: {
    background: "#16A34A", color: "#fff", border: "none",
    borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700,
  },
};
