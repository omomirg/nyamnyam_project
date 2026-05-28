import { useState, useEffect, useRef } from "react";
import { Send, RotateCcw } from "lucide-react";
import { Link } from "wouter";

// ============================================================
// ⚙️ Gemini API 키 입력
//    발급: https://aistudio.google.com → Get API Key
// ============================================================
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ============================================================
// 질문 데이터
// ============================================================
const QUESTIONS = [
  {
    id: "q1",
    question: "안녕! 나는 영양 친구 당근이야 🥕\n지난 3일 동안 채소나 과일을 먹었어?\n무엇을 먹었는지 기억나는 대로 알려줘!",
    hint: "사용자가 언급한 채소/과일을 칭찬하고, 부족한 경우 먹기 쉬운 채소/과일 1가지만 추천해줘. 2~3문장, 이모티콘 포함, 초등학생 눈높이로 친근하게.",
  },
  {
    id: "q2",
    question: "다음 질문이야! 🍳\n지난 3일 동안 아침밥은 먹었어?\n몇 번 먹었고 어떤 음식이었는지 알려줘!",
    hint: "아침 식사 습관을 칭찬하거나 격려해줘. 안 먹었다면 아침 식사의 중요성 1가지만 쉽게 설명. 2~3문장, 이모티콘 포함, 초등학생 눈높이로.",
  },
  {
    id: "q3",
    question: "마지막 질문이야! 거의 다 왔어 😊\n3일 동안 과자, 음료수, 라면 같은 음식은 먹었어?\n얼마나 먹었는지 알려줘!",
    hint: "과도하게 부정하지 말고 '가끔은 괜찮아'라는 긍정적 시각으로 피드백. 너무 많으면 건강한 대안 1가지 제안. 2~3문장, 이모티콘 포함, 초등학생 눈높이로.",
  },
];

const FALLBACKS = [
  "잘 알려줘서 고마워! 채소랑 과일을 먹으면 비타민이 가득 채워진단다 🥦💪",
  "아침 식사에 대해 알려줘서 고마워! 아침밥을 먹으면 하루 종일 힘이 넘친다는 거 알지? 🍳✨",
  "솔직하게 말해줘서 고마워! 좋아하는 음식을 먹는 건 자연스러운 일이야. 균형이 중요하다는 걸 기억해 😊",
];

interface Message {
  role: "bot" | "user";
  text: string;
}

interface Answers {
  q1?: string;
  q2?: string;
  q3?: string;
}

