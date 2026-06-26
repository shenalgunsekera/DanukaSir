import type { Student } from "./types";
import { generateAccessCode, generateToken } from "./utils";

export function blankStudent(): Student {
  const now = Date.now();
  return {
    id: `stu-${now}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    grade: "",
    subjects: [],
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    enrolledAt: now,
    goals: "",
    currentLevel: "",
    strengths: [],
    weaknesses: [],
    improvementAreas: [],
    performance: [],
    exams: [],
    assignments: [],
    attendance: { present: 0, total: 0 },
    feedback: [],
    achievements: [],
    timeline: [],
    access: {
      code: generateAccessCode(),
      token: generateToken(),
      enabled: true,
      lastViewedAt: null,
      viewCount: 0,
    },
    status: "active",
    updatedAt: now,
  };
}

export function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
