import { Link } from "wouter";

const GAMES = [
  {
    href: "/game/nutrition",
    icon: "🃏",
    name: "인식게임: 간식 대체 게임",
    desc: "카드를 뒤집고 건강한 음식으로 대체하는 카드 플리핑 게임",
    pts: "10 pts",
    color: "#FEF3C7",
    border: "#FDE68A",
    textColor: "#92400E",
  },
  {
    href: "/game/ox",
    icon: "⭕",
    name: "OX 게임",
    desc: "OX로 배우는 영양 상식! 영양 지식을 퀴즈로 확인해봐요.",
    pts: "15 pts",
    color: "#DCFCE7",
    border: "#86EFAC",
    textColor: "#166534",
  },
  {
    href: "/game/meal-tray",
    icon: "🍱",
    name: "나만의 영양 가득 밥상",
    desc: "식판 6칸에 음식을 채우고 분류군 다양성으로 점수를 받아요.",
    pts: "20 pts",
    color: "#DBEAFE",
    border: "#93C5FD",
    textColor: "#1E40AF",
  },
  {
    href: "/game/sugar",
    icon: "🍬",
    name: "설탕 큐브 게임",
    desc: "음식 속 숨은 설탕량을 맞춰보는 달콤한 영양 게임!",
    pts: "15 pts",
    color: "#FCE7F3",
    border: "#F9A8D4",
    textColor: "#9D174D",
  },
];

export default function GamePage() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 32px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#14532D", marginBottom: 6 }}>
        🎮 미니 게임
      </h1>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 36 }}>
        게임을 플레이하며 영양 지식을 키워봐요!
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {GAMES.map((game) => (
          <Link key={game.href} href={game.href}>
            <div
              style={{
                background: game.color,
                border: `2px solid ${game.border}`,
                borderRadius: 20,
                padding: "28px 24px",
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "none";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 44 }}>{game.icon}</div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: game.textColor, margin: "0 0 6px" }}>
                  {game.name}
                </h2>
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, margin: 0 }}>
                  {game.desc}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: game.textColor,
                    background: "rgba(255,255,255,0.6)",
                    borderRadius: 20,
                    padding: "4px 12px",
                  }}
                >
                  🌟 {game.pts}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: game.textColor }}>
                  플레이 →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
