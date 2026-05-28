import React, { useState } from "react";
import { EDU_IMAGES } from "./main";

const G1 = "#1a7a3e";
const G2 = "#2ecc71";
const G3 = "#a8f0c6";
const G4 = "#e8f9f0";

// ── Lesson data ──
interface Lesson {
  emoji: string;
  title: string;
  desc: string;
  difficulty: "쉬움" | "보통" | "어려움";
  tag: string;
  done: boolean;
}

const LESSONS: Lesson[] = [
  { emoji: "📚", title: "5대 영양소란?",    desc: "탄수화물, 단백질, 지방, 비타민, 미네랄에 대해 배워요", difficulty: "쉬움", tag: "기초",   done: false },
  { emoji: "🥦", title: "채소의 영양",      desc: "색깔별 채소가 가진 특별한 영양소를 알아봐요",         difficulty: "쉬움", tag: "채소",   done: false },
  { emoji: "🍊", title: "과일과 비타민",    desc: "과일 속 비타민의 종류와 효능에 대해 알아봐요",         difficulty: "보통", tag: "과일",   done: false },
  { emoji: "🥚", title: "단백질 이야기",    desc: "우리 몸을 만드는 단백질, 어디서 얻을 수 있을까요?",    difficulty: "보통", tag: "단백질", done: false },
  { emoji: "🍱", title: "건강한 식단 짜기", desc: "균형 잡힌 하루 식단을 직접 만들어 봐요",              difficulty: "어려움", tag: "실전", done: false },
  { emoji: "💧", title: "수분과 건강",      desc: "물을 충분히 마시는 것이 왜 중요한지 알아봐요",         difficulty: "쉬움", tag: "기초",   done: false },
];

// ── Lesson detail content (PDF 기반) ──
interface Section {
  heading?: string;
  body?: string;
  list?: string[];
  highlight?: string;
}
interface LessonContent {
  image: string;
  sections: Section[];
}

