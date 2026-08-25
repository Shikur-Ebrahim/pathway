import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

export interface PathwayItem {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  authorName: string;
  authorEmail: string;
  createdAt: any;
  formData?: any;
  applicationStatus?: string;
  isViewed?: boolean;
}

const DEMO_ITEMS_STORAGE_KEY = "pathway_demo_items";

const INITIAL_MOCK_ITEMS: PathwayItem[] = [
  {
    id: "demo-1",
    title: "Mountain Horizon Trail",
    description: "Captured during high altitude sunrise. Stored in Cloudinary with metadata indexed in Firestore.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    authorName: "Sarah Jenkins",
    authorEmail: "sarah@pathway.dev",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Urban Architecture Reflection",
    description: "Sleek modern structures optimized using Next.js Image and Cloudinary transformations.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    authorName: "Alex Rivera",
    authorEmail: "alex@pathway.dev",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Nebula Cosmos Vista",
    description: "High resolution deep space composite showcasing fast global CDN delivery.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    authorName: "Elena Rostova",
    authorEmail: "elena@pathway.dev",
    createdAt: new Date().toISOString(),
  },
];

export async function addPathwayPost(post: Omit<PathwayItem, "id" | "createdAt">): Promise<string> {
  if (isFirebaseConfigured && db?.app) {
    const docRef = await addDoc(collection(db, "posts"), {
      ...post,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } else {
    // Local demo storage
    const existingStr = localStorage.getItem(DEMO_ITEMS_STORAGE_KEY);
    const existing: PathwayItem[] = existingStr ? JSON.parse(existingStr) : INITIAL_MOCK_ITEMS;
    
    const newPost: PathwayItem = {
      ...post,
      id: "demo_" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    
    const updated = [newPost, ...existing];
    localStorage.setItem(DEMO_ITEMS_STORAGE_KEY, JSON.stringify(updated));
    return newPost.id!;
  }
}

export async function getPathwayPosts(): Promise<PathwayItem[]> {
  if (isFirebaseConfigured && db?.app) {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PathwayItem[];
    } catch (e) {
      console.warn("Error fetching Firestore posts:", e);
      return INITIAL_MOCK_ITEMS;
    }
  } else {
    if (typeof window === "undefined") return INITIAL_MOCK_ITEMS;
    const existingStr = localStorage.getItem(DEMO_ITEMS_STORAGE_KEY);
    if (!existingStr) {
      localStorage.setItem(DEMO_ITEMS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ITEMS));
      return INITIAL_MOCK_ITEMS;
    }
    try {
      return JSON.parse(existingStr);
    } catch {
      return INITIAL_MOCK_ITEMS;
    }
  }
}

export async function deletePathwayPost(id: string): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    await import("firebase/firestore").then(({ deleteDoc }) => {
      return deleteDoc(doc(db, "posts", id));
    });
  } else {
    const existingStr = localStorage.getItem(DEMO_ITEMS_STORAGE_KEY);
    if (existingStr) {
      let items: PathwayItem[] = JSON.parse(existingStr);
      items = items.filter(i => i.id !== id);
      localStorage.setItem(DEMO_ITEMS_STORAGE_KEY, JSON.stringify(items));
    }
  }
}

export async function updatePathwayPostStatus(id: string, status: 'accepted' | 'rejected' | 'interview'): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "posts", id), { applicationStatus: status });
  } else {
    const existingStr = localStorage.getItem(DEMO_ITEMS_STORAGE_KEY);
    if (existingStr) {
      const items: PathwayItem[] = JSON.parse(existingStr);
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items[index].applicationStatus = status;
        localStorage.setItem(DEMO_ITEMS_STORAGE_KEY, JSON.stringify(items));
      }
    }
  }
}

export async function updatePathwayPostFormData(id: string, formData: any): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "posts", id), { formData });
  } else {
    const existingStr = localStorage.getItem(DEMO_ITEMS_STORAGE_KEY);
    if (existingStr) {
      const items: PathwayItem[] = JSON.parse(existingStr);
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items[index].formData = formData;
        localStorage.setItem(DEMO_ITEMS_STORAGE_KEY, JSON.stringify(items));
      }
    }
  }
}

