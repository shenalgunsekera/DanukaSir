import type { Note, Review, Student, TutorProfile } from "./types";

// ─────────────────────────────────────────────────────────────
//  Default tutor profile for Danuka
//  Drop a real photo at /public/images/danuka.jpg to replace the avatar.
// ─────────────────────────────────────────────────────────────
export const SEED_PROFILE: TutorProfile = {
  name: "Danuka",
  headline:
    "Private tutor & academic mentor helping students turn potential into measurable results.",
  bio: "I'm Danuka — a dedicated private tutor with a decade of experience guiding students from uncertainty to genuine academic confidence. My work goes beyond covering a syllabus: I build study systems, repair the foundations exams expose, and keep parents informed every step of the way. Over the years I've mentored hundreds of students across science and mathematics, and I treat every learner as an individual with a unique path to mastery.",
  philosophy:
    "Every student can excel when teaching meets them where they are. I believe in clarity over memorisation, consistency over cramming, and measurable progress over vague reassurance.",
  approach:
    "I diagnose the real gaps first, then build a personalised roadmap. Lessons blend concept-building, exam technique, and weekly accountability — with transparent progress shared with parents through live reports.",
  experienceOverview:
    "Ten years of one-to-one and small-group tutoring spanning O/L and A/L Mathematics, Physics and Chemistry, with a consistent record of grade transformations and top-tier exam outcomes.",
  yearsExperience: 10,
  email: "danuka@example.com",
  phone: "+94 70 000 0000",
  location: "Colombo, Sri Lanka · Online worldwide",
  avatar: "/images/danuka.jpg",
  coverImage: "",
  subjects: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Combined Maths",
    "Exam Strategy",
  ],
  teachingMethods: [
    "Personalised learning roadmaps",
    "Concept-first teaching",
    "Past-paper mastery",
    "Weekly accountability check-ins",
    "Live parent progress reports",
    "Spaced-repetition revision",
  ],
  qualifications: [
    {
      id: "q1",
      title: "BSc (Hons) in Physical Science",
      institution: "University of Colombo",
      year: "2014",
    },
    {
      id: "q2",
      title: "Postgraduate Diploma in Education",
      institution: "Open University",
      year: "2016",
    },
  ],
  certifications: [
    {
      id: "c1",
      title: "Certified Online Educator",
      institution: "Cambridge Professional Development",
      year: "2020",
    },
    {
      id: "c2",
      title: "Advanced Exam Coaching Certification",
      institution: "Edexcel Academy",
      year: "2019",
    },
  ],
  achievements: [
    {
      id: "a1",
      title: "98% Exam Pass Rate",
      description:
        "Maintained a 98% pass rate across A/L students over the last five cohorts.",
      year: "2024",
      icon: "Trophy",
    },
    {
      id: "a2",
      title: "40+ Island-Rank Students",
      description:
        "Mentored more than forty students into island-rank positions in national exams.",
      year: "2023",
      icon: "Medal",
    },
    {
      id: "a3",
      title: "Educator of the Year — Finalist",
      description:
        "Recognised among the top private educators in the regional teaching awards.",
      year: "2022",
      icon: "Award",
    },
  ],
  milestones: [
    {
      id: "m1",
      year: "2014",
      title: "Started private tutoring",
      description: "Began one-to-one tutoring alongside university studies.",
    },
    {
      id: "m2",
      year: "2017",
      title: "Opened a dedicated study practice",
      description: "Expanded to small-group mentorship with structured tracking.",
    },
    {
      id: "m3",
      year: "2020",
      title: "Went fully online",
      description: "Built a remote tutoring model reaching students worldwide.",
    },
    {
      id: "m4",
      year: "2024",
      title: "Launched live progress reporting",
      description: "Introduced real-time progress reports shared with parents.",
    },
  ],
  stats: [
    { id: "s1", label: "Students Mentored", value: 480, suffix: "+" },
    { id: "s2", label: "Years Teaching", value: 10 },
    { id: "s3", label: "Success Rate", value: 98, suffix: "%" },
    { id: "s4", label: "Island-Rank Students", value: 42, suffix: "+" },
  ],
  successStories: [
    {
      id: "ss1",
      studentName: "Nethmi P.",
      subject: "Combined Mathematics",
      fromGrade: "Failing (C/S)",
      toGrade: "A",
      comment:
        "Improved from borderline passes to a confident A within two terms through consistent past-paper drilling and rebuilt fundamentals.",
      featured: true,
    },
    {
      id: "ss2",
      studentName: "Kavindu R.",
      subject: "Physics",
      fromGrade: "Average",
      toGrade: "A · Island Rank",
      comment:
        "A focused twelve-month roadmap took Kavindu from average results to an island-rank physics performance.",
      featured: true,
    },
    {
      id: "ss3",
      studentName: "Anonymous",
      subject: "Chemistry",
      fromGrade: "Struggling",
      toGrade: "B+",
      comment:
        "Overcame deep-rooted anxiety around chemistry and now approaches problems methodically and calmly.",
      featured: false,
    },
  ],
  socials: [
    { label: "Email", url: "mailto:danuka@example.com" },
    { label: "WhatsApp", url: "https://wa.me/94700000000" },
  ],
  bankDetails: {
    bankName: "Commercial Bank of Ceylon",
    accountName: "A. Perera",
    accountNumber: "8001234567",
    branch: "Colombo Main",
    instructions:
      "Transfer the exact amount, then upload your payment slip. Use your full name as the reference.",
  },
  availability: {
    weekdays: [1, 3, 5, 6], // Mon, Wed, Fri, Sat
    slots: ["16:00", "17:30", "19:00"],
    sessionMinutes: 60,
    blockedDates: [],
    note: "Times shown in Sri Lanka time (GMT+5:30). Online & in-person available.",
  },
  theme: {
    bgColor: "#0A0A0A",
    pattern: "sparkles",
    accent: "#F4F4F4",
  },
  sections: {
    stats: true,
    successStories: true,
    reviews: true,
    qualifications: true,
    milestones: true,
    contact: true,
  },
};

