import re

with open('src/components/landing/LatestJobsSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace generateJobs signature
text = text.replace('const generateJobs = (lang: "en" | "am") => {', 'const generateJobs = (lang: "en" | "am" | "or") => {')

text = text.replace(
    '        am: ["የፕሮጀክት ኦፊሰር", "የክትትልና ግምገማ ባለሙያ", "የመስክ አስተባባሪ", "የግራንት ስራ አስኪያጅ", "ማህበራዊ ሰራተኛ", "የጤና ኦፊሰር", "የሎጂስቲክስ ረዳት", "የ WASH ስፔሻሊስት", "የህፃናት ጥበቃ ኦፊሰር", "የስነ ምግብ ኦፊሰር", "የፕሮግራም ስራ አስኪያጅ", "የፋይናንስ ኦፊሰር", "የሰው ሀይል ስፔሻሊስት", "የኮሙኒኬሽን ኦፊሰር", "አሽከርካሪ"]\n      },',
    '        am: ["የፕሮጀክት ኦፊሰር", "የክትትልና ግምገማ ባለሙያ", "የመስክ አስተባባሪ", "የግራንት ስራ አስኪያጅ", "ማህበራዊ ሰራተኛ", "የጤና ኦፊሰር", "የሎጂስቲክስ ረዳት", "የ WASH ስፔሻሊስት", "የህፃናት ጥበቃ ኦፊሰር", "የስነ ምግብ ኦፊሰር", "የፕሮግራም ስራ አስኪያጅ", "የፋይናንስ ኦፊሰር", "የሰው ሀይል ስፔሻሊስት", "የኮሙኒኬሽን ኦፊሰር", "አሽከርካሪ"],\n        or: ["Ogeessa Pirojektii", "Ogeessa Hordoffii", "Qindeessaa Dirree", "Hogganaa Grantii", "Hojjetaa Hawaasummaa", "Ogeessa Fayyaa", "Gargaaraa Loojistiksii", "Ogeessa WASH", "Ogeessa Eegumsa Daaimmanii", "Ogeessa Nyaataa", "Hogganaa Pirogrammaa", "Ogeessa Faayinaansii", "Ogeessa HR", "Ogeessa Kominikeeshinii", "Konkolaachisaa"]\n      },'
)

text = text.replace(
    '        am: ["ዩኒሴፍ ኢትዮጵያ", "ዩኤንዲፒ ኢትዮጵያ", "የዓለም ጤና ድርጅት", "የዓለም ምግብ ፕሮግራም", "UNHCR ኢትዮጵያ", "ILO ኢትዮጵያ", "ዩኔስኮ ኢትዮጵያ", "FAO ኢትዮጵያ", "UNECA", "ሴቭ ዘ ችልድረን", "ወርልድ ቪዥን ኢትዮጵያ", "ኬር ኢትዮጵያ", "ኦክስፋም ኢትዮጵያ", "ICRC ቀይ መስቀል", "መርሲ ኮርፕስ", "ፕላን ኢንተርናሽናል", "አክሽን አጌንስት ሀንገር", "IRC ኢትዮጵያ", "MSF ኢትዮጵያ", "ካቶሊክ ሪሊፍ ሰርቪስ"]\n      },',
    '        am: ["ዩኒሴፍ ኢትዮጵያ", "ዩኤንዲፒ ኢትዮጵያ", "የዓለም ጤና ድርጅት", "የዓለም ምግብ ፕሮግራም", "UNHCR ኢትዮጵያ", "ILO ኢትዮጵያ", "ዩኔስኮ ኢትዮጵያ", "FAO ኢትዮጵያ", "UNECA", "ሴቭ ዘ ችልድረን", "ወርልድ ቪዥን ኢትዮጵያ", "ኬር ኢትዮጵያ", "ኦክስፋም ኢትዮጵያ", "ICRC ቀይ መስቀል", "መርሲ ኮርፕስ", "ፕላን ኢንተርናሽናል", "አክሽን አጌንስት ሀንገር", "IRC ኢትዮጵያ", "MSF ኢትዮጵያ", "ካቶሊክ ሪሊፍ ሰርቪስ"],\n        or: ["UNICEF Itoophiyaa", "UNDP Itoophiyaa", "WHO Itoophiyaa", "WFP Itoophiyaa", "UNHCR Itoophiyaa", "ILO Itoophiyaa", "UNESCO Itoophiyaa", "FAO Itoophiyaa", "UNECA", "Save the Children", "World Vision", "CARE Itoophiyaa", "Oxfam Itoophiyaa", "ICRC Fannoo Diimaa", "Mercy Corps", "Plan International", "Action Against Hunger", "IRC Itoophiyaa", "MSF Doctors Without Borders", "Catholic Relief Services"]\n      },'
)

text = text.replace(
    '        am: ["አዲስ አበባ፣ ኢትዮጵያ"]\n      }\n    },',
    '        am: ["አዲስ አበባ፣ ኢትዮጵያ"],\n        or: ["Finfinnee, Itoophiyaa"]\n      }\n    },'
)

text = text.replace(
    '        am: ["የቪዛ ማስኬጃ ጸሐፊ", "የቆንስላ ረዳት", "አስተርጓሚ", "አስተዳደራዊ ረዳት", "የፕሮቶኮል ኦፊሰር", "የጥበቃ ተቆጣጣሪ", "የባህል ጉዳዮች ረዳት", "የህዝብ ግንኙነት ኦፊሰር", "የፖለቲካ ተንታኝ", "የግዢ ኦፊሰር", "የ IT ኦፊሰር", "አሽከርካሪ", "እንግዳ ተቀባይ", "የፋሲሊቲ ስራ አስኪያጅ", "የፋይናንስ ረዳት"]\n      },',
    '        am: ["የቪዛ ማስኬጃ ጸሐፊ", "የቆንስላ ረዳት", "አስተርጓሚ", "አስተዳደራዊ ረዳት", "የፕሮቶኮል ኦፊሰር", "የጥበቃ ተቆጣጣሪ", "የባህል ጉዳዮች ረዳት", "የህዝብ ግንኙነት ኦፊሰር", "የፖለቲካ ተንታኝ", "የግዢ ኦፊሰር", "የ IT ኦፊሰር", "አሽከርካሪ", "እንግዳ ተቀባይ", "የፋሲሊቲ ስራ አስኪያጅ", "የፋይናንስ ረዳት"],\n        or: ["Barreessaa Viizaa", "Gargaaraa Consular", "Turjumaana", "Gargaaraa Bulchiinsaa", "Ogeessa Pirotokoolii", "Too\'ataa Nageenyaa", "Gargaaraa Dhimmoota Aadaa", "Ogeessa Dhimmoota Ummataa", "Xiinxalaa Siyaasaa", "Ogeessa Bittaa", "Ogeessa IT", "Konkolaachisaa", "Keessummeessaa", "Hogganaa Qabeenyaa", "Gargaaraa Faayinaansii"]\n      },'
)

text = text.replace(
    '        am: ["የአሜሪካ ኤምባሲ", "የእንግሊዝ ኤምባሲ", "የካናዳ ኤምባሲ", "የጀርመን ኤምባሲ", "የፈረንሳይ ኤምባሲ", "የጣሊያን ኤምባሲ", "የኖርዌይ ኤምባሲ", "የስዊድን ኤምባሲ", "የዴንማርክ ኤምባሲ", "የኔዘርላንድ ኤምባሲ", "የስዊስ ኤምባሲ", "የጃፓን ኤምባሲ", "የቻይና ኤምባሲ", "የደቡብ ኮሪያ ኤምባሲ", "የቱርክ ኤምባሲ", "የህንድ ኤምባሲ", "የአውስትራሊያ ኤምባሲ", "የአውሮፓ ህብረት ልዑክ", "የቤልጂየም ኤምባሲ", "የፊንላንድ ኤምባሲ"]\n      },',
    '        am: ["የአሜሪካ ኤምባሲ", "የእንግሊዝ ኤምባሲ", "የካናዳ ኤምባሲ", "የጀርመን ኤምባሲ", "የፈረንሳይ ኤምባሲ", "የጣሊያን ኤምባሲ", "የኖርዌይ ኤምባሲ", "የስዊድን ኤምባሲ", "የዴንማርክ ኤምባሲ", "የኔዘርላንድ ኤምባሲ", "የስዊስ ኤምባሲ", "የጃፓን ኤምባሲ", "የቻይና ኤምባሲ", "የደቡብ ኮሪያ ኤምባሲ", "የቱርክ ኤምባሲ", "የህንድ ኤምባሲ", "የአውስትራሊያ ኤምባሲ", "የአውሮፓ ህብረት ልዑክ", "የቤልጂየም ኤምባሲ", "የፊንላንድ ኤምባሲ"],\n        or: ["Embaasii Ameerikaa", "Embaasii Ingilizii", "Embaasii Kaanaadaa", "Embaasii Jarmanii", "Embaasii Faransaay", "Embaasii Xaaliyaanii", "Embaasii Noorwey", "Embaasii Iswiidiniin", "Embaasii Deenmaark", "Embaasii Neezerlaand", "Embaasii Siwiis", "Embaasii Jaappaan", "Embaasii Chaayinaa", "Embaasii Kooriyaa Kibbaa", "Embaasii Tarkii", "Embaasii Hindii", "Embaasii Awustiraaliyaa", "Ergama EU", "Embaasii Beeljiyeem", "Embaasii Fiinlaand"]\n      },'
)

text = text.replace(
    '        am: ["የደንበኞች አገልግሎት ወኪል", "የመሬት አገልግሎት ወኪል", "የበረራ አስተናጋጅ", "የካርጎ ስፔሻሊስት", "የትኬት ወኪል", "የአቪዬሽን መካኒክ", "የአውሮፕላን አስተላላፊ", "የራምፕ ወኪል", "የእንግዳ ማረፊያ አስተናጋጅ", "የደህንነት ወኪል", "የካቢን ሰራተኛ", "የቦታ ማስያዝ ወኪል", "የሻንጣ አስተናጋጅ", "የአውሮፕላን ማረፊያ ስራዎች ሰራተኛ", "ቼክ-ኢን ወኪል"]\n      },',
    '        am: ["የደንበኞች አገልግሎት ወኪል", "የመሬት አገልግሎት ወኪል", "የበረራ አስተናጋጅ", "የካርጎ ስፔሻሊስት", "የትኬት ወኪል", "የአቪዬሽን መካኒክ", "የአውሮፕላን አስተላላፊ", "የራምፕ ወኪል", "የእንግዳ ማረፊያ አስተናጋጅ", "የደህንነት ወኪል", "የካቢን ሰራተኛ", "የቦታ ማስያዝ ወኪል", "የሻንጣ አስተናጋጅ", "የአውሮፕላን ማረፊያ ስራዎች ሰራተኛ", "ቼክ-ኢን ወኪል"],\n        or: ["Tajaajila Maamilaa", "Tajaajila Dirree", "Keessummeessaa Xiyyaaraa", "Ogeessa Kaargoo", "Tikeetii Kutaa", "Makaanika Aviyeeshinii", "Ogeessa Xiyyaaraa", "Hojjetaa Ramp", "Keessummeessaa", "Nageenya", "Hojjetaa Xiyyaaraa", "Tajaajila Bakka Qabachuu", "Hojjetaa Mi\'aa", "Hojjetaa Buufata Xiyyaaraa", "Check-in Agent"]\n      },'
)

text = text.replace(
    '        am: ["የኢትዮጵያ አየር መንገድ", "የኢትዮጵያ ኤርፖርቶች", "ቦሌ ዓለም አቀፍ", "DHL አቪዬሽን", "FedEx ኢትዮጵያ", "Turkish Airlines", "Emirates አዲስ", "Qatar Airways", "Kenya Airways", "RwandAir", "Flydubai አዲስ", "Lufthansa አዲስ", "KLM አዲስ", "Air France", "Egyptair አዲስ"]\n      },',
    '        am: ["የኢትዮጵያ አየር መንገድ", "የኢትዮጵያ ኤርፖርቶች", "ቦሌ ዓለም አቀፍ", "DHL አቪዬሽን", "FedEx ኢትዮጵያ", "Turkish Airlines", "Emirates አዲስ", "Qatar Airways", "Kenya Airways", "RwandAir", "Flydubai አዲስ", "Lufthansa አዲስ", "KLM አዲስ", "Air France", "Egyptair አዲስ"],\n        or: ["Daandii Qilleensaa Itoophiyaa", "Buufataalee Xiyyaaraa Itoophiyaa", "Boolee Idil-addunyaa", "DHL Aviyeeshinii", "FedEx Itoophiyaa", "Turkish Airlines", "Emirates Finfinnee", "Qatar Airways", "Kenya Airways", "RwandAir", "Flydubai Finfinnee", "Lufthansa Finfinnee", "KLM Finfinnee", "Air France", "Egyptair Finfinnee"]\n      },'
)

text = text.replace(
    '        am: ["ቦሌ ኤርፖርት፣ አዲስ አበባ"]\n      }\n    },',
    '        am: ["ቦሌ ኤርፖርት፣ አዲስ አበባ"],\n        or: ["Buufata Xiyyaaraa Boolee, Finfinnee"]\n      }\n    },'
)

text = text.replace(
    '        am: ["የስራ ማስኬጃ ስራ አስኪያጅ", "የሀገር ተወካይ", "የክልል የሽያጭ ስራ አስኪያጅ", "የቢዝነስ ልማት ኦፊሰር", "የፋይናንስ ስራ አስኪያጅ", "የሰው ሀይል ስራ አስኪያጅ", "የግዢ ስራ አስኪያጅ", "የአቅርቦት ሰንሰለት ኦፊሰር", "የማርኬቲንግ ስራ አስኪያጅ", "የ IT ስራ አስኪያጅ", "የደንበኞች ግንኙነት ኦፊሰር", "አጠቃላይ ስራ አስኪያጅ", "የቅርንጫፍ ስራ አስኪያጅ", "አስተዳደራዊ ስራ አስኪያጅ", "የኮሙኒኬሽን ስራ አስኪያጅ"]\n      },',
    '        am: ["የስራ ማስኬጃ ስራ አስኪያጅ", "የሀገር ተወካይ", "የክልል የሽያጭ ስራ አስኪያጅ", "የቢዝነስ ልማት ኦፊሰር", "የፋይናንስ ስራ አስኪያጅ", "የሰው ሀይል ስራ አስኪያጅ", "የግዢ ስራ አስኪያጅ", "የአቅርቦት ሰንሰለት ኦፊሰር", "የማርኬቲንግ ስራ አስኪያጅ", "የ IT ስራ አስኪያጅ", "የደንበኞች ግንኙነት ኦፊሰር", "አጠቃላይ ስራ አስኪያጅ", "የቅርንጫፍ ስራ አስኪያጅ", "አስተዳደራዊ ስራ አስኪያጅ", "የኮሙኒኬሽን ስራ አስኪያጅ"],\n        or: ["Hogganaa Hojii", "Bakka Bu\'aa Biyyaa", "Hogganaa Gurgurtaa Naannoo", "Ogeessa Misooma Daldalaa", "Hogganaa Faayinaansii", "Hogganaa HR", "Hogganaa Bittaa", "Ogeessa Dhiyeessii", "Hogganaa Gabaa", "Hogganaa IT", "Ogeessa Walquunnamtii Maamilaa", "Hogganaa Waliigalaa", "Hogganaa Damee", "Hogganaa Bulchiinsaa", "Hogganaa Kominikeeshinii"]\n      },'
)

text = text.replace(
    '        am: ["ሳፋሪኮም ኢትዮጵያ", "ሄኒከን ኢትዮጵያ", "ኮካ ኮላ ኢትዮጵያ", "BGI ኢትዮጵያ", "ዲያጆ ሜታ አቦ", "ሂልተን አዲስ አበባ", "ሸራተን አዲስ አበባ", "ራዲሰን ብሉ አዲስ", "ሃያት ሪጀንሲ አዲስ", "ማሪዮት አዲስ", "DHL ኤክስፕረስ", "ቶዮታ ኢትዮጵያ", "ቶታል ኢነርጂ", "ዩኒሊቨር ኢትዮጵያ", "PwC ኢትዮጵያ"]\n      },',
    '        am: ["ሳፋሪኮም ኢትዮጵያ", "ሄኒከን ኢትዮጵያ", "ኮካ ኮላ ኢትዮጵያ", "BGI ኢትዮጵያ", "ዲያጆ ሜታ አቦ", "ሂልተን አዲስ አበባ", "ሸራተን አዲስ አበባ", "ራዲሰን ብሉ አዲስ", "ሃያት ሪጀንሲ አዲስ", "ማሪዮት አዲስ", "DHL ኤክስፕረስ", "ቶዮታ ኢትዮጵያ", "ቶታል ኢነርጂ", "ዩኒሊቨር ኢትዮጵያ", "PwC ኢትዮጵያ"],\n        or: ["Safaricom Itoophiyaa", "Heineken Itoophiyaa", "Coca-Cola Beverages", "BGI Itoophiyaa", "Diageo Meta Abo", "Hilton Finfinnee", "Sheraton Finfinnee", "Radisson Blu Finfinnee", "Hyatt Regency Finfinnee", "Marriott Finfinnee", "DHL Express", "Toyota Itoophiyaa", "TotalEnergies", "Unilever Itoophiyaa", "PwC Itoophiyaa"]\n      },'
)

text = text.replace(
    '    am: ["0-1 ዓመታት", "1-2 ዓመታት", "2-3 ዓመታት", "3-5 ዓመታት", "5+ ዓመታት"]\n  };',
    '    am: ["0-1 ዓመታት", "1-2 ዓመታት", "2-3 ዓመታት", "3-5 ዓመታት", "5+ ዓመታት"],\n    or: ["Waggaa 0-1", "Waggaa 1-2", "Waggaa 2-3", "Waggaa 3-5", "Waggaa 5+"]\n  };'
)

text = text.replace(
    '    am: ["የሙሉ ሰዓት", "ኮንትራት", "የትርፍ ሰዓት"]\n  };',
    '    am: ["የሙሉ ሰዓት", "ኮንትራት", "የትርፍ ሰዓት"],\n    or: ["Guutuu Yeroo", "Kontiraataa", "Yeroo Walakkaa"]\n  };'
)

text = text.replace('const ALL_JOBS_AM = generateJobs("am");', 'const ALL_JOBS_AM = generateJobs("am");\nconst ALL_JOBS_OR = generateJobs("or");')
text = text.replace('const currentJobs = lang === "am" ? ALL_JOBS_AM : ALL_JOBS_EN;', 'const currentJobs = lang === "am" ? ALL_JOBS_AM : lang === "or" ? ALL_JOBS_OR : ALL_JOBS_EN;')

text = text.replace('{filterCategory ? `${filterCategory} ${lang === "am" ? "ሥራዎች" : "Jobs"}` : (lang === "am" ? "በ2019 ተፈላጊ ሥራዎች" : "Trending in 2019")}', '{filterCategory ? `${filterCategory} ${lang === "am" ? "ሥራዎች" : lang === "or" ? "Hojiiwwan" : "Jobs"}` : (lang === "am" ? "በ2019 ተፈላጊ ሥራዎች" : lang === "or" ? "Hojiiwwan Bara 2019" : "Trending in 2019")}')
text = text.replace('{lang === "am" ? "የተረጋገጡ የሥራ ዕድሎች።" : "Verified Job Opportunities."}', '{lang === "am" ? "የተረጋገጡ የሥራ ዕድሎች።" : lang === "or" ? "Carraawwan Hojii Mirkanaa\'an." : "Verified Job Opportunities."}')
text = text.replace('{lang === "am" ? "ማጣሪያውን ያጽዱ ✕" : "Clear Filter ✕"}', '{lang === "am" ? "ማጣሪያውን ያጽዱ ✕" : lang === "or" ? "Xurii Balleessi ✕" : "Clear Filter ✕"}')
text = text.replace('{showAll ? (lang === "am" ? "ትንሽ አሳይ" : "Show Less") : (lang === "am" ? "ሁሉንም ይመልከቱ" : "View All")}', '{showAll ? (lang === "am" ? "ትንሽ አሳይ" : lang === "or" ? "Xiqqaa Agarsiisi" : "Show Less") : (lang === "am" ? "ሁሉንም ይመልከቱ" : lang === "or" ? "Hunda Ilaali" : "View All")}')
text = text.replace('{lang === "am" ? "አሁን ያመልክቱ" : "Apply Now"}', '{lang === "am" ? "አሁን ያመልክቱ" : lang === "or" ? "Amma Iyyadhu" : "Apply Now"}')
text = text.replace('{lang === "am" ? "ተጨማሪ ያስሱ" : "Explore More"}', '{lang === "am" ? "ተጨማሪ ያስሱ" : lang === "or" ? "Dabalata Daawwadhu" : "Explore More"}')
text = text.replace('{lang === "am" ? `${remainingCount} ሌሎች አማራጮችን ይመልከቱ` : `View ${remainingCount} other options across Ethiopia & Int\\\'l`}', '{lang === "am" ? `${remainingCount} ሌሎች አማራጮችን ይመልከቱ` : lang === "or" ? `Filannoowwan biroo ${remainingCount} ilaali` : `View ${remainingCount} other options across Ethiopia & Int\\\'l`}')

with open('src/components/landing/LatestJobsSection.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