const LESSON_CONTENT: LessonContent[] = [
  // 1. 5대 영양소란?
  {
    image: "/edu/lesson1.png",
    sections: [
      {
        heading: "식품은 6가지 군으로 나뉘어요",
        body: "곡류 / 고기·생선·달걀·콩류 / 채소류 / 과일류 / 우유·유제품류 / 유지·당류",
      },
      {
        heading: "곡류",
        list: ["탄수화물이 풍부해 활동과 학습에 필요한 힘을 줘요", "하루 2~4회 섭취해요", "잡곡밥, 국수, 감자, 식빵, 고구마, 떡, 옥수수"],
      },
      {
        heading: "고기·생선·달걀·콩류",
        list: ["단백질이 풍부해 피와 살을 만들어줘요", "하루 3~4회 섭취해요", "돼지고기, 닭고기, 두부, 달걀, 고등어, 강낭콩"],
      },
      {
        heading: "채소류",
        list: ["비타민과 무기질이 풍부해 질병을 이길 수 있도록 도와요", "매끼 2가지 이상 섭취해요", "당근, 버섯, 브로콜리, 오이, 미역, 상추"],
      },
      {
        heading: "과일류",
        list: ["비타민과 무기질이 풍부해 피부를 건강하게 해요", "하루 1~2개 섭취해요", "사과, 포도, 귤, 키위, 딸기, 바나나"],
      },
      {
        heading: "우유·유제품류",
        list: ["칼슘이 풍부해 뼈를 튼튼하게 하고 키가 크게 해요", "매일 우유 2잔(200ml씩) 섭취해요", "우유, 치즈, 요구르트"],
      },
      {
        heading: "유지·당류",
        list: ["체온을 유지하고 몸 속 기관을 보호해요", "많이 먹으면 건강에 좋지 않아요 — 적게 섭취!"],
        highlight: "💡 골고루 먹으면 몸이 건강해지고 키가 쑥쑥 자라요!",
      },
    ],
  },

  // 2. 채소의 영양
  {
    image: "/edu/lesson2.png",
    sections: [
      {
        heading: "채소가 몸에 좋은 이유",
        list: [
          "비타민과 무기질이 많아 몸에 활력을 줘요",
          "식이섬유가 많아 배변 활동을 도와요",
          "면역을 높여줘 질병을 이길 수 있게 도와요",
          "피부를 건강하게 유지시켜 줘요",
        ],
      },
      {
        heading: "하루 채소 섭취 방법",
        list: [
          "매 끼니 두 손을 모았을 때 들어갈 정도로 2가지 이상 섭취해요",
          "당근, 버섯, 브로콜리, 가지, 파프리카, 오이, 미역, 상추, 애호박, 미나리",
        ],
        highlight: "🥦 채소는 종류별로 다른 영양소를 가지고 있어서 다양하게 먹는 것이 좋아요!",
      },
      {
        heading: "건강한 식습관과 채소",
        list: [
          "몸을 건강하게 해요",
          "감기에 쉽게 걸리지 않아요",
          "뛰어놀 수 있게 힘이 나요",
          "키가 쑥쑥 자라요",
        ],
      },
    ],
  },

  // 3. 과일과 비타민
  {
    image: "/edu/lesson3.png",
    sections: [
      {
        heading: "과일이 몸에 좋은 이유",
        list: [
          "비타민이 많아 피부를 건강하게 유지시켜 줘요",
          "비타민과 무기질이 풍부해 질병을 이길 수 있게 도와요",
          "식이섬유가 있어 배변 활동을 도와요",
        ],
      },
      {
        heading: "과일 올바른 섭취법",
        list: [
          "간식으로 식사와 식사 사이에 먹어요",
          "당류가 많아 많이 먹으면 살이 쪄요",
          "적정 섭취량: 주먹 크기 정도 (하루 1~2개)",
        ],
        highlight: "🍎 포도 15알 / 사과·바나나 반 개 / 키위 1개가 한 번 적정량이에요!",
      },
      {
        heading: "이런 과일을 먹어요",
        list: ["사과, 포도, 귤, 키위, 감, 자두, 복숭아, 바나나, 딸기, 블루베리, 파인애플, 참외, 오렌지, 망고"],
      },
    ],
  },

  // 4. 단백질 이야기
  {
    image: "/edu/lesson4.png",
    sections: [
      {
        heading: "단백질이 왜 중요할까요?",
        list: [
          "피와 살을 만들어줘요",
          "근육을 튼튼하게 해줘요",
          "성장기에 특히 중요한 영양소예요",
        ],
      },
      {
        heading: "단백질이 풍부한 음식",
        list: [
          "고기류: 돼지고기, 닭고기, 소고기, 오리고기",
          "생선류: 고등어, 연어, 삼치, 전어",
          "달걀: 달걀프라이, 삶은 달걀",
          "콩류: 두부, 강낭콩, 검은콩",
        ],
        highlight: "🥩 하루 3~4회 섭취하는 것이 좋아요!",
      },
      {
        heading: "간식에서도 단백질을!",
        list: [
          "가공 식품보다 자연 식품으로 섭취해요",
          "두부조림, 달걀프라이 등 반찬으로 먹어요",
          "콩류 반찬도 훌륭한 단백질 공급원이에요",
        ],
      },
    ],
  },

  // 5. 건강한 식단 짜기
  {
    image: "/edu/lesson5.png",
    sections: [
      {
        heading: "건강한 식습관 4가지",
        list: [
          "천천히 꼭꼭 씹어 먹어요 → 턱뼈가 튼튼해지고 두뇌 발달에 도움을 줘요",
          "아침 식사를 해요 → 뇌가 에너지를 얻어 집중이 잘 되고 비만을 예방해요",
          "정해진 시간에 규칙적으로 먹어요 → 규칙적인 생활이 가능해져요",
          "골고루 먹어요 → 몸에 필요한 영양소를 균형 있게 섭취할 수 있어요",
        ],
      },
      {
        heading: "건강한 간식 선택법",
        list: [
          "성장기에는 하루 3끼로 영양소가 부족할 수 있어 건강한 간식이 필요해요",
          "간식은 식사와 식사 사이 시간에 규칙적으로 먹어요",
          "과일, 채소, 고구마, 감자, 옥수수를 간식으로 먹어요 (가공식품보다 자연식!)",
          "간식은 식사 때 먹는 양보다 적게 먹어요",
          "지나치게 단 음식은 피해요",
        ],
        highlight: "🍠 감자튀김 → 찐 감자 / 팝콘 → 찐 옥수수 / 초코맛 우유 → 흰 우유로 바꿔봐요!",
      },
      {
        heading: "올바른 식단의 장점",
        list: [
          "소화가 잘 돼요",
          "과식을 하지 않아요",
          "몸에 필요한 영양소를 골고루 섭취할 수 있어요",
          "규칙적인 생활이 가능해요",
        ],
      },
    ],
  },

  // 6. 수분과 건강
  {
    image: "/edu/lesson6.png",
    sections: [
      {
        heading: "물이 몸에서 하는 일",
        list: [
          "체온을 유지해줘요",
          "좋은 영양소를 몸 속에 운반해줘요",
          "몸 속 찌꺼기를 몸 밖으로 내보내요",
          "배변 활동에 도움을 줘요",
        ],
      },
      {
        heading: "물 올바른 마시는 법",
        list: [
          "여러 번 자주 나누어 마셔요",
          "너무 차거나 뜨거운 물보다 미지근한 물을 마셔요",
          "식사 직후 과도한 수분 섭취는 소화 장애를 유발할 수 있어요",
        ],
        highlight: "💧 당류가 많은 음료는 마신 직후 목마름이 해소되는 것 같지만, 시간이 지나면 오히려 더 갈증이 나요!",
      },
      {
        heading: "흰 우유의 효능",
        list: [
          "몸에 좋은 영양소가 골고루 들어있어요 (특히 칼슘과 단백질)",
          "뼈를 튼튼하게 해줘요",
          "키가 크게 해줘요",
          "하루에 두 컵 (200ml씩) 마셔요",
          "우유가 싫다면 치즈, 요구르트로 대체할 수 있어요",
        ],
      },
      {
        heading: "당류가 많은 음료를 피해야 하는 이유",
        list: [
          "뚱뚱해질 수 있어요",
          "충치가 생길 수 있어요",
          "집중이 잘 안 돼요",
          "단맛에 길들여져 계속 먹고 싶어져요",
        ],
      },
    ],
  },
];