export default function ChatbotPage({ onAddPoints }: { onAddPoints?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 첫 질문 출력
  useEffect(() => {
    setMessages([{ role: "bot", text: QUESTIONS[0].question }]);
  }, []);

  // 스크롤 자동 내리기
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const addMessage = (role: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  // Gemini API 호출
  async function getGeminiFeedback(userAnswer: string, hint: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `너는 초등학생의 식습관을 도와주는 친근한 영양 친구야.\n아래 아이의 답변에 대해 짧은 피드백을 한국어로 써줘.\n\n[지침]\n${hint}\n절대 부정적인 표현은 쓰지 마. 이모티콘 1~2개 포함. 반드시 2~3문장 이내.\n\n[아이 답변]\n${userAnswer}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 150, temperature: 0.7 },
      }),
    });
    if (!res.ok) throw new Error("API 오류");
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }

  // 리포트 데이터 생성 및 저장
  async function saveReport(finalAnswers: Answers) {
    const reportPrompt = `초등학생의 3일치 식습관 데이터야. 분석해서 아래 JSON 형식으로만 응답해. 다른 말은 하지 마:\n{"score":숫자(0-100),"grade":"씨앗🌱 또는 새싹🌿 또는 나무🌳 또는 열매🍎","summary":"한줄총평(20자이내)","veggieFruit":{"status":"충분✅ 또는 보통⚠️ 또는 부족❌","comment":"한문장"},"breakfast":{"status":"충분✅ 또는 보통⚠️ 또는 부족❌","comment":"한문장"},"snack":{"status":"좋음✅ 또는 보통⚠️ 또는 주의❌","comment":"한문장"},"missions":["미션1","미션2","미션3"],"recommend":["음식1","음식2","음식3"]}\n\n데이터:\n채소/과일:${finalAnswers.q1}\n아침식사:${finalAnswers.q2}\n간식:${finalAnswers.q3}`;

    let report = {
      date: new Date().toLocaleDateString("ko-KR"),
      answers: finalAnswers,
      score: 65, grade: "새싹🌿", summary: "균형 잡힌 식단을 향해 나아가고 있어요!",
      veggieFruit: { status: "보통⚠️", comment: "채소를 조금 더 늘려보아요!" },
      breakfast: { status: "보통⚠️", comment: "아침밥을 꼭 챙겨먹어요!" },
      snack: { status: "보통⚠️", comment: "달콤한 간식은 가끔만!" },
      missions: ["내일 점심에 채소 반찬 1가지 먹기", "이번 주 아침밥 3번 챙겨먹기", "음료수 대신 물 마시기"],
      recommend: ["시금치나물", "우유 한 컵", "사과"],
    };

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: reportPrompt }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.3 },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.candidates[0].content.parts[0].text;
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        report = { ...report, ...parsed, date: new Date().toLocaleDateString("ko-KR"), answers: finalAnswers };
      }
    } catch (_) {}

    localStorage.setItem("nutritionReport", JSON.stringify(report));
  }

  // 메시지 전송
  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading || isDone) return;

    addMessage("user", text);
    setInput("");
    setIsLoading(true);

    const newAnswers = { ...answers, [QUESTIONS[step].id]: text };
    setAnswers(newAnswers);

    let feedback = FALLBACKS[step];
    try {
      feedback = await getGeminiFeedback(text, QUESTIONS[step].hint);
    } catch (_) {}

    addMessage("bot", feedback);
    setIsLoading(false);

    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep < QUESTIONS.length) {
      setTimeout(() => addMessage("bot", QUESTIONS[nextStep].question), 800);
    } else {
      setTimeout(async () => {
        addMessage("bot", "와! 3가지 질문을 모두 마쳤어! 🎉\n리포트를 만들고 있을게, 잠깐만 기다려줘!");
        await saveReport(newAnswers);
        onAddPoints?.();
        setIsDone(true);
      }, 800);
    }
  }

  const progressLabels = ["채소·과일", "아침 식사", "간식·패스트푸드"];

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto px-6 py-6">

      {/* 헤더 */}
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-green-500 flex items-center justify-center text-2xl shadow-sm">
          🥕
        </div>
        <div>
          <h2 className="font-bold text-gray-800 text-base">영양 친구 당근이</h2>
          <p className="text-xs text-gray-400 mt-0.5">3가지 질문에 답하면 나만의 영양 리포트가 만들어져요!</p>
        </div>
      </div>

      {/* 진행 단계 */}
      <div className="flex items-center gap-2 mb-5">
        {progressLabels.map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-1.5 ${i < step ? "text-green-600" : i === step && !isDone ? "text-orange-500" : "text-gray-300"}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all
                ${i < step ? "bg-green-500 border-green-500 text-white" : i === step && !isDone ? "border-orange-400 bg-orange-50 text-orange-500" : "border-gray-200 text-gray-300"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="text-[11px] font-medium hidden sm:block">{label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 rounded ${i < step ? "bg-green-400" : "bg-gray-100"}`} />}
          </div>
        ))}
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 min-h-[280px] max-h-[calc(100vh-400px)] pb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-[fadeUp_0.3s_ease]`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0
              ${msg.role === "bot" ? "bg-gradient-to-br from-green-200 to-green-400" : "bg-blue-100"}`}>
              {msg.role === "bot" ? "🥕" : "😊"}
            </div>
            <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
              ${msg.role === "bot"
                ? "bg-gray-100 text-gray-800 rounded-bl-sm"
                : "bg-green-500 text-white rounded-br-sm"}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* 로딩 */}
        {isLoading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center text-base">🥕</div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      {!isDone ? (
        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className={`flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2 transition-colors
            ${isLoading ? "border-gray-100 opacity-60" : "border-gray-200 focus-within:border-green-400"}`}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              disabled={isLoading}
              rows={1}
              placeholder="여기에 답을 입력해요! (Enter로 전송)"
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none resize-none placeholder:text-gray-400 min-h-[24px] max-h-[80px]"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-2">Enter = 전송 &nbsp;|&nbsp; Shift+Enter = 줄바꿈</p>
        </div>
      ) : (
        <div className="border-t border-gray-100 pt-4 mt-2">
          <Link href="/report">
            <button className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              🎉 나의 영양 리포트 보러 가기!
            </button>
          </Link>
          <button
            onClick={() => { setMessages([{ role: "bot", text: QUESTIONS[0].question }]); setStep(0); setAnswers({}); setIsDone(false); setInput(""); }}
            className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 다시 시작하기
          </button>
        </div>
      )}
    </div>
  );
}
