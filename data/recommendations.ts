// Smart recommendation engine — surfaces the most relevant next lesson, simulation,
// or article based on user's learning history, quiz performance, and goals.
// Proposal: "AI surfaces the most relevant next lesson, article, or simulation"

import { LESSON_MODULES } from "./lessons";
import { useUserStore } from "../store/useUserStore";

export interface SmartRecommendation {
  id: string;
  type: "lesson" | "simulation" | "article" | "goal";
  tag: string;
  title: string;
  desc: string;
  route: string;
  icon: string;
  priority: number; // higher = more relevant
}

function getQuizAverage(quizScores: Record<number, number[]>): number {
  const allScores = Object.values(quizScores).flat();
  if (allScores.length === 0) return 0;
  return allScores.reduce((a, b) => a + b, 0) / allScores.length;
}

export function getSmartRecommendations(): SmartRecommendation[] {
  const state = useUserStore.getState();
  const { score, goal, quizScores, xp, streak, completedLessonIds } = state;
  const quizAvg = getQuizAverage(quizScores);
  const recs: SmartRecommendation[] = [];

  // 1. Next lesson recommendation (highest priority if not all complete).
  // Looks up the first not-yet-completed lesson by id rather than assuming
  // lessons are always finished in array order — the Learn tab can now
  // reorder lessons by goal, so completion order isn't guaranteed sequential.
  const nextLesson = LESSON_MODULES.find((m) => !completedLessonIds.includes(m.id));
  if (nextLesson) {
    recs.push({
      id: `lesson-${nextLesson.id}`,
      type: "lesson",
      tag: "Next Lesson",
      title: nextLesson.title,
      desc: `Continue your learning journey — earn ${nextLesson.xp} XP.`,
      route: "/(tabs)/learn",
      icon: nextLesson.emoji || "📚",
      priority: 100,
    });
  }

  // 2. Weak-area lesson (if quiz avg < 60%)
  if (quizAvg > 0 && quizAvg < 60) {
    const weakestModuleId = Object.entries(quizScores).reduce(
      (worst, [id, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg < worst.avg ? { id: Number(id), avg } : worst;
      },
      { id: 0, avg: 100 }
    );
    if (weakestModuleId.id > 0) {
      const mod = LESSON_MODULES.find((m) => m.id === weakestModuleId.id);
      if (mod) {
        recs.push({
          id: `review-${mod.id}`,
          type: "lesson",
          tag: "Review",
          title: `Review: ${mod.title}`,
          desc: `Your quiz score was low. Review to strengthen understanding.`,
          route: "/(tabs)/learn",
          icon: "🔄",
          priority: 90,
        });
      }
    }
  }

  // 3. Simulation recommendation based on goal
  const goalSimMap: Record<string, SmartRecommendation> = {
    "Build an Emergency Fund": {
      id: "sim-momo",
      type: "simulation",
      tag: "Try Simulator",
      title: "MoMo Fee Calculator",
      desc: "Calculate exact fees to save more on every transfer.",
      route: "/simulations",
      icon: "📱",
      priority: 75,
    },
    "Learn Investing": {
      id: "sim-tbill",
      type: "simulation",
      tag: "Try Simulator",
      title: "Treasury Bill Yield Calculator",
      desc: "See how much your money could earn in Ghana T-Bills.",
      route: "/simulations",
      icon: "📈",
      priority: 75,
    },
    "Become Debt Free": {
      id: "sim-loan",
      type: "simulation",
      tag: "Try Simulator",
      title: "Loan Interest Simulator",
      desc: "Compare Qwikloan vs bank loan costs before borrowing.",
      route: "/simulations",
      icon: "💳",
      priority: 75,
    },
    "Start a Business": {
      id: "sim-tax",
      type: "simulation",
      tag: "Try Simulator",
      title: "Tax & Pension Planner",
      desc: "Understand your salary deductions and plan better.",
      route: "/simulations",
      icon: "🧮",
      priority: 75,
    },
    "Save for Education": {
      id: "sim-inflation",
      type: "simulation",
      tag: "Try Simulator",
      title: "Inflation Eroder",
      desc: "See how inflation affects your savings over time.",
      route: "/simulations",
      icon: "📊",
      priority: 75,
    },
  };

  if (goal && goalSimMap[goal]) {
    recs.push(goalSimMap[goal]);
  } else if (score >= 13) {
    recs.push({
      id: "sim-tbill-adv",
      type: "simulation",
      tag: "Try Simulator",
      title: "Treasury Bill Yield Calculator",
      desc: "Project your investment returns with Ghana T-Bills.",
      route: "/simulations",
      icon: "📈",
      priority: 70,
    });
  } else {
    recs.push({
      id: "sim-momo-basic",
      type: "simulation",
      tag: "Try Simulator",
      title: "MoMo Fee Calculator",
      desc: "Understand how transaction fees affect your savings.",
      route: "/simulations",
      icon: "📱",
      priority: 70,
    });
  }

  // 5. AI Tutor prompt (if never used, or low streak)
  if (xp < 200 && streak < 2) {
    recs.push({
      id: "ai-tutor-prompt",
      type: "lesson",
      tag: "Ask AI Coach",
      title: "Got a finance question?",
      desc: "Ask the AI Tutor anything about Ghana finance.",
      route: "/ai-tutor",
      icon: "🤖",
      priority: 50,
    });
  }

  // Sort by priority descending, return top 3
  return recs.sort((a, b) => b.priority - a.priority).slice(0, 3);
}
