import React from "react";
import { CHAR_IMAGES } from "./main";
import type { CharKey } from "./main";


// ── Stage config ──
// Stage 0 = 새싹 (0pt), Stage 1 = 모험가 (15pt), Stage 2 = 마스터 (30pt)
const STAGE_NAMES = ["새싹", "모험가", "마스터"];
const STAGE_PTS   = [0, 50, 100];

function getStage(pts: number): number {
  if (pts >= 100) return 2;
  if (pts >= 50) return 1;
  return 0;
}

function getStagePct(pts: number): number {
  const si = getStage(pts);
  if (si === 2) return 100;
  const base = STAGE_PTS[si];
  const next = STAGE_PTS[si + 1];
  return Math.round(((pts - base) / (next - base)) * 100);
}

// ── Per-character config ──
interface CharConfig {
  name: string;
  sub: string;
  emoji: string;
  color: string;
  lightBg: string;
  border: string;
  badgeBg: string;
  badgeColor: string;
  barGrad: string;
  tabActiveBorder: string;
}

const CHAR_CFG: Record<CharKey, CharConfig> = {
  bromi: {
    name: "브로미", sub: "브로콜리 캐릭터", emoji: "🥦",
    color: "#1a7a3e", lightBg: "#e8f9f0", border: "#a8f0c6",
    badgeBg: "#d5f5e3", badgeColor: "#1a7a3e",
    barGrad: "linear-gradient(90deg, #2ecc71, #1a7a3e)",
    tabActiveBorder: "#2ecc71",
  },
  saekomi: {
    name: "새콤이", sub: "사과 캐릭터", emoji: "🍎",
    color: "#c0392b", lightBg: "#fdecea", border: "#f5b7b1",
    badgeBg: "#fad7d3", badgeColor: "#c0392b",
    barGrad: "linear-gradient(90deg, #e74c3c, #c0392b)",
    tabActiveBorder: "#e74c3c",
  },
  ttorong: {
    name: "또롱이", sub: "물방울 캐릭터", emoji: "💧",
    color: "#1a5276", lightBg: "#ebf5fb", border: "#aed6f1",
    badgeBg: "#d4e6f1", badgeColor: "#1a5276",
    barGrad: "linear-gradient(90deg, #3498db, #1a5276)",
    tabActiveBorder: "#3498db",
  },
};

// ── Sub-components ──

interface TabProps {
  charKey: CharKey;
  pts: number;
  active: boolean;
  onClick: () => void;
}

const CharTab: React.FC<TabProps> = ({ charKey, pts, active, onClick }) => {
  const cfg = CHAR_CFG[charKey];
  const si  = getStage(pts);
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, background: "white", borderRadius: 20, padding: "20px 16px 18px",
        boxShadow: "0 4px 20px rgba(0,0,0,.08)", cursor: "pointer",
        textAlign: "center" as const,
        border: `2.5px solid ${active ? cfg.tabActiveBorder : "transparent"}`,
        boxSizing: "border-box" as const,
        transition: "all .25s",
      }}
    >
      {/* current stage image */}
      <img
        src={CHAR_IMAGES[charKey][si]}
        alt={cfg.name}
        style={{ width: 100, height: 100, objectFit: "contain", display: "block", margin: "0 auto 10px" }}
      />
      <div style={{ fontWeight: 900, fontSize: "1.05rem", color: cfg.color, marginBottom: 3 }}>{cfg.name}</div>
      <div style={{ fontSize: "0.78rem", color: "#5a7366", marginBottom: 6 }}>{cfg.sub}</div>
      <div style={{
        display: "inline-block", padding: "3px 11px", borderRadius: 50,
        fontSize: "0.72rem", fontWeight: 800,
        background: cfg.badgeBg, color: cfg.badgeColor,
      }}>
        {cfg.emoji} {STAGE_NAMES[si]} · {pts}pts
      </div>
    </div>
  );
};

interface EvoStageBoxProps {
  charKey: CharKey;
  stageIdx: number;
  currentStage: number;
}

const EvoStageBox: React.FC<EvoStageBoxProps> = ({ charKey, stageIdx, currentStage }) => {
  const cfg    = CHAR_CFG[charKey];
  const isCur  = stageIdx === currentStage;
  const isLocked = stageIdx > currentStage;

  return (
    <div style={{ flex: 1, textAlign: "center" as const }}>
      <div style={{
        position: "relative" as const,
        width: 150, height: 165,
        margin: "0 auto 10px",
        borderRadius: 20,
        background: isCur ? cfg.lightBg : "#f8f9fa",
        border: `3px solid ${isCur ? cfg.tabActiveBorder : "#e9ecef"}`,
        boxShadow: isCur ? `0 6px 22px ${cfg.tabActiveBorder}55` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        filter: isLocked ? "grayscale(100%)" : "none",
        opacity: isLocked ? 0.3 : 1,
        overflow: "hidden" as const,
        boxSizing: "border-box" as const,
      }}>
        {isCur && (
          <div style={{
            position: "absolute" as const, top: -11, left: "50%", transform: "translateX(-50%)",
            background: cfg.tabActiveBorder, color: "white",
            borderRadius: 50, padding: "2px 10px", fontSize: "0.68rem", fontWeight: 800,
            whiteSpace: "nowrap" as const, zIndex: 2,
          }}>현재</div>
        )}
        <img
          src={CHAR_IMAGES[charKey][stageIdx]}
          alt={STAGE_NAMES[stageIdx]}
          style={{ width: "90%", height: "90%", objectFit: "contain" }}
        />
      </div>
      <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1e2d24", marginBottom: 2 }}>
        {STAGE_NAMES[stageIdx]}
      </div>
      <div style={{ fontSize: "0.76rem", color: "#5a7366" }}>{STAGE_PTS[stageIdx]} P</div>
    </div>
  );
};

