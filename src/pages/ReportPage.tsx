import { useEffect, useState } from "react";
import { Link } from "wouter";
import { RotateCcw, ClipboardList } from "lucide-react";

interface ReportData {
  date: string;
  score: number;
  grade: string;
  summary: string;
  answers: { q1?: string; q2?: string; q3?: string };
  veggieFruit: { status: string; comment: string };
  breakfast: { status: string; comment: string };
  snack: { status: string; comment: string };
  missions: string[];
  recommend: string[];
}

export default function ReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("nutritionReport");
    if (raw) setReport(JSON.parse(raw));
  }, []);

  const handleReset = () => {
    if (confirm("이전 기록이 사라져요. 다시 시작할까요?")) {
      localStorage.removeItem("nutritionReport");
      window.location.href = "/chatbot";
    }
  };

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-gray-500 text-base mb-6 leading-relaxed">
          아직 영양 기록이 없어요!<br />영양 친구 당근이와 대화를 먼저 해봐요 🥕
        </p>
        <Link href="/chatbot">
          <button className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2">
            🥕 영양 친구와 대화하기
          </button>
        </Link>
      </div>
    );
  }

  const scoreColor = report.score >= 80 ? "text-green-700" : report.score >= 60 ? "text-orange-600" : "text-red-600";
  const scoreBorder = report.score >= 80 ? "border-green-400" : report.score >= 60 ? "border-orange-400" : "border-red-400";
  const scoreBg = report.score >= 80 ? "bg-green-50" : report.score >= 60 ? "bg-orange-50" : "bg-red-50";

  const badgeColors = ["bg-yellow-100 text-yellow-700", "bg-blue-100 text-blue-700", "bg-pink-100 text-pink-700"];
  const badgeIcons = ["⭐", "🎯", "🚀"];

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-16">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList className="w-5 h-5 text-gray-700" />
        <h1 className="text-xl font-bold text-gray-800">나의 영양 기록</h1>
      </div>
      <p className="text-sm text-gray-400 mb-6">영양 친구와 나눈 대화를 바탕으로 만든 나만의 리포트예요!</p>

      {/* 점수 카드 */}
      <div className={`${scoreBg} border rounded-2xl p-6 flex items-center gap-6 mb-5`}
        style={{ borderColor: scoreBorder.replace("border-", "") }}>
        <div className={`w-24 h-24 rounded-full bg-white border-4 ${scoreBorder} flex flex-col items-center justify-center shrink-0 shadow-sm`}>
          <span className={`text-3xl font-extrabold ${scoreColor}`}>{report.score}</span>
          <span className={`text-xs font-semibold ${scoreColor} opacity-70`}>점</span>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-gray-800 mb-1">{report.grade}</div>
          <div className={`text-sm font-semibold mb-2 ${scoreColor}`}>{report.summary}</div>
          <div className="text-xs text-gray-400">📅 기록 날짜: {report.date}</div>
        </div>
      </div>

      {/* 영양 분석 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-1.5">🔍 3일 식단 분석</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "채소·과일", data: report.veggieFruit },
            { label: "아침 식사", data: report.breakfast },
            { label: "간식·패스트푸드", data: report.snack },
          ].map(({ label, data }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <div className="text-xl mb-1">{data.status.split(" ")[1] || "⚠️"}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-[11px] text-gray-600 leading-snug">{data.comment}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 내 답변 요약 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-1.5">💬 내가 말한 내용</h3>
        <div className="flex flex-col gap-2">
          {[
            { icon: "🥦", label: "채소·과일", value: report.answers?.q1 },
            { icon: "🍳", label: "아침 식사", value: report.answers?.q2 },
            { icon: "🍜", label: "간식·패스트푸드", value: report.answers?.q3 },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <span className="text-xs font-bold text-gray-400 w-24 shrink-0">{icon} {label}</span>
              <span className="text-xs text-gray-700 flex-1">{value || "-"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 미션 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-1.5">💡 이번 주 실천 미션</h3>
        <div className="flex flex-col gap-2.5">
          {report.missions?.map((mission, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${badgeColors[i]}`}>
                {badgeIcons[i]}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">{mission}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{"⭐".repeat(i + 1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 추천 음식 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-1.5">🍽️ 이런 음식을 먹어봐요!</h3>
        <div className="flex flex-wrap gap-2">
          {report.recommend?.map((food) => (
            <span key={food} className="px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm font-semibold text-green-700">
              🥢 {food}
            </span>
          ))}
        </div>
      </div>

      {/* 다시하기 */}
      <button
        onClick={handleReset}
        className="w-full py-3.5 border-2 border-green-400 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" /> 다시 기록하기
      </button>
    </div>
  );
}