const EDU_META = [
  { title: "다양한 음식을 골고루 먹어요",     sub: "올바른 식생활 관리, 가정에서부터 시작합니다" },
  { title: "알록달록 채소·과일을 매일 먹어요", sub: "건강에 좋은 채소와 과일 안내" },
  { title: "올바른 건강간식을 먹어요",          sub: "어떤 간식이 좋을까요?" },
  { title: "건강음료를 마셔요",                sub: "흰 우유 알고 마셔요!" },
  { title: "건강식습관을 길러요",              sub: "6가지 건강 식습관 안내" },
  { title: "건강체중을 지켜요",               sub: "우리 아이 건강체중 확인하기" },
];

// ── Sub-components ──

const DiffBadge: React.FC<{ d: Lesson["difficulty"] }> = ({ d }) => {
  const map = {
    쉬움:   { bg: "#d5f5e3", color: G1 },
    보통:   { bg: "#fef9e7", color: "#7d6608" },
    어려움: { bg: "#fdf2f8", color: "#8e44ad" },
  };
  const s = map[d];
  return (
    <span style={{ padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, background: s.bg, color: s.color }}>
      {d}
    </span>
  );
};

const TagBadge: React.FC<{ label: string }> = ({ label }) => (
  <span style={{ padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, background: "#f8f9fa", color: "#5a7366" }}>
    {label}
  </span>
);

