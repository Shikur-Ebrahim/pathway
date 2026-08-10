const fs = require('fs');

const oromoDict = {
  "Accepted ✅": "Fudhatameera ✅",
  "Interview Scheduled 📅": "Qormaanni Afaanii Qabameera 📅",
  "Under Review ⏳": "Gamaaggamamaa Jira ⏳",
  "Congratulations! Your application has been accepted. Our team will contact you shortly.": "Baga gammadan! Iyyannoon keessan fudhatameera. Gareen keenya dhiyeenyatti isin quunnama.",
  "Great news! You have been selected for an interview. Please wait for our contact.": "Oduu gaarii! Qormaata afaaniif filatamtaniittu. Maaloo hanga isin quunnamnutti eegaa.",
  "Your application has been received and is currently under review. We will notify you via email once processed.": "Iyyannoon keessan nu gaheera, ammas gamaaggamamaa jira. Akkuma xumurameen e-mail dhaan isin beeksisna.",
  "Application Status": "Haala Iyyannoo",
  "Application Details": "Bal'ina Iyyannoo",
  "Name": "Maqaa",
  "Sector": "Damee",
  "Role": "Gahee",
  "Job Application": "Iyyannoo Hojii",
  "Step ${step} of 7": "Sadarkaa ${step} 7 keessaa",
  "Application Submitted! 🎉": "Iyyannoon Ergameera! 🎉",
  "Your profile has been created successfully. Our team will review your application soon.": "Pirofaayilli keessan milkaa'inaan uumameera. Gareen keenya dhiyeenyatti iyyannoo keessan ni gamaaggama.",
  "What Happens Next?": "Itti Aansuun Maaltu Ta'a?",
  "Welcome to Pathway!": "Baga gara Pathway nagaan dhuftan!",
  "Let\\'s get you started. First, tell us about your current career status so we can tailor your application.": "Mee haa jalqabnu. Jalqaba, iyyannoo keessan sirreessuuf akka nu gargaarutti haala hojii keessan ammaa nuuf himaa.",
  "Fresh Graduate": "Eebbifamaa Haaraa",
  "Recently graduated (2015–2018 E.C.) and looking for your first professional opportunity.": "Dhiyeenya kan eebbifaman (2015–2018 B.A) fi carraa hojii ogummaa jalqabaa barbaadaa kan jiran.",
  "Experienced Professional": "Ogeessa Muuxannoo Qabu",
  "Currently working or graduated before 2015 E.C. with prior work experience.": "Amma hojjechaa kan jiran ykn bara 2015 dura kan eebbifamanii fi muuxannoo hojii kan qaban.",
  "Job Category": "Kutaalee Hojii",
  "Which sector are you most interested in?": "Damee kamiin caalaatti barbaaddu?",
  "Select Specific Role/Category": "Gahee/Kutaa Addaa Filadhaa",
  "Personal Info": "Odeeffannoo Dhuunfaa",
  "Tell us a bit about yourself.": "Waa'ee keessan waa xiqqoo nuuf himaa.",
  "Full Name": "Maqaa Guutuu",
  "Gender": "Saala",
  "Date of Birth": "Guyyaa Dhalootaa",
  "Phone Number": "Lakkoofsa Bilbilaa",
  "Email Address": "Teessoo E-mail",
  "Region": "Naannoo",
  "City / Sub-City": "Magaalaa / Kutaa Magaalaa",
  "Education": "Barnoota",
  "Your academic background.": "Duubee barnoota keessanii.",
  "Highest Education": "Sadarkaa Barnootaa",
  "University / College / Institution": "Yuunivarsiitii / Kolleejjii / Dhaabbata",
  "Field of Study": "Damee Qorannoo",
  "Graduation Year": "Bara Eebbaa",
  "CGPA (Optional)": "Qabxii (CGPA) (Filannoo)",
  "Background": "Duubee",
  "Even without full-time work, share what you\\'ve done.": "Muuxannoo qabdan kamiyyuu qoodaa.",
  "Internship / Volunteer Experience (Optional)": "Muuxannoo Hojii To'annoo / Fedha Ofii (Filannoo)",
  "Key Skills (e.g. Communication, MS Office, Design)": "Dandeettiiwwan Ijoo (fkn. Kompiitara, Diizaayinii)",
  "Languages Spoken (e.g. Amharic, English, Arabic)": "Afaanota Dubbataman (fkn. Amaaraa, Ingilizii)",
  "Work Experience": "Muuxannoo Hojii",
  "Your professional background.": "Duubee ogummaa keessanii.",
  "Years of Experience": "Muuxannoo Hojii (Waggaadhaan)",
  "Current / Latest Employer": "Qaxaraa Ammaa / Dhiyeenyaa",
  "Current / Latest Position": "Sadarkaa Hojii Ammaa / Dhiyeenyaa",
  "Employment Type": "Gosa Qaxarii",
  "Key Professional Skills": "Dandeettiiwwan Ogummaa Ijoo",
  "Sector Requirements": "Ulaagaalee Damee",
  "Please fill in the specific information required for this sector.": "Maaloo odeeffannoo addaa damee kanaaf barbaadamu guutaa:",
  "English Proficiency Level": "Sadarkaa Dandeettii Afaan Ingilizii",
  "Other Languages Spoken (Optional)": "Afaanota Biroo Dubbataman (Filannoo)",
  "Computer & Software Skills": "Dandeettii Kompiitaraa fi Sooftiweerii",
  "Typing Speed (words per minute, Optional)": "Saffisa Barreessuu (jecha daqiiqaatti, Filannoo)",
  "Do you have Security Clearance?": "Mirkaneessa Nageenyaa qabduu?",
  "Motivation Statement (Why do you want this role?)": "Xalayaa Kaka'umsaa (Gahee kana maaliif barbaaddan?)",
  "Years of NGO / Development Work Experience": "Muuxannoo Hojii NGO / Misoomaa Waggaadhaan",
  "Project Management Experience": "Muuxannoo Hoggansa Pirojektii",
  "Community Development Experience": "Muuxannoo Misooma Hawaasaa",
  "Can you write Proposals?": "Piroppozaalii barreessuu dandeessuu?",
  "Can you write Reports?": "Gabaasa barreessuu dandeessuu?",
  "Donor / Partner Experience (USAID, UNICEF, EU, etc.)": "Muuxannoo Arjoomtota / Michootaa (USAID, UNICEF, EU, kkf)",
  "Preferred Airport Role": "Gahee Buufata Xiyyaaraa Filatamu",
  "Do you have Ground Handling experience?": "Muuxannoo Tajaajila Lafaa qabduu?",
  "Cargo / Freight Experience (Optional)": "Muuxannoo Kaargoo / Fe'umsaa (Filannoo)",
  "Shift Preference": "Filannoo Siftii (Shift)",
  "Physical Fitness Level": "Sadarkaa Gahumsa Qaamaa",
  "Available to Travel / Work Different Locations?": "Gara iddoowwan garaagaraatti imaluuf / hojjechuuf qophiidhaa?",
  "Preferred Destination Country": "Biyya Galma Filatamu",
  "Do you have a valid Passport?": "Paaspoortii seera qabeessa qabduu?",
  "Yes": "Eeyyee",
  "Passport Number": "Lakkoofsa Paaspoortii",
  "Passport Expiry Date": "Guyyaa Paaspoortiin itti xumuramu",
  "When can you travel?": "Yoom imaluu dandeessu?",
  "Do you have a Medical Certificate?": "Ragaa Yaalaa (Medical Certificate) qabduu?",
  "Do you have a Police Clearance?": "Ragaa Qulqullinaa Poolisii qabduu?",
  "Upload Documents": "Sanadoota Olkaasaa (Upload)",
  "Upload your files. Accepted: PDF, DOC, JPG, PNG.": "Faayiloota keessan olkaasaa. Kan fudhatamu: PDF, DOC, JPG, PNG.",
  "Required Documents": "Sanadoota Dirqamaa",
  "CV / Resume": "CV / Riizumee",
  "Passport Size Photo (clear background)": "Suuraa Guddina Paaspoortii qabu (duubee ifa ta'e)",
  "Highest Educational Certificate": "Ragaa Barnootaa Olaanaa",
  "Additional Documents (Optional)": "Sanadoota Dabalataa (Filannoo)",
  "Work Experience Certificate": "Ragaa Muuxannoo Hojii",
  "Passport Copy": "Koppii Paaspoortii",
  "National ID / Fayda Card Copy": "Koppii Waraqaa Eenyummaa / Kaardii Faydaa",
  "Review & Submit": "Gamaaggamaa fi Ergaa",
  "Almost done! Review your info and confirm.": "Xumuruuf dhiyaattan! Odeeffannoo keessan gamaaggamaa, mirkaneessaa.",
  "Status": "Haala",
  "🎓 Fresh Graduate": "🎓 Eebbifamaa Haaraa",
  "💼 Experienced": "💼 Muuxannoo Kan Qabu",
  "City": "Magaalaa",
  "Documents": "Sanadoota",
  "uploaded": "Olkaafameera",
  "Application Fee:": "Kaffaltii Iyyannoo:",
  "Please pay the ${paymentConfig.feeAmount} ETB fee for your application to proceed. We will notify you via email for interviews once processed.": "Maaloo iyyannoon keessan akka itti fufuuf kaffaltii Qarshii ${paymentConfig.feeAmount} raawwadhaa. Akkuma xumurameen qormaata afaaniif e-mail dhaan isin beeksisna.",
  "Select Payment Method": "Mala Kaffaltii Filadhaa",
  "Account Holder": "Abbaa Herregaa",
  "Account / Phone Number": "Lakkoofsa Herregaa / Bilbilaa",
  "Copy": "Koppii",
  "Upload Payment Screenshot / Receipt": "Nagahee Kaffaltii / Screenshot Olkaasaa",
  "Declarations": "Mirkaneessitoota",
  "I confirm that all information I have provided is true and accurate.": "Odeeffannoon ani kenne hundi dhugaa fi sirrii ta'uu isaa nan mirkaneessa.",
  "I agree that Pathway Agency may share my profile and documents with prospective employers.": "Pathway Agency pirofaayilii fi sanadoota koo dhaabbilee qaxaran waliin akka qoodu walii nan gala.",
  "Back": "Duuba",
  "Processing...": "Adeemsifamaa jira...",
  "Submit Application": "Iyyannoo Ergi",
  "Continue": "Itti Fufi"
};

