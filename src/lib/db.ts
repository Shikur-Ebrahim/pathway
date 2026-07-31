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