export async function markApplicationAsViewed(id: string): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "posts", id), { isViewed: true });
  } else {
    const existingStr = localStorage.getItem(DEMO_ITEMS_STORAGE_KEY);
    if (existingStr) {
      const items: PathwayItem[] = JSON.parse(existingStr);
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items[index].isViewed = true;
        localStorage.setItem(DEMO_ITEMS_STORAGE_KEY, JSON.stringify(items));
      }
    }
  }
}

// Returns the existing application if the phone or email already applied
export async function checkExistingApplication(email: string, phone: string): Promise<PathwayItem | null> {
  const posts = await getPathwayPosts();
  const apps = posts.filter(p => p.title?.startsWith('[App]'));
  const normPhone = phone.replace(/\s+/g, '').replace(/^\+251/, '');
  const found = apps.find(a => {
    const aEmail = (a.formData?.personal?.email || a.authorEmail || '').toLowerCase();
    const aPhone = (a.formData?.personal?.phone || '').replace(/\s+/g, '').replace(/^\+251/, '');
    return aEmail === email.toLowerCase() || (normPhone.length >= 9 && aPhone === normPhone);
  });
  return found || null;
}

export interface PaymentConfig {
  cbe: { active: boolean; holderName: string; account: string; };
  telebirr: { active: boolean; holderName: string; account: string; };
  boa: { active: boolean; holderName: string; account: string; };
  awash: { active: boolean; holderName: string; account: string; };
  feeAmount: number;
}

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  cbe: { active: true, holderName: "Pathway Agency", account: "1000123456789" },
  telebirr: { active: true, holderName: "Pathway Agency", account: "0911234567" },
  boa: { active: false, holderName: "", account: "" },
  awash: { active: false, holderName: "", account: "" },
  feeAmount: 500,
};

export async function getPaymentSettings(): Promise<PaymentConfig> {
  if (isFirebaseConfigured && db?.app) {
    const docSnap = await getDoc(doc(db, "settings", "payments"));
    if (docSnap.exists()) {
      return docSnap.data() as PaymentConfig;
    }
    return DEFAULT_PAYMENT_CONFIG;
  }
  const local = localStorage.getItem("pathway_payment_settings");
  return local ? JSON.parse(local) : DEFAULT_PAYMENT_CONFIG;
}

export async function savePaymentSettings(config: PaymentConfig): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    await setDoc(doc(db, "settings", "payments"), config);
  } else {
    localStorage.setItem("pathway_payment_settings", JSON.stringify(config));
  }
}

// ─── Interview System ─────────────────────────────────────────────────────────

export interface InterviewQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface InterviewSession {
  id?: string;
  applicantEmail: string;
  applicantName: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed';
  questions: InterviewQuestion[];
  answers?: number[];
  score?: number;
  passed?: boolean;
  resultSent?: boolean;
  createdAt?: any;
}

// ─── Default Interview Questions (10 MCQ) ────────────────────────────────────
export const DEFAULT_QUESTIONS: InterviewQuestion[] = [
  {
    question: "How do you prioritize tasks when you have multiple deadlines at the same time?",
    options: [
      "Work on all tasks simultaneously without a plan",
      "Identify the most urgent and important tasks first, then work systematically",
      "Ask colleagues to handle some tasks for you",
      "Work on the easiest task first to gain momentum"
    ],
    correctIndex: 1
  },
  {
    question: "How do you handle a conflict with a coworker?",
    options: [
      "Avoid them completely and hope it resolves itself",
      "Report them to the manager immediately without discussion",
      "Discuss the issue calmly and professionally to find a resolution",
      "Ignore the problem entirely"
    ],
    correctIndex: 2
  },
  {
    question: "What does professional confidentiality require of an employee?",
    options: [
      "Sharing company information freely with friends",
      "Keeping sensitive information private and secure at all times",
      "Discussing client details with other clients",
      "Posting work updates on social media"
    ],
    correctIndex: 1
  },
  {
    question: "When you make a mistake at work, what is the best course of action?",
    options: [
      "Hide it and hope no one notices",
      "Blame a colleague for the mistake",
      "Acknowledge it, inform your supervisor, and propose a solution",
      "Quit the job to avoid consequences"
    ],
    correctIndex: 2
  },
  {
    question: "Which quality is most important for effective teamwork?",
    options: [
      "Being the best individual performer on the team",
      "Open communication and active collaboration",
      "Taking all the credit for group accomplishments",
      "Working independently at all times"
    ],
    correctIndex: 1
  },
  {
    question: "How should you respond when receiving constructive criticism from your supervisor?",
    options: [
      "Argue back immediately to defend yourself",
      "Listen calmly, ask clarifying questions if needed, and work to improve",
      "Ignore the feedback and continue as before",
      "Complain to other colleagues about the supervisor"
    ],
    correctIndex: 1
  },
  {
    question: "What best defines professional integrity in the workplace?",
    options: [
      "Always agreeing with your manager regardless of the situation",
      "Being honest and ethical even when it is difficult or inconvenient",
      "Prioritizing personal gain over company values",
      "Following only the rules you personally agree with"
    ],
    correctIndex: 1
  },
  {
    question: "If you are unsure how to complete an important task, what should you do?",
    options: [
      "Guess and submit the work anyway",
      "Do nothing and wait for someone to notice",
      "Ask your supervisor or a knowledgeable colleague for guidance",
      "Search for a different job instead"
    ],
    correctIndex: 2
  },
  {
    question: "Which of the following best describes a strong work ethic?",
    options: [
      "Coming to work only when you feel motivated",
      "Completing tasks quickly without attention to quality",
      "Being punctual, responsible, and consistently dedicated to your work",
      "Doing the minimum required and nothing more"
    ],
    correctIndex: 2
  },
  {
    question: "How should you handle a situation where you disagree with a company policy?",
    options: [
      "Ignore it and do what you personally think is right",
      "Discuss your concerns respectfully through proper channels",
      "Publicly criticize the company on social media",
      "Refuse to follow the policy outright"
    ],
    correctIndex: 1
  }
];