export const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    reviewerName: "Mrs. Fernando",
    reviewerRole: "parent",
    anonymous: false,
    rating: 5,
    body: "Danuka completely changed my daughter's relationship with mathematics. The live progress reports kept us informed and reassured the whole way through.",
    status: "approved",
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: "r2",
    reviewerName: "Sahan",
    reviewerRole: "student",
    anonymous: false,
    rating: 5,
    body: "The way concepts are explained finally made physics click for me. I went from dreading exams to actually enjoying them.",
    status: "approved",
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: "r3",
    reviewerName: "Anonymous Parent",
    reviewerRole: "parent",
    anonymous: true,
    rating: 5,
    body: "Professional, patient and genuinely invested. My son's grades improved within a single term.",
    status: "approved",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45,
  },
  {
    id: "r4",
    reviewerName: "Dilini",
    reviewerRole: "student",
    anonymous: false,
    rating: 5,
    body: "More than a tutor — a real mentor. The weekly accountability made all the difference.",
    status: "approved",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
  },
  {
    id: "r5",
    reviewerName: "Mr. Perera",
    reviewerRole: "parent",
    anonymous: false,
    rating: 4,
    body: "Very structured approach and excellent communication. Highly recommended.",
    status: "pending",
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];

const now = Date.now();
const days = (n: number) => now - 1000 * 60 * 60 * 24 * n;