// ── Main Component ──
interface Props {
  charPts: Record<CharKey, number>;
  curChar: CharKey;
  setCurChar: (k: CharKey) => void;
  levelUp: () => void;
}

export default function CharacterPage({ charPts, curChar, setCurChar, levelUp }: Props) {
  const cfg = CHAR_CFG[curChar];
  const pts = charPts[curChar];
  const si  = getStage(pts);
  const pct = getStagePct(pts);
  const rem = si >= 2 ? 0 : STAGE_PTS[si + 1] - pts;

  return (
    <div>
      {/* ── Character Selector Tabs ── */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        {(["bromi", "saekomi", "ttorong"] as CharKey[]).map(k => (
          <CharTab
            key={k}
            charKey={k}
            pts={charPts[k]}
            active={curChar === k}
            onClick={() => setCurChar(k)}
          />
        ))}
      </div>

      {/* ── Detail Panel ── */}
      <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "1.5rem", color: cfg.color, marginBottom: 4, fontFamily: "'Noto Sans KR', sans-serif" }}>
              {cfg.name} — {STAGE_NAMES[si]} 단계
            </h1>
            <p style={{ color: "#5a7366", fontSize: "0.88rem" }}>{cfg.sub} | 최대 30 pts</p>
          </div>
          <button
            onClick={levelUp}
            style={{
              background: cfg.color, color: "white", border: "none",
              borderRadius: 12, padding: "11px 24px",
              fontSize: "0.9rem", fontWeight: 800, cursor: "pointer",
              fontFamily: "'Noto Sans KR', sans-serif",
              boxShadow: `0 4px 16px ${cfg.color}55`,
            }}
          >
            레벨업 하기 →
          </button>
        </div>

        {/* Current Stage Hero Card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 32,
          borderRadius: 20, padding: 28, marginBottom: 24,
          background: cfg.lightBg, border: `2px solid ${cfg.border}`,
        }}>
          {/* Large character image */}
          <div style={{
            width: 200, height: 220, flexShrink: 0,
            borderRadius: 22, background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 12, boxShadow: "0 6px 24px rgba(0,0,0,.1)",
          }}>
            <img
              src={CHAR_IMAGES[curChar][si]}
              alt={`${cfg.name} ${STAGE_NAMES[si]}`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 900, fontSize: "1.8rem", color: cfg.color, marginBottom: 6, fontFamily: "'Noto Sans KR', sans-serif" }}>
              {cfg.name}
            </h2>
            <span style={{
              display: "inline-block", padding: "4px 14px", borderRadius: 50,
              fontSize: "0.85rem", fontWeight: 800, marginBottom: 16,
              background: cfg.badgeBg, color: cfg.badgeColor,
            }}>
              {STAGE_NAMES[si]}
            </span>

            <p style={{ fontSize: "0.9rem", color: "#5a7366", marginBottom: 12 }}>
              현재 <strong style={{ color: cfg.color }}>{pts} pts</strong>
              {si < 2 && <> · 다음 단계까지 <strong style={{ color: cfg.color }}>{rem} pts</strong> 필요</>}
              {si === 2 && <> · <strong style={{ color: cfg.color }}>🏆 마스터 달성!</strong></>}
            </p>

            {/* Progress bar */}
            <div style={{ background: "rgba(0,0,0,.08)", borderRadius: 50, height: 14, overflow: "hidden", marginBottom: 6 }}>
              <div style={{
                background: cfg.barGrad, height: "100%",
                width: `${pct}%`, borderRadius: 50,
                transition: "width .8s ease",
              }} />
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#5a7366" }}>{pct}%</div>
          </div>
        </div>

        {/* ── Evolution Stages ── */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 900, fontSize: "1.05rem", color: "#1e2d24", marginBottom: 18, fontFamily: "'Noto Sans KR', sans-serif" }}>
            {cfg.emoji} {cfg.name} 성장 단계 (최대 30 pts)
          </h3>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
            <EvoStageBox charKey={curChar} stageIdx={0} currentStage={si} />
            <div style={{ display: "flex", alignItems: "center", paddingTop: 72, flexShrink: 0, fontSize: "1.5rem", color: "#adb5bd", margin: "0 6px" }}>→</div>
            <EvoStageBox charKey={curChar} stageIdx={1} currentStage={si} />
            <div style={{ display: "flex", alignItems: "center", paddingTop: 72, flexShrink: 0, fontSize: "1.5rem", color: "#adb5bd", margin: "0 6px" }}>→</div>
            <EvoStageBox charKey={curChar} stageIdx={2} currentStage={si} />
          </div>
        </div>

        {/* ── Exp Guide ── */}
        <div style={{
          borderRadius: 12, padding: "14px 20px",
          fontSize: "0.86rem", lineHeight: 1.8,
          borderLeft: `4px solid ${cfg.tabActiveBorder}`,
          background: cfg.lightBg, color: "#2d4a35",
        }}>
          단계별 성장에 필요한 경험치(포인트):
          <br />• <strong>새싹</strong> → <strong>모험가</strong>: 50 포인트 필요
          <br />• <strong>모험가</strong> → <strong>마스터</strong>: 100 포인트 필요 (최대)
          <br />포인트는 영양 친구와 영양 배움터 학습, 미니 게임을 통해 획득할 수 있어요!
        </div>
      </div>
    </div>
  );
}
