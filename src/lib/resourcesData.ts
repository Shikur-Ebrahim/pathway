export const RESOURCES_DATA: Record<string, {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  heroImage: string;
  gradient: string;
  content: {
    introduction: string;
    sections: { heading: string; body: string; bulletPoints?: string[] }[];
    conclusion: string;
  };
  author: {
    name: string;
    role: string;
    avatar: string;
  }
}> = {
  "resume-tips": {
    slug: "resume-tips",
    title: "How to Craft a CV That Gets You Hired",
    subtitle: "Stand out to top NGOs, Embassies, and International Companies in Ethiopia.",
    category: "Career Advice",
    readTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    gradient: "from-orange-500 to-red-700",
    content: {
      introduction: "In Ethiopia's highly competitive job market, especially for premium roles at Embassies, UN agencies, and multinational corporations, your Curriculum Vitae (CV) is your first—and sometimes only—chance to make an impression. A standard, generic CV simply won't cut it anymore.",
      sections: [
        {
          heading: "1. Keep It Professional and Concise",
          body: "International employers prefer CVs that are clean, easy to read, and strictly professional. Aim for a maximum of 2 pages unless you have over 10 years of highly relevant senior experience. Avoid overly colorful templates or unnecessary graphics that distract from your actual qualifications."
        },
        {
          heading: "2. Tailor Your CV for Every Application",
          body: "Never send the exact same CV to an Embassy and an Aviation company. Read the job description carefully and ensure the keywords used by the employer are reflected in your profile summary and experience sections.",
          bulletPoints: [
            "Use the exact job title in your summary.",
            "Highlight skills specifically requested in the job advert.",
            "Remove irrelevant experiences that waste space."
          ]
        },
        {
          heading: "3. Focus on Achievements, Not Just Duties",
          body: "Instead of saying 'I managed social media accounts', say 'Increased social media engagement by 45% over 6 months by implementing a new content strategy.' Use numbers, percentages, and tangible results.",
          bulletPoints: [
            "Use strong action verbs (Spearheaded, Developed, Increased).",
            "Quantify your results whenever possible.",
            "Highlight awards or special recognitions."
          ]
        }
      ],
      conclusion: "Remember, your CV is a marketing document, and the product is YOU. Take the time to polish it, check for spelling and grammar errors (especially for international organizations), and make every single word count."
    },
    author: {
      name: "Helen Tadesse",
      role: "Senior HR Consultant",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
    }
  },
  "interview-prep": {
    slug: "interview-prep",
    title: "Acing Your Next Embassy or NGO Interview",
    subtitle: "The ultimate guide to passing rigorous international interviews.",
    category: "Interview Guide",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-600 to-indigo-800",
    content: {
      introduction: "Interviewing for an Embassy, a UN agency, or a top international company in Addis Ababa is notoriously challenging. These organizations use structured, competency-based interviews to ensure they hire the absolute best talent. Here is how you can prepare and succeed.",
      sections: [
        {
          heading: "1. Master the STAR Method",
          body: "International organizations almost exclusively use behavioral questions (e.g., 'Tell me about a time when...'). You must answer using the STAR method to keep your response structured and impactful.",
          bulletPoints: [
            "Situation: Set the scene and provide context.",
            "Task: Describe what your specific responsibility was.",
            "Action: Explain exactly what YOU did (not 'we').",
            "Result: Share the successful outcome, preferably with numbers."
          ]
        },
        {
          heading: "2. Research the Organization Deeply",
          body: "Knowing the name of the organization is not enough. If interviewing at an Embassy, know their current ambassador and key diplomatic initiatives in Ethiopia. If interviewing at an NGO, read their latest annual report and know their core thematic areas."
        },
        {
          heading: "3. Professionalism and Cultural Awareness",
          body: "Multinational companies and diplomatic missions are melting pots of different cultures. Demonstrate that you are adaptable, respectful of diversity, and possess excellent cross-cultural communication skills.",
          bulletPoints: [
            "Dress strictly in professional business attire.",
            "Maintain good posture and confident eye contact.",
            "Speak clearly and at a moderate pace, especially if interviewing in a second language."
          ]
        }
      ],
      conclusion: "An interview is a two-way street. Always prepare 2 or 3 insightful questions to ask the panel at the end of the interview. This shows genuine interest in the role and the organization."
    },
    author: {
      name: "Dr. Samuel Bekele",
      role: "Diplomatic Recruitment Specialist",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"
    }
  },
  "scholarships": {
    slug: "scholarships",
    title: "Finding and Winning International Scholarships",
    subtitle: "Opportunities for Ethiopians to study and work abroad.",
    category: "Global Opportunities",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    gradient: "from-emerald-500 to-teal-700",
    content: {
      introduction: "Pursuing higher education abroad is a dream for many Ethiopian professionals. A prestigious international degree can fast-track your career in NGOs, Embassies, and global corporations. Fortunately, there are dozens of fully-funded scholarships specifically targeting talented Ethiopians.",
      sections: [
        {
          heading: "1. Top Scholarships for Ethiopians",
          body: "Several government-backed programs offer fully-funded master's and PhD opportunities for Ethiopian citizens.",
          bulletPoints: [
            "Chevening Scholarships (UK): For future leaders and influencers.",
            "Erasmus Mundus (Europe): Joint master's degrees across multiple European countries.",
            "Fulbright Program (USA): Prestigious academic exchange program.",
            "DAAD Scholarships (Germany): Excellent for engineering and development studies."
          ]
        },
        {
          heading: "2. The Application Process",
          body: "Winning a scholarship takes months of preparation. You cannot rush it. Most deadlines are between September and December for the following academic year.",
          bulletPoints: [
            "Prepare your English proficiency tests (IELTS/TOEFL) early.",
            "Secure strong recommendation letters from professors or senior managers.",
            "Write a compelling personal statement that connects your past experience with Ethiopia's future development."
          ]
        },
        {
          heading: "3. Leveraging Your Scholarship for Jobs",
          body: "An international degree makes you highly attractive to employers in Ethiopia. Many Pathway users who return from their studies abroad are immediately recruited into senior management roles at UN agencies and international corporations."
        }
      ],
      conclusion: "Don't let the rigorous application process discourage you. Apply to multiple programs, refine your essays, and remember that persistence is the key to winning a fully-funded international scholarship."
    },
    author: {
      name: "Abel Yonas",
      role: "Education & Career Advisor",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80"
    }
  }
};
