import React from "react";
interface Props {
  showPage: (p: string) => void;
}

const G1 = "#1a7a3e";
const G2 = "#2ecc71";
const G3 = "#a8f0c6";
const G4 = "#e8f9f0";

const BtnPrimary: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      background: G1, color: "white", border: "none",
      borderRadius: 50, padding: "13px 30px",
      fontSize: "0.96rem", fontWeight: 800, cursor: "pointer",
      boxShadow: "0 6px 18px rgba(26,122,62,.3)",
      fontFamily: "'Noto Sans KR', sans-serif",
    }}
  >
    {children}
  </button>
);

const BtnSecondary: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      background: "white", color: G1,
      border: `2.5px solid ${G2}`, borderRadius: 50,
      padding: "11px 28px", fontSize: "0.96rem", fontWeight: 800,
      cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif",
    }}
  >
    {children}
  </button>
);

interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "white", borderRadius: 20, padding: "28px 20px",
      boxShadow: "0 4px 20px rgba(0,0,0,.08)",
      border: `2px solid transparent`, cursor: "pointer",
      textAlign: "center" as const, transition: "all .26s",
      flex: "1 1 180px", minWidth: 160,
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = G2;
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(46,204,113,.18)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,.08)";
    }}
  >
    <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>{icon}</div>
    <div style={{ fontWeight: 900, fontSize: "1rem", color: G1, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: "0.82rem", color: "#5a7366", lineHeight: 1.55 }}>{desc}</div>
    <div style={{ marginTop: 10, color: G2, fontWeight: 800, fontSize: "0.8rem" }}>자세히 보기 →</div>
  </div>
);

export default function MainPage({ showPage }: Props) {
  return (
    <div>
      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #e8f9f0, #c8f7df, #a8f0c6)",
        borderRadius: 22, padding: "56px 40px",
        textAlign: "center" as const, marginBottom: 32,
        position: "relative" as const, overflow: "hidden",
      }}>
        <div style={{
          display: "inline-block", background: "rgba(46,204,113,.15)", color: G1,
          border: `1.5px solid ${G2}`, borderRadius: 50,
          padding: "5px 18px", fontSize: "0.82rem", fontWeight: 700, marginBottom: 18,
        }}>
          ⚡ 어린이 영양 교육 플랫폼
        </div>

        <h1 style={{
          fontWeight: 900, fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
          color: G1, lineHeight: 1.25, marginBottom: 14,
          fontFamily: "'Noto Sans KR', sans-serif",
        }}>
          재미있게 배우는<br />
          <span style={{ color: G2 }}>영양의 모든 것 🥦</span>
        </h1>

        <p style={{ color: "#5a7366", fontSize: "0.97rem", maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.7 }}>
          캐릭터를 키우고, 게임을 하며 올바른 식습관과<br />영양 지식을 배워봐요!
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 40 }}>
          <BtnPrimary onClick={() => showPage("char")}>🌱 지금 시작하기</BtnPrimary>
          <BtnSecondary onClick={() => showPage("edu")}>📖 배움터 둘러보기</BtnSecondary>
        </div>

        {/* Floating plant card */}
        <div style={{
          display: "inline-block", background: "white", borderRadius: 20,
          padding: "28px 48px", boxShadow: "0 10px 36px rgba(46,204,113,.2)",
          position: "relative" as const,
          animation: "float 3s ease-in-out infinite",
        }}>
          <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
          <div style={{ fontSize: "4rem", display: "block", marginBottom: 6 }}>🥦</div>
          <div style={{
            position: "absolute" as const, top: -10, right: -10,
            background: "#f9ca24", color: "#7a5800",
            borderRadius: 50, padding: "3px 10px", fontSize: "0.73rem", fontWeight: 800,
          }}>Lv. 1</div>
          <div style={{
            position: "absolute" as const, bottom: -13, left: "50%", transform: "translateX(-50%)",
            background: G2, color: "white", borderRadius: 50,
            padding: "5px 16px", fontSize: "0.78rem", fontWeight: 800, whiteSpace: "nowrap" as const,
          }}>⭐ 성장 중!</div>
        </div>
      </div>

      {/* ── Feature Cards ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 900, fontSize: "1.25rem", color: G1, marginBottom: 5 }}>무엇을 배울 수 있나요?</div>
        <div style={{ fontSize: "0.86rem", color: "#5a7366", marginBottom: 22 }}>다양한 콘텐츠로 영양을 재미있게 배워봐요</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
          <FeatureCard icon="🥕" title="영양 친구"   desc="귀여운 영양 캐릭터와 함께 건강해져요"  onClick={() => showPage("friend")} />
          <FeatureCard icon="🎮" title="미니 게임"   desc="재미있는 게임으로 영양을 배워요"        onClick={() => showPage("game")} />
          <FeatureCard icon="📖" title="영양 배움터" desc="영양 지식을 쏙쏙 키워봐요"              onClick={() => showPage("edu")} />
          <FeatureCard icon="🏆" title="나의 캐릭터" desc="내 캐릭터를 성장시켜봐요"               onClick={() => showPage("char")} />
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div style={{
        background: `linear-gradient(135deg, ${G1}, #145d2f)`,
        borderRadius: 22, padding: "40px 36px",
        textAlign: "center" as const, position: "relative" as const, overflow: "hidden",
      }}>
        <div style={{ position: "absolute" as const, fontSize: "7rem", top: -10, right: -10, opacity: 0.1, transform: "rotate(20deg)" }}>🌿</div>
        <h2 style={{ fontWeight: 900, fontSize: "1.6rem", color: "white", marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>
          오늘부터 건강한 식습관! 🌿
        </h2>
        <p style={{ color: "rgba(255,255,255,.78)", marginBottom: 22, fontSize: "0.93rem" }}>
          영양 짝꿍과 함께 건강하고 즐거운 식생활을 시작해봐요.
        </p>
        <button
          onClick={() => showPage("edu")}
          style={{
            background: "white", color: G1, border: "none", borderRadius: 50,
            padding: "12px 30px", fontSize: "0.93rem", fontWeight: 800,
            cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          📚 배움터 시작하기
        </button>
      </div>
    </div>
  );
}