export const SEED_STUDENTS: Student[] = [
  {
    id: "stu-nethmi",
    name: "Nethmi Perera",
    grade: "Grade 13 (A/L)",
    subjects: ["Combined Mathematics", "Physics"],
    parentName: "Mrs. Perera",
    parentEmail: "parent.perera@example.com",
    parentPhone: "+94 71 111 1111",
    enrolledAt: days(420),
    goals: "Secure an A in Combined Mathematics and a strong B+ in Physics for university entrance.",
    currentLevel: "Advanced — consistently scoring above 75%",
    strengths: ["Algebra", "Calculus", "Problem decomposition"],
    weaknesses: ["Mechanics word problems", "Time management under pressure"],
    improvementAreas: ["Exam pacing", "Showing full working"],
    performance: [
      { subject: "Combined Mathematics", level: 86, baseline: 48 },
      { subject: "Physics", level: 72, baseline: 40 },
    ],
    exams: [
      { id: "e1", title: "Term 1 Test", subject: "Combined Mathematics", date: "2025-02-10", score: 62, maxScore: 100, grade: "B" },
      { id: "e2", title: "Mid-Year", subject: "Combined Mathematics", date: "2025-05-20", score: 78, maxScore: 100, grade: "A" },
      { id: "e3", title: "Model Paper 1", subject: "Combined Mathematics", date: "2025-09-15", score: 86, maxScore: 100, grade: "A" },
      { id: "e4", title: "Mid-Year", subject: "Physics", date: "2025-05-22", score: 64, maxScore: 100, grade: "B" },
      { id: "e5", title: "Model Paper 1", subject: "Physics", date: "2025-09-18", score: 72, maxScore: 100, grade: "B+" },
    ],
    assignments: [
      { id: "as1", title: "Integration worksheet", type: "homework", dueDate: "2025-09-20", status: "completed", score: 95 },
      { id: "as2", title: "Mechanics past paper", type: "assignment", dueDate: "2025-09-27", status: "completed", score: 80 },
      { id: "as3", title: "Probability set", type: "homework", dueDate: "2025-10-04", status: "pending" },
    ],
    attendance: { present: 46, total: 48 },
    feedback: [
      { id: "f1", date: "2025-09-01", category: "monthly", title: "September summary", body: "Nethmi has shown remarkable consistency this month. Her calculus is now exam-ready and she is tackling harder mechanics problems with growing confidence." },
      { id: "f2", date: "2025-08-15", category: "improvement", title: "Mechanics breakthrough", body: "The targeted mechanics drills are paying off — accuracy on word problems jumped noticeably." },
      { id: "f3", date: "2025-07-01", category: "recommendation", title: "Next focus", body: "Recommend two timed past papers weekly to sharpen exam pacing ahead of finals." },
    ],
    achievements: [
      { id: "sa1", title: "Most Improved — Term 2", description: "Largest grade jump in the cohort.", year: "2025", icon: "TrendingUp" },
      { id: "sa2", title: "Perfect attendance — Term 1", description: "Attended every session in Term 1.", year: "2025", icon: "CalendarCheck" },
    ],
    timeline: [
      { id: "t1", date: "2024-04-01", type: "enrolled", title: "Joined the programme", description: "Started with foundational gaps in calculus." },
      { id: "t2", date: "2025-05-20", type: "exam", title: "Mid-Year breakthrough", description: "First A grade in Combined Mathematics." },
      { id: "t3", date: "2025-06-10", type: "achievement", title: "Most Improved award", description: "Recognised for the biggest improvement in the group." },
      { id: "t4", date: "2025-09-15", type: "milestone", title: "Crossed 85%", description: "Sustained A-grade performance across model papers." },
    ],
    access: {
      code: "K7M-4QPZ",
      token: "demo-token-nethmi-progress",
      enabled: true,
      lastViewedAt: days(1),
      viewCount: 14,
    },
    status: "active",
    updatedAt: days(1),
  },
  {
    id: "stu-kavindu",
    name: "Kavindu Rajapaksha",
    grade: "Grade 12 (A/L)",
    subjects: ["Physics", "Chemistry"],
    parentName: "Mr. Rajapaksha",
    parentEmail: "parent.raja@example.com",
    parentPhone: "+94 72 222 2222",
    enrolledAt: days(300),
    goals: "Build strong fundamentals in physics and chemistry for next year's A/L exam.",
    currentLevel: "Intermediate — steadily improving",
    strengths: ["Curiosity", "Conceptual questions"],
    weaknesses: ["Numerical accuracy", "Organic chemistry"],
    improvementAreas: ["Consistent revision", "Formula recall"],
    performance: [
      { subject: "Physics", level: 68, baseline: 45 },
      { subject: "Chemistry", level: 59, baseline: 38 },
    ],
    exams: [
      { id: "e1", title: "Term 1 Test", subject: "Physics", date: "2025-03-10", score: 52, maxScore: 100, grade: "C" },
      { id: "e2", title: "Mid-Year", subject: "Physics", date: "2025-06-20", score: 68, maxScore: 100, grade: "B" },
      { id: "e3", title: "Term 1 Test", subject: "Chemistry", date: "2025-03-12", score: 44, maxScore: 100, grade: "S" },
      { id: "e4", title: "Mid-Year", subject: "Chemistry", date: "2025-06-22", score: 59, maxScore: 100, grade: "C" },
    ],
    assignments: [
      { id: "as1", title: "Kinematics problems", type: "homework", dueDate: "2025-09-21", status: "completed", score: 72 },
      { id: "as2", title: "Periodic table quiz", type: "homework", dueDate: "2025-09-28", status: "late", score: 60 },
    ],
    attendance: { present: 38, total: 44 },
    feedback: [
      { id: "f1", date: "2025-09-01", category: "monthly", title: "September summary", body: "Kavindu is gaining confidence in physics. Chemistry still needs more consistent revision — particularly organic mechanisms." },
      { id: "f2", date: "2025-08-10", category: "behaviour", title: "Engagement note", body: "Asks excellent conceptual questions; encourage the same rigour in numerical practice." },
    ],
    achievements: [
      { id: "sa1", title: "Best Question of the Month", description: "Asked the most insightful conceptual question.", year: "2025", icon: "Lightbulb" },
    ],
    timeline: [
      { id: "t1", date: "2024-08-01", type: "enrolled", title: "Joined the programme", description: "Began with weak exam foundations." },
      { id: "t2", date: "2025-06-20", type: "exam", title: "First B grade", description: "Crossed into B territory in physics." },
    ],
    access: {
      code: "T3W-9HRX",
      token: "demo-token-kavindu-progress",
      enabled: true,
      lastViewedAt: days(5),
      viewCount: 6,
    },
    status: "active",
    updatedAt: days(2),
  },
  {
    id: "stu-dilini",
    name: "Dilini Silva",
    grade: "Grade 11 (O/L)",
    subjects: ["Mathematics"],
    parentName: "Mrs. Silva",
    parentEmail: "parent.silva@example.com",
    parentPhone: "+94 73 333 3333",
    enrolledAt: days(180),
    goals: "Achieve an A for O/L Mathematics.",
    currentLevel: "Developing — building confidence",
    strengths: ["Geometry", "Persistence"],
    weaknesses: ["Algebraic manipulation"],
    improvementAreas: ["Speed", "Confidence in tests"],
    performance: [{ subject: "Mathematics", level: 74, baseline: 55 }],
    exams: [
      { id: "e1", title: "Term 1 Test", subject: "Mathematics", date: "2025-04-10", score: 61, maxScore: 100, grade: "B" },
      { id: "e2", title: "Mid-Year", subject: "Mathematics", date: "2025-07-20", score: 74, maxScore: 100, grade: "A-" },
    ],
    assignments: [
      { id: "as1", title: "Algebra revision set", type: "homework", dueDate: "2025-09-22", status: "completed", score: 88 },
    ],
    attendance: { present: 22, total: 24 },
    feedback: [
      { id: "f1", date: "2025-09-01", category: "monthly", title: "September summary", body: "Dilini's algebra is improving steadily. Confidence in tests is the next frontier." },
    ],
    achievements: [],
    timeline: [
      { id: "t1", date: "2025-01-15", type: "enrolled", title: "Joined the programme", description: "Started to strengthen O/L mathematics." },
      { id: "t2", date: "2025-07-20", type: "exam", title: "Crossed into A-range", description: "First A- in a mid-year test." },
    ],
    access: {
      code: "B9N-2LKD",
      token: "demo-token-dilini-progress",
      enabled: true,
      lastViewedAt: null,
      viewCount: 0,
    },
    status: "active",
    updatedAt: days(3),
  },
];

export const SEED_NOTES: Note[] = [
  {
    id: "note-calculus",
    title: "Calculus — Complete Revision Notes",
    description:
      "Concise, exam-focused notes covering differentiation, integration, and applications with worked past-paper examples.",
    subject: "Combined Mathematics",
    grade: "A/L",
    price: 750,
    fileUrl: "",
    fileName: "calculus-revision.pdf",
    fileKind: "pdf",
    fileSize: 1840000,
    pages: 32,
    previewUrl: "",
    previewPages: 0,
    published: true,
    purchases: 0,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "note-mechanics",
    title: "Mechanics Formula Sheet & Drills",
    description:
      "Every formula you need for mechanics plus 40 graded practice problems with answers.",
    subject: "Physics",
    grade: "A/L",
    price: 500,
    fileUrl: "",
    fileName: "mechanics-drills.pdf",
    fileKind: "pdf",
    fileSize: 980000,
    pages: 18,
    previewUrl: "",
    previewPages: 0,
    published: true,
    purchases: 0,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
];
