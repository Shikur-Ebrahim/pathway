import { Metadata } from "next";

export const CATEGORY_DATA: Record<string, {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  heroImage: string;
  gradient: string;
  description: string;
  whyJoin: string[];
  roles: string[];
  requirements: string[];
  companies: string[];
  images: string[];
}> = {
  embassy: {
    slug: "embassy",
    title: "Embassies & Diplomatic Missions",
    subtitle: "Work at the heart of international diplomacy in Addis Ababa",
    emoji: "🏛️",
    heroImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-600 to-indigo-700",
    description: "Addis Ababa is the diplomatic capital of Africa, home to over 100 embassies, consulates, and diplomatic missions. Working at an embassy means being at the center of international relations, cultural exchange, and global cooperation. These roles offer competitive salaries, professional development, and the prestige of working in a world-class environment.",
    whyJoin: [
      "Internationally competitive salaries and benefits",
      "Work with professionals from around the world",
      "Career growth in diplomacy and international affairs",
      "Stable employment with long-term security",
      "Access to international training and development programs",
      "Prestigious work environment and professional network"
    ],
    roles: [
      "Visa Processing Clerk", "Consular Assistant", "Interpreter / Translator",
      "Administrative Assistant", "Protocol Officer", "Security Supervisor",
      "Cultural Affairs Assistant", "Public Affairs Officer", "IT Support Officer",
      "Finance Assistant", "Procurement Officer", "Driver", "Receptionist"
    ],
    requirements: [
      "Bachelor's degree in relevant field",
      "Excellent English communication skills",
      "Clean background and security clearance",
      "Professional demeanor and appearance",
      "Experience in administration or related fields (for senior roles)"
    ],
    companies: [
      "US Embassy Addis Ababa", "British Embassy Addis Ababa",
      "Canadian Embassy Addis Ababa", "German Embassy Addis Ababa",
      "French Embassy Addis Ababa", "Norwegian Embassy Addis Ababa",
      "Swedish Embassy Addis Ababa", "EU Delegation Ethiopia",
      "Japanese Embassy Addis Ababa", "Australian Embassy Addis Ababa"
    ],
    images: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1573497491208-6f16bfc752e0?auto=format&fit=crop&w=600&q=80",
    ]
  },
  ngo: {
    slug: "ngo",
    title: "NGOs & UN Agencies",
    subtitle: "Create meaningful impact with the world's top humanitarian organizations",
    emoji: "🌍",
    heroImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    gradient: "from-emerald-600 to-teal-700",
    description: "Ethiopia hosts the African Union headquarters and the UN Economic Commission for Africa (UNECA), making Addis Ababa one of the most important hubs for international development. NGOs and UN agencies offer rewarding careers where your work directly impacts communities across Ethiopia and the continent. From health and education to food security and disaster response, these organizations lead the world's most important humanitarian work.",
    whyJoin: [
      "Make a real, measurable difference in people's lives",
      "Work on global-scale programs and initiatives",
      "International exposure and networking opportunities",
      "USD-denominated salaries for senior positions",
      "Comprehensive benefits including health and pension",
      "Career pathways to international assignments"
    ],
    roles: [
      "Project Officer", "M&E Specialist", "Field Coordinator",
      "Grant Manager", "Health Officer", "WASH Specialist",
      "Child Protection Officer", "Nutrition Officer", "Logistics Manager",
      "Finance Officer", "HR Specialist", "Communications Officer",
      "Program Manager", "Country Director"
    ],
    requirements: [
      "Bachelor's or Master's degree in relevant field",
      "Experience in development sector (entry-level positions available)",
      "Strong report writing and analytical skills",
      "Willingness to travel to field locations",
      "Fluency in English; Amharic is an advantage"
    ],
    companies: [
      "UNICEF Ethiopia", "UNDP Ethiopia", "WHO Ethiopia",
      "WFP Ethiopia", "UNHCR Ethiopia", "Save the Children Ethiopia",
      "World Vision Ethiopia", "CARE Ethiopia", "Oxfam Ethiopia",
      "ICRC Red Cross", "Mercy Corps Ethiopia", "MSF Doctors Without Borders"
    ],
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80",
    ]
  },
  aviation: {
    slug: "aviation",
    title: "Aviation & Airlines",
    subtitle: "Soar to new heights with Ethiopia's world-class aviation industry",
    emoji: "✈️",
    heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    gradient: "from-sky-500 to-blue-700",
    description: "Ethiopian Airlines is Africa's largest and most profitable airline, serving over 125 destinations worldwide. Bole International Airport is Africa's busiest aviation hub, hosting dozens of international carriers and thousands of aviation professionals. A career in aviation offers excitement, travel opportunities, and one of the most dynamic work environments in the world. From ground handling and customer service to engineering and flight operations, there is a path for everyone.",
    whyJoin: [
      "Free or heavily discounted international flight tickets",
      "Glamorous, dynamic, and exciting work environment",
      "Opportunity to travel the world",
      "Career advancement in a fast-growing sector",
      "World-class training programs at Ethiopian Aviation Academy",
      "Premium salary packages and benefits"
    ],
    roles: [
      "Customer Service Agent", "Flight Attendant / Cabin Crew",
      "Ground Handling Agent", "Cargo Specialist", "Ticketing Agent",
      "Aviation Mechanic", "Aircraft Dispatcher", "Ramp Agent",
      "Lounge Host", "Airport Security Agent", "Baggage Handler",
      "Check-in Agent", "Reservations Agent"
    ],
    requirements: [
      "Minimum secondary education (Grade 12) for entry-level roles",
      "Bachelor's degree for technical and management positions",
      "Height requirements for flight attendant roles",
      "Excellent communication and customer service skills",
      "Ability to work flexible shifts including weekends"
    ],
    companies: [
      "Ethiopian Airlines", "Ethiopian Airports Enterprise",
      "Bole International Airport", "DHL Aviation Ethiopia",
      "FedEx Ethiopia", "Emirates Addis Office",
      "Qatar Airways Addis Office", "Turkish Airlines Addis Office",
      "Kenya Airways Addis Office", "Lufthansa Addis Office"
    ],
    images: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583977374086-3f1a9e16dc57?auto=format&fit=crop&w=600&q=80",
    ]
  },
  international: {
    slug: "international",
    title: "International Companies",
    subtitle: "Build a global career with top multinational companies in Ethiopia",
    emoji: "🌐",
    heroImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    gradient: "from-purple-600 to-violet-700",
    description: "As Ethiopia's economy continues to grow, major multinational corporations are establishing and expanding their presence in Addis Ababa. From luxury hotel chains like Hilton, Sheraton, and Radisson Blu, to global breweries like Heineken and Diageo, and tech companies like Safaricom — international employers offer world-class working conditions, competitive packages, and the opportunity to grow into regional and global roles.",
    whyJoin: [
      "Work to international standards and best practices",
      "Exposure to global business operations and strategy",
      "Excellent compensation and benefits packages",
      "Access to international training programs",
      "Opportunity to grow into regional roles across Africa",
      "Modern, premium office environments in Addis Ababa"
    ],
    roles: [
      "Operations Manager", "Business Development Officer",
      "Country Representative", "Regional Sales Manager",
      "Finance Manager", "HR Manager", "Marketing Manager",
      "IT Manager", "Procurement Manager", "Supply Chain Officer",
      "General Manager", "Administrative Manager",
      "Customer Relations Officer", "Brand Ambassador"
    ],
    requirements: [
      "Bachelor's or Master's degree in business or related field",
      "2-10 years of relevant industry experience",
      "Strong English communication and presentation skills",
      "Demonstrated leadership and management experience",
      "Experience in multinational environment is an advantage"
    ],
    companies: [
      "Safaricom Ethiopia", "Hilton Addis Ababa",
      "Sheraton Addis Ababa", "Radisson Blu Addis Ababa",
      "Hyatt Regency Addis Ababa", "Heineken Meta Brewery",
      "Coca-Cola Beverages Ethiopia", "BGI Ethiopia (St. George)",
      "Toyota Ethiopia", "TotalEnergies Ethiopia",
      "Unilever Ethiopia", "PwC Ethiopia"
    ],
    images: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    ]
  }
};