const file = 'd:/projects/pathway/src/components/ApplicationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// The regex we tested earlier
const regex = /lang === 'am' \? (['"`])((?:(?!\1)[^\\]|\\.)*)\1\s*:\s*(['"`])((?:(?!\3)[^\\]|\\.)*)\3/g;

content = content.replace(regex, (match, amQuote, amStr, enQuote, enStr) => {
  const oromoStr = oromoDict[enStr];
  if (oromoStr) {
    // If it's a template string, use backticks for the translated string.
    // If it has a variable like ${step}, backticks are mandatory.
    if (oromoStr.includes('${')) {
      return "lang === 'am' ? " + amQuote + amStr + amQuote + " : lang === 'or' ? `" + oromoStr + "` : " + enQuote + enStr + enQuote;
    }
    
    // Default to the same quote as the english string for safety (unless it's complex)
    const qt = oromoStr.includes("'") ? '"' : "'";
    return "lang === 'am' ? " + amQuote + amStr + amQuote + " : lang === 'or' ? " + qt + oromoStr + qt + " : " + enQuote + enStr + enQuote;
  }
  
  return match;
});

// A couple specific manual arrays logic we have in the file:
// line 527: `(lang === 'am' ? ['የ0 ዓመት ልምድ', 'ማንኛውም ዘርፍ', 'የስራ ታሪክ አያስፈልግም'] : ['0 Years Exp', 'Any Sector', 'No Work History Needed'])`
content = content.replace(
  `(lang === 'am' ? ['የ0 ዓመት ልምድ', 'ማንኛውም ዘርፍ', 'የስራ ታሪክ አያስፈልግም'] : ['0 Years Exp', 'Any Sector', 'No Work History Needed'])`,
  `(lang === 'am' ? ['የ0 ዓመት ልምድ', 'ማንኛውም ዘርፍ', 'የስራ ታሪክ አያስፈልግም'] : lang === 'or' ? ['Muuxannoo Waggaa 0', 'Damee Kamiyyuu', 'Seenaan Hojii Hin Barbaadamu'] : ['0 Years Exp', 'Any Sector', 'No Work History Needed'])`
);

content = content.replace(
  `(lang === 'am' ? ['የ1+ ዓመት ልምድ', 'የሙያ ለውጥ', 'ባለሙያዎች እንቀበላለን'] : ['1+ Years Exp', 'Career Change', 'Professionals Welcome'])`,
  `(lang === 'am' ? ['የ1+ ዓመት ልምድ', 'የሙያ ለውጥ', 'ባለሙያዎች እንቀበላለን'] : lang === 'or' ? ['Muuxannoo Waggaa 1+', 'Jijjiirama Ogummaa', 'Ogeeyyii Ni Simanna'] : ['1+ Years Exp', 'Career Change', 'Professionals Welcome'])`
);

// Education options
content = content.replace(
  `options={lang === 'am' ? ["ዲፕሎማ / TVET", "የባችለር ዲግሪ", "የማስተርስ ዲግሪ", "ፒኤችዲ (PhD)"] : ["Diploma / TVET", "Bachelor's Degree", "Master's Degree", "PhD"]}`,
  `options={lang === 'am' ? ["ዲፕሎማ / TVET", "የባችለር ዲግሪ", "የማስተርስ ዲግሪ", "ፒኤችዲ (PhD)"] : lang === 'or' ? ["Diploomaa / TVET", "Digrii Jalqabaa", "Digrii Maastarii", "PhD"] : ["Diploma / TVET", "Bachelor's Degree", "Master's Degree", "PhD"]}`
);

// Gender options
content = content.replace(
  `options={lang === 'am' ? ["ወንድ", "ሴት"] : ["Male", "Female"]}`,
  `options={lang === 'am' ? ["ወንድ", "ሴት"] : lang === 'or' ? ["Dhiira", "Dubartii"] : ["Male", "Female"]}`
);


// And the big ternary for sector definitions at line 581
// It looks like:
// {lang === 'am' && s.id === 'embassy' ? '...' : lang === 'am' && s.id === 'ngo' ? '...' ... : s.title}
// This is actually translated in CATEGORY_DATA. But since it's hardcoded here, let's fix it manually in a moment.

fs.writeFileSync(file, content);
console.log('Replaced ternary strings in ApplicationModal.tsx');
