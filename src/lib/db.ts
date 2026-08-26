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
    question: "You discover your direct manager is manipulating financial reports to hide a critical multi-million dollar budget deficit before an acquisition. What is your immediate course of action?",
    options: [
      "Confront your manager privately and threaten to expose them if they don't fix it.",
      "Immediately report the discrepancy anonymously to the regulatory compliance board.",
      "Document the evidence securely and escalate it to the Chief Compliance Officer or Board of Directors.",
      "Ignore it, as it is above your pay grade and exposing it could cost you your job."
    ],
    correctIndex: 2
  },
  {
    question: "During a high-stakes negotiation with a foreign client, the client makes a culturally insensitive and highly offensive remark to a junior member of your team. How do you respond?",
    options: [
      "Immediately terminate the negotiation and walk out to protect your team member.",
      "Laugh it off to save the deal, then apologize to your team member privately later.",
      "Calmly and professionally pause the meeting to address the boundary violation without escalating into a fight.",
      "Yell at the client for their ignorance and demand an immediate apology."
    ],
    correctIndex: 2
  },
  {
    question: "You are managing a remote international team spanning 4 continents. Two key engineers from different cultures are actively sabotaging each other's code due to a severe personal conflict, endangering a major release. What do you do?",
    options: [
      "Fire both of them immediately to set an example for the rest of the team.",
      "Halt their repository access, mandate an immediate mediated emergency resolution meeting, and restructure their dependencies.",
      "Let them work it out themselves; engineers need to learn how to resolve their own conflicts.",
      "Take over their code yourself and work 100 hours a week to ensure the release goes out on time."
    ],
    correctIndex: 1
  },
  {
    question: "Your company's flagship software just deployed a critical bug that caused a major hospital's life-support monitoring system to crash for 5 minutes. The press is calling. What is the very first thing you do?",
    options: [
      "Draft a public relations statement denying the company's involvement until lawyers review it.",
      "Initiate immediate emergency rollback procedures while simultaneously opening a direct crisis channel with the hospital.",
      "Resign immediately to avoid being personally sued for the incident.",
      "Blame the junior developer who deployed the code to deflect attention from the company."
    ],
    correctIndex: 1
  },
  {
    question: "You are the project lead. The CEO demands you launch an AI product next week that you know has a severe algorithmic bias that discriminates against minorities. If you refuse, you will be fired. What do you do?",
    options: [
      "Launch the product; the CEO takes ultimate responsibility, not you.",
      "Leak the algorithmic bias data to the press anonymously to force the CEO's hand.",
      "Refuse to launch on ethical grounds, presenting undeniable data on the legal and reputational risks to the CEO.",
      "Quietly delete the biased code, breaking the product temporarily to delay the launch."
    ],
    correctIndex: 2
  },
  {
    question: "You accidentally email a highly confidential spreadsheet containing the unencrypted salaries, social security numbers, and banking details of all 10,000 employees to a third-party vendor. What is your next move?",
    options: [
      "Ask the vendor to delete the email and hope no one ever finds out.",
      "Immediately notify the Information Security Officer and Legal team to initiate a critical data breach protocol.",
      "Delete the email from your outbox and pretend you were hacked.",
      "Send a follow-up email saying 'Please ignore the previous email' and leave it at that."
    ],
    correctIndex: 1
  },
  {
    question: "A massive geopolitical event just caused your supply chain to collapse. Your company will go bankrupt in 30 days if you don't secure raw materials, but the only available supplier uses forced child labor. What is the decision?",
    options: [
      "Use the supplier temporarily just to survive, then switch back when the crisis is over.",
      "Declare bankruptcy and shut the company down immediately without trying any alternatives.",
      "Reject the unethical supplier and urgently pivot the company's operations, even if it means massive layoffs to survive.",
      "Hide the supplier's identity through shell companies to protect the brand's image."
    ],
    correctIndex: 2
  },
  {
    question: "You have been promoted over a peer who is twice your age and has been at the company 10 years longer. They are now actively organizing a team mutiny against your leadership. How do you handle this?",
    options: [
      "Use your new authority to terminate their employment immediately for insubordination.",
      "Confront them in a private, direct meeting to address the friction, validate their expertise, and establish clear operational boundaries.",
      "Complain to the CEO that your team is unmanageable.",
      "Ignore the mutiny and do all the work yourself to prove you are the better employee."
    ],
    correctIndex: 1
  },
  {
    question: "Your primary client is demanding a feature that violates the GDPR (General Data Protection Regulation), and they threaten to pull their $50M contract if you don't build it. What is your response?",
    options: [
      "Build the feature, but hide the non-compliant code deeply in the backend.",
      "Refuse to build it and immediately terminate the $50M contract without discussion.",
      "Provide a legal and technical consultation showing how they can achieve their business goal while remaining strictly GDPR compliant.",
      "Build it, but make the client sign a waiver saying they take all legal responsibility."
    ],
    correctIndex: 2
  },
  {
    question: "A senior executive has been routinely harassing junior staff, but they bring in 80% of the company's revenue. The board is looking the other way. You are the HR Director. What do you do?",
    options: [
      "Look the other way too; the company needs the revenue to survive.",
      "Document all testimonies meticulously and present an ultimatum to the board with external legal counsel involved.",
      "Confront the executive physically to intimidate them into stopping.",
      "Tell the junior staff to just avoid the executive as much as possible."
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
    const { updateDoc: upd, doc: getD } = await import("firebase/firestore");
    await upd(getD(db, "interviews", id), { resultSent: true });
  } else {
    const existing: InterviewSession[] = JSON.parse(localStorage.getItem(INTERVIEW_STORAGE_KEY) || "[]");
    const idx = existing.findIndex(i => i.id === id);
    if (idx !== -1) {
      existing[idx].resultSent = true;
      localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(existing));
    }
  }
}

export async function updateInterviewResult(id: string, score: number, passed: boolean): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    const { updateDoc, doc } = await import("firebase/firestore");
    await updateDoc(doc(db, "interviews", id), { score, passed });
  } else {
    const existing: InterviewSession[] = JSON.parse(localStorage.getItem(INTERVIEW_STORAGE_KEY) || "[]");
    localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(existing.map(i => i.id === id ? { ...i, score, passed } : i)));
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

// ─── Save / Load Default Questions from Firestore ────────────────────────────
export async function saveDefaultQuestionsToFirestore(): Promise<void> {
  if (isFirebaseConfigured && db?.app) {
    const { setDoc, doc } = await import("firebase/firestore");
    await setDoc(doc(db, "settings", "interviewQuestions"), {
      questions: DEFAULT_QUESTIONS,
      savedAt: new Date().toISOString(),
    });
  } else {
    localStorage.setItem("pathway_default_questions", JSON.stringify(DEFAULT_QUESTIONS));
  }
}

export async function getDefaultQuestionsFromFirestore(): Promise<InterviewQuestion[]> {
  if (isFirebaseConfigured && db?.app) {
    const { getDoc, doc } = await import("firebase/firestore");
    const snap = await getDoc(doc(db, "settings", "interviewQuestions"));
    if (snap.exists()) {
      return (snap.data().questions as InterviewQuestion[]) || DEFAULT_QUESTIONS;
    }
  } else {
    const local = localStorage.getItem("pathway_default_questions");
    if (local) return JSON.parse(local);
  }
  return DEFAULT_QUESTIONS;
}