// ── Lesson Detail View ──
const LessonDetail: React.FC<{ idx: number; lesson: Lesson; onBack: () => void; onComplete: () => void }> = ({ idx, lesson, onBack, onComplete }) => {
  const content = LESSON_CONTENT[idx];
  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: "none", border: `2px solid ${G1}`, color: G1,
          borderRadius: 12, padding: "8px 18px", fontSize: "0.85rem",
          fontWeight: 700, cursor: "pointer", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        ← 목록으로
      </button>

      <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${G1}, #2ecc71)`, padding: "32px 36px", color: "white" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>{lesson.emoji}</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>
            {lesson.title}
          </h1>
          <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>{lesson.desc}</p>
        </div>

        {/* Image */}
        {content.image && (
          <div style={{ padding: "28px 36px 0" }}>
            <img
              src={content.image}
              alt={lesson.title}
              style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 16, background: G4 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        {/* Content sections */}
        <div style={{ padding: "28px 36px 36px", display: "flex", flexDirection: "column", gap: 24 }}>
          {content.sections.map((sec, i) => (
            <div key={i}>
              {sec.heading && (
                <h2 style={{ fontSize: "1rem", fontWeight: 900, color: G1, marginBottom: 12, fontFamily: "'Noto Sans KR', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 18, background: G2, borderRadius: 2, display: "inline-block" }} />
                  {sec.heading}
                </h2>
              )}
              {sec.body && (
                <p style={{ fontSize: "0.9rem", color: "#2d4a35", lineHeight: 1.8, background: G4, borderRadius: 10, padding: "12px 16px" }}>
                  {sec.body}
                </p>
              )}
              {sec.list && (
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {sec.list.map((item, j) => (
                    <li key={j} style={{ fontSize: "0.88rem", color: "#2d4a35", display: "flex", gap: 10, lineHeight: 1.6 }}>
                      <span style={{ color: G2, fontWeight: 900, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {sec.highlight && (
                <div style={{
                  marginTop: 12, borderRadius: 12, padding: "14px 18px",
                  background: "#fffbe6", borderLeft: `4px solid #f0c040`,
                  fontSize: "0.88rem", color: "#5a4a00", lineHeight: 1.7,
                }}>
                  {sec.highlight}
                </div>
              )}
            </div>
          ))}

          {/* 완료 버튼 */}
          <div style={{ borderTop: `1px solid #e9ecef`, paddingTop: 24, display: "flex", justifyContent: "flex-end" }}>
            {lesson.done ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: G1, fontWeight: 700, fontSize: "0.9rem" }}>
                ✅ 학습 완료!
              </div>
            ) : (
              <button
                onClick={onComplete}
                style={{
                  background: G1, color: "white", border: "none",
                  borderRadius: 12, padding: "13px 32px",
                  fontSize: "0.95rem", fontWeight: 800, cursor: "pointer",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  boxShadow: `0 4px 16px rgba(26,122,62,0.3)`,
                }}
              >
                📘 학습 완료하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}
const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: lesson.done ? "linear-gradient(135deg, #f4fdf7, white)" : "white",
        borderRadius: 20, padding: 20,
        boxShadow: hover ? "0 8px 32px rgba(46,204,113,.18)" : "0 4px 20px rgba(0,0,0,.08)",
        border: `2px solid ${hover ? G2 : lesson.done ? G3 : "#e9ecef"}`,
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        transition: "all .26s", cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11, marginBottom: 12 }}>
        <div style={{ fontSize: "1.9rem", flexShrink: 0 }}>{lesson.emoji}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 900, fontSize: "0.95rem", color: G1, marginBottom: 4, fontFamily: "'Noto Sans KR', sans-serif" }}>
            {lesson.title} {lesson.done && "✅"}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#5a7366", lineHeight: 1.55 }}>{lesson.desc}</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <DiffBadge d={lesson.difficulty} />
          <TagBadge label={lesson.tag} />
        </div>
        <button
          style={{
            background: lesson.done ? "white" : G2,
            color: lesson.done ? G2 : "white",
            border: lesson.done ? `2px solid ${G2}` : "none",
            borderRadius: 50, padding: "7px 16px",
            fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          {lesson.done ? "📖 복습" : "📘 학습"}
        </button>
      </div>
    </div>
  );
};

// ── Modal (교육 자료) ──

interface ModalProps { idx: number | null; onClose: () => void; }
const Modal: React.FC<ModalProps> = ({ idx, onClose }) => {
  if (idx === null) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed" as const, inset: 0, background: "rgba(0,0,0,.65)",
        zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 22,
          maxWidth: 520, width: "92%", maxHeight: "90vh", overflow: "auto",
          boxShadow: "0 24px 60px rgba(0,0,0,.28)",
        }}
      >
        <img
          src={EDU_IMAGES[idx]}
          alt={EDU_META[idx].title}
          style={{ width: "100%", display: "block", borderRadius: "20px 20px 0 0" }}
        />
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "0.97rem", color: G1, marginBottom: 2 }}>{EDU_META[idx].title}</div>
            <div style={{ fontSize: "0.78rem", color: "#5a7366" }}>{EDU_META[idx].sub}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: G1, color: "white", border: "none", borderRadius: 50, padding: "7px 18px", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}
          >
            닫기 ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Material Card ──
interface MatCardProps { idx: number; onClick: () => void; }
const MaterialCard: React.FC<MatCardProps> = ({ idx, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "white", borderRadius: 20, overflow: "hidden",
        boxShadow: hover ? "0 8px 32px rgba(46,204,113,.18)" : "0 4px 20px rgba(0,0,0,.08)",
        border: `2px solid ${hover ? G2 : "transparent"}`,
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        transition: "all .26s", cursor: "pointer",
      }}
    >
      <div style={{ overflow: "hidden", aspectRatio: "3/4" }}>
        <img
          src={EDU_IMAGES[idx]}
          alt={EDU_META[idx].title}
          loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hover ? "scale(1.04)" : "scale(1)", transition: "transform .3s",
          }}
        />
      </div>
      <div style={{ padding: "13px 16px" }}>
        <div style={{ fontWeight: 800, fontSize: "0.88rem", color: G1, marginBottom: 3 }}>{EDU_META[idx].title}</div>
        <div style={{ fontSize: "0.76rem", color: "#5a7366" }}>{EDU_META[idx].sub}</div>
      </div>
    </div>
  );
};

// ── Main Component ──
interface EducationPageProps {
  onAddPoints?: (pts: number) => void;
}

