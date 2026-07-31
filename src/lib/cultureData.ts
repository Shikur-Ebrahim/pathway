export const CULTURE_DATA: Record<string, {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  heroImage: string;
  gradient: string;
  description: string;
  highlights: { title: string; desc: string }[];
  quote: string;
  author: string;
  images: string[];
}> = {
  "office-environment": {
    slug: "office-environment",
    title: "World-Class Offices",
    subtitle: "Experience modern, comfortable, and inspiring workspaces.",
    icon: "🏢",
    heroImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-600 to-indigo-800",
    description: "The companies we partner with offer some of the most modern and comfortable working environments in Ethiopia. Located in prime areas of Addis Ababa, these offices are designed to boost productivity, creativity, and employee well-being.",
    highlights: [
      { title: "Ergonomic Workspaces", desc: "Standing desks, comfortable chairs, and well-lit spaces." },
      { title: "High-Speed Connectivity", desc: "Reliable, high-speed fiber internet for uninterrupted work." },
      { title: "Recreation Areas", desc: "Lounges, cafeterias, and break rooms to relax and recharge." },
      { title: "Central Locations", desc: "Easy access to transportation, restaurants, and city amenities." }
    ],
    quote: "A great office isn't just about desks and computers; it's about creating a space where people feel inspired to do their best work every single day.",
    author: "Pathway Facilities Team",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "teamwork": {
    slug: "teamwork",
    title: "Professional Teamwork",
    subtitle: "Collaborate with the brightest minds in your industry.",
    icon: "🤝",
    heroImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    gradient: "from-emerald-600 to-teal-800",
    description: "Success in the modern workplace is driven by collaboration. When you secure a job through Pathway, you'll be joining diverse, inclusive, and highly professional teams where your ideas are valued and your contributions matter.",
    highlights: [
      { title: "Diverse Teams", desc: "Work with professionals from various backgrounds and cultures." },
      { title: "Mentorship", desc: "Learn directly from experienced senior leaders in your field." },
      { title: "Agile Collaboration", desc: "Modern project management and collaborative workflows." },
      { title: "Inclusive Culture", desc: "A workplace where everyone's voice is heard and respected." }
    ],
    quote: "Alone we can do so little; together we can do so much. Our partnered companies prioritize team synergy above all else.",
    author: "Pathway HR Network",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "career-growth": {
    slug: "career-growth",
    title: "Career Growth",
    subtitle: "Accelerate your professional journey.",
    icon: "📈",
    heroImage: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80",
    gradient: "from-purple-600 to-violet-800",
    description: "A job is just the beginning. The organizations we feature are committed to employee development, offering clear pathways for promotion, continuous learning opportunities, and the chance to take on leadership roles.",
    highlights: [
      { title: "Training Programs", desc: "Access to internal and external workshops and certifications." },
      { title: "Clear Promotions", desc: "Transparent criteria for moving up the corporate ladder." },
      { title: "Global Opportunities", desc: "Chances for international assignments and travel." },
      { title: "Tuition Support", desc: "Financial assistance for continuing education." }
    ],
    quote: "We don't just offer jobs; we offer careers. We want to see you grow from an entry-level professional into an industry leader.",
    author: "Pathway Career Coaches",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "interviews": {
    slug: "interviews",
    title: "Interview Success",
    subtitle: "Master the art of the professional interview.",
    icon: "🎯",
    heroImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    gradient: "from-orange-500 to-red-700",
    description: "Nailing the interview is the most critical step in securing your dream job. Pathway not only connects you with top employers but also provides the resources and support you need to present your best self during interviews.",
    highlights: [
      { title: "Mock Interviews", desc: "Practice with experts before the real day." },
      { title: "CV Optimization", desc: "Ensure your resume stands out to recruiters." },
      { title: "Confidence Coaching", desc: "Learn techniques to manage nerves and speak clearly." },
      { title: "Employer Insights", desc: "Get insider tips on exactly what companies are looking for." }
    ],
    quote: "An interview isn't an interrogation; it's a conversation to discover mutual value. Be prepared, be confident, and be yourself.",
    author: "Pathway Recruitment Team",
    images: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
    ]
  }
};
