import { useState } from "react";
import { Route, Switch, Link, useLocation } from "wouter";
import MainPage from "./pages/MainPage";
import CharacterPage from "./pages/CharacterPage";
import EducationPage from "./pages/EducationPage";
import ChatbotPage from "./pages/ChatbotPage";
import ReportPage from "./pages/ReportPage";
import GamePage from "./pages/GamePage";

import NutritionGame from "./games/cardFlipping/NutritionGame";
import OXGame from "./games/oxGame/OXGame";
import MealTrayGame from "./games/platedecoGame/MealTrayGame";
import SugarCubegame from "./games/sugerGame/SugarCubeGame";

type CharKey = "bromi" | "saekomi" | "ttorong";

function MainPageWrapper() {
  const [, navigate] = useLocation();
  const pageRouteMap: Record<string, string> = {
    char:   "/characters",
    edu:    "/education",
    friend: "/chatbot",
    game:   "/games",
  };
  const showPage = (pageId: string) => navigate(pageRouteMap[pageId] ?? "/");
  return <MainPage showPage={showPage} />;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const sidebarItems = [
    { href: "/chatbot",    icon: "🥕", label: "영양 친구" },
    { href: "/games",      icon: "🎮", label: "미니 게임" },
    { href: "/characters", icon: "💪", label: "나의 건강 캐릭터" },
    { href: "/education",  icon: "📖", label: "영양 배움터" },
    { href: "/report",     icon: "📋", label: "나의 영양 기록" },
  ];
  return (
    <div className="min-h-screen bg-[#fafbf8]">
      <header className="h-16 bg-white border-b border-gray-100 shadow-[0_0_6px_rgba(0,0,0,0.08)] flex items-center px-6 gap-5 sticky top-0 z-50">
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xl">🥗</div>
            <span className="text-base font-bold text-gray-800 whitespace-nowrap">내 손안의 영양 짝꿍</span>
          </div>
        </Link>
      </header>
      <div className="flex" style={{ minHeight: "calc(100vh - 64px)" }}>
        <aside className="w-[220px] bg-[rgba(0,0,0,0.03)] shrink-0 py-3 sticky top-16 self-start" style={{ height: "calc(100vh - 64px)" }}>
          {sidebarItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-all
                  ${isActive ? "bg-green-50 text-green-600 font-semibold" : "text-gray-700 hover:bg-black/[0.03]"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm
                    ${isActive ? "bg-green-100" : "bg-black/[0.05]"}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </aside>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}

function App() {
  const [charPts, setCharPts] = useState<Record<CharKey, number>>({
    bromi: 0, saekomi: 0, ttorong: 0,
  });
  const [curChar, setCurChar] = useState<CharKey>("bromi");

  const addPoints = (pts: number) => {
    setCharPts(prev => ({
      ...prev,
      [curChar]: Math.min(prev[curChar] + pts, 100),
    }));
  };

  return (
    <Switch>
      <Route path="/">
        <AppLayout><MainPageWrapper /></AppLayout>
      </Route>

      <Route path="/chatbot">
        <AppLayout><ChatbotPage onAddPoints={() => addPoints(20)} /></AppLayout>
      </Route>
      <Route path="/report">
        <AppLayout><ReportPage /></AppLayout>
      </Route>
      <Route path="/characters">
        <AppLayout>
          <CharacterPage
            charPts={charPts}
            curChar={curChar}
            setCurChar={setCurChar}
            levelUp={() => addPoints(5)}
          />
        </AppLayout>
      </Route>
      <Route path="/education">
        <AppLayout><EducationPage onAddPoints={() => addPoints(20)} /></AppLayout>
      </Route>

      <Route path="/games">
        <AppLayout><GamePage /></AppLayout>
      </Route>

      {/* 게임 - AppLayout 안에서 렌더링 */}
      <Route path="/game/nutrition">
        <AppLayout><NutritionGame onGameComplete={() => addPoints(10)} /></AppLayout>
      </Route>
      <Route path="/game/ox">
        <AppLayout><OXGame onGameComplete={() => addPoints(15)} /></AppLayout>
      </Route>
      <Route path="/game/meal-tray">
        <AppLayout><MealTrayGame onGameComplete={() => addPoints(20)} /></AppLayout>
      </Route>
      <Route path="/game/sugar">
        <AppLayout><SugarCubegame onGameComplete={() => addPoints(15)} /></AppLayout>
      </Route>
    </Switch>
  );
}

export default App;