export default function EducationPage({ onAddPoints }: EducationPageProps) {
  const [modalIdx, setModalIdx]       = useState<number | null>(null);
  const [selectedLesson, setSelected] = useState<number | null>(null);
  const [doneLessons, setDoneLessons] = useState<boolean[]>(
    LESSONS.map(l => l.done)
  );
  const [pointsGiven, setPointsGiven] = useState(false);

  const doneCount = doneLessons.filter(Boolean).length;
  const pct = Math.round((doneCount / LESSONS.length) * 100);

  const completeLesson = (idx: number) => {
  const newDone = [...doneLessons];
  newDone[idx] = true;
  setDoneLessons(newDone);

  if (!pointsGiven && newDone.every(Boolean)) {
    setPointsGiven(true);
    onAddPoints?.(20);  // ← 이벤트 핸들러에서 직접 호출
  }

  setSelected(null);
};

  // 학습 상세 페이지
  if (selectedLesson !== null) {
    return (
      <div>
        <LessonDetail
          idx={selectedLesson}
          lesson={{ ...LESSONS[selectedLesson], done: doneLessons[selectedLesson] }}
          onBack={() => setSelected(null)}
          onComplete={() => completeLesson(selectedLesson)}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.55rem", color: G1, marginBottom: 4, fontFamily: "'Noto Sans KR', sans-serif" }}>
          📖 영양 배움터
        </h1>
        <p style={{ color: "#5a7366", fontSize: "0.9rem" }}>
          영양에 대한 핵심 지식을 배워보세요. 학습을 완료하면 포인트가 주어져요!
        </p>
      </div>

      {/* Progress */}
      <div style={{
        background: "white", borderRadius: 20, padding: "18px 26px",
        boxShadow: "0 4px 20px rgba(0,0,0,.08)", display: "flex",
        alignItems: "center", gap: 20, marginBottom: 26,
        border: `2px solid ${G3}`,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
          background: `conic-gradient(${G2} ${pct}%, #e9ecef ${pct}%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.95rem", fontWeight: 900, color: G1,
          boxShadow: `0 0 0 5px white, 0 0 0 7px ${G3}`,
        }}>
          {doneCount}/{LESSONS.length}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: "0.98rem", color: G1, marginBottom: 4 }}>
            학습 진행률 {pct}%
          </div>
          <div style={{ fontSize: "0.82rem", color: "#5a7366", marginBottom: 8 }}>
            {LESSONS.length - doneCount}개 챕터가 남았어요. 계속 학습해봐요! 🌱
          </div>
          <div style={{ background: "#e9ecef", borderRadius: 50, height: 9, overflow: "hidden", width: 240 }}>
            <div style={{
              background: `linear-gradient(90deg, ${G2}, ${G1})`,
              height: "100%", width: `${pct}%`, borderRadius: 50,
              transition: "width .6s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div style={{ fontWeight: 900, fontSize: "1.15rem", color: G1, marginBottom: 5, fontFamily: "'Noto Sans KR', sans-serif" }}>
        📚 학습 챕터
      </div>
      <div style={{ fontSize: "0.85rem", color: "#5a7366", marginBottom: 18 }}>순서대로 배워보세요</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 36 }}>
        {LESSONS.map((l, i) => (
          <LessonCard key={i} lesson={{ ...l, done: doneLessons[i] }} onClick={() => setSelected(i)} />
        ))}
      </div>

      {/* Education Materials */}
      <div style={{ fontWeight: 900, fontSize: "1.15rem", color: G1, marginBottom: 4, fontFamily: "'Noto Sans KR', sans-serif" }}>
        📋 영양 교육 자료
      </div>
      <div style={{ fontSize: "0.84rem", color: "#5a7366", marginBottom: 18 }}>
        이미지를 클릭하면 크게 볼 수 있어요
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {EDU_META.map((_, i) => (
          <MaterialCard key={i} idx={i} onClick={() => setModalIdx(i)} />
        ))}
      </div>

      <Modal idx={modalIdx} onClose={() => setModalIdx(null)} />
         {/* 출처 */}
      <div style={{
        marginTop: 48, padding: "20px 24px",
        borderTop: "1px solid #e9ecef",
        fontSize: "0.78rem", color: "#888", lineHeight: 1.8,
      }}>
        <strong style={{ color: "#555" }}>출처</strong><br />
        - 2023 식품안전·영양교육 초등학교 교재 및 지침서 (식약처)<br />
        - 아동비만예방사업 '건강한 돌봄놀이터' 영양프로그램 영상 교육자료 (한국건강증진개발원, 보건복지부)
      </div>
    </div>
  );
}