const INTERVIEW_STORAGE_KEY = "pathway_interviews";

export async function createInterview(data: Omit<InterviewSession, 'id' | 'createdAt'>): Promise<string> {
  // Always attach the default 10 questions if none were provided
  const questions = (data.questions && data.questions.length > 0) ? data.questions : DEFAULT_QUESTIONS;
  const payload = { ...data, questions };

  if (isFirebaseConfigured && db?.app) {
    const { addDoc: add, serverTimestamp: ts } = await import("firebase/firestore");
    const ref = await add(collection(db, "interviews"), { ...payload, createdAt: ts() });
    return ref.id;
  }
  const existing = JSON.parse(localStorage.getItem(INTERVIEW_STORAGE_KEY) || "[]");
  const newItem = { ...payload, id: Date.now().toString(), createdAt: new Date().toISOString() };
  localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify([...existing, newItem]));
  return newItem.id;
}

export async function getInterviews(): Promise<InterviewSession[]> {
  if (isFirebaseConfigured && db?.app) {
    const { getDocs: gd, collection: col, orderBy: ob, query: q } = await import("firebase/firestore");
    const snap = await gd(q(col(db, "interviews"), ob("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as InterviewSession));
  }
  return JSON.parse(localStorage.getItem(INTERVIEW_STORAGE_KEY) || "[]").reverse();
}

export async function getInterviewByEmail(email: string): Promise<InterviewSession | null> {
  const all = await getInterviews();
  return all.find(i => i.applicantEmail.toLowerCase() === email.toLowerCase()) || null;
}

export async function submitInterviewAnswers(
  id: string,
  answers: number[],
  score: number,
  passed: boolean
): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    const { updateDoc: upd } = await import("firebase/firestore");
    await upd(doc(db, "interviews", id), { answers, score, passed, status: 'completed' });
  } else {
    const existing: InterviewSession[] = JSON.parse(localStorage.getItem(INTERVIEW_STORAGE_KEY) || "[]");
    const idx = existing.findIndex(i => i.id === id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], answers, score, passed, status: 'completed' };
      localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(existing));
    }
  }
}

export async function markInterviewResultSent(id: string): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    const { updateDoc: upd } = await import("firebase/firestore");
    await upd(doc(db, "interviews", id), { resultSent: true });
  } else {
    const existing: InterviewSession[] = JSON.parse(localStorage.getItem(INTERVIEW_STORAGE_KEY) || "[]");
    const idx = existing.findIndex(i => i.id === id);
    if (idx !== -1) {
      existing[idx].resultSent = true;
      localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(existing));
    }
  }
}

export async function deleteInterview(id: string): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(db, "interviews", id));
  } else {
    const existing: InterviewSession[] = JSON.parse(localStorage.getItem(INTERVIEW_STORAGE_KEY) || "[]");
    localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(existing.filter(i => i.id !== id)));
  }
}

