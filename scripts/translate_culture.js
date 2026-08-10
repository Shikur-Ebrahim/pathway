const fs = require('fs');

const file = 'd:/projects/pathway/src/lib/cultureData.ts';
let content = fs.readFileSync(file, 'utf8');

// I will just append the "or" blocks for each culture entry.
const oromoData = {
  "office-environment": {
    slug: "office-environment",
    title: "Biiroowwan Sadarkaa Addunyaa",
    subtitle: "Iddoowwan hojii ammayyaa, mijatoo fi kakaasoo ta'an muuxadhu.",
    icon: "🏢",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-600 to-indigo-800",
    description: "Dhaabbileen nuti waliin hojjennu Itoophiyaa keessatti iddoowwan hojii ammayyaa fi mijatoo ta'an keessaa isaan muraasa dhiyeessu. Finfinnee bakkeewwan gurguddoo keessatti kan argaman biiroowwan kun oomishtummaa, kalaqaa fi fayya-qabeessummaa hojjettootaa guddisuuf kan qophaa'aniidha. Iddoon itti hojjettan akkaataa itti hojjettan irratti dhiibbaa guddaa akka qabu ni amanna. Kanaafuu dhaabbileen rogaa keenya ta'an ulaagaalee idil-addunyaa kan guutan ta'uu isaanii of eeggannoodhaan mirkaneessina.\n\nIddoowwan hojii qaamaaf mijatoo ta'an irraa eegalee hanga iddoowwan boqonnaa kalaqa kakaasaniitti, tokkoon tokkoon iddoo kanaa milkaa'ina ogummaaf kan mijatee dha. Biiroowwan keenya hedduun daawwannaa magaalaa nama ajaa'ibsiisu, sirna to'annoo qilleensaa ammayyaa fi uumama gara keessaatti fiduun dhiphina xiqqeessan qabu.\n\nDabalataanis, naannoowwan kun minjaalaa fi teessoo qofa irra darbu. Kaaffeewwan sadarkaa olaanaa qaban kanneen nyaata fayya-qabeessa dhiyeessan, kutaalee fayyaa sammuu haaromsuuf gargaaran, fi wiirtuuwwan ispoortii gurguddoo ni argattu. Pathway karaa hojii yeroo argattan, hojii qofa utuu hin ta'in, mana lammaffaa isin jajjabeessu argattu.",
    highlights: [
      { title: "Iddoowwan Hojii Mijatoo", desc: "Minjaalota dhaabbachaa, teessoowwan mijatoo, fi iddoowwan ifa gaarii qaban." },
      { title: "Walquunnamtii Saffisaa", desc: "Interneetii faayibarii saffisa guddaa qabuu fi amansiisaa ta'e." },
      { title: "Iddoowwan Boqonnaa", desc: "Kutaalee boqonnaa, kaaffeewwan, fi iddoowwan aara galfii." },
      { title: "Bakkeewwan Giddugaleessaa", desc: "Geejjiba, manneen nyaataa fi tajaajiloota magaalaatti dhiyeenyatti argachuu." }
    ],
    quote: "Biiroon gaariin waa'ee minjaala fi kompiitaraa qofa miti; bakka namoonni guyyaa guyyaan hojii isaanii hunda caalu hojjechuuf kaka'umsa itti argatan uumuudha.",
    author: "Garee Fasiliitii Pathway",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "teamwork": {
    slug: "teamwork",
    title: "Hojii Garee Ogummaa",
    subtitle: "Sammuuwwan ciccimoo indastirii keessan keessa jiran waliin hojjedhaa.",
    icon: "🤝",
    heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    gradient: "from-emerald-600 to-teal-800",
    description: "Bakka hojii ammayyaa keessatti milkaa'inni caalaatti kan madaalamu walta'iinsaani. Pathway karaa hojii yeroo argattan, gareewwan garaagaraa, hunda hammatoo fi ogummaa olaanaa qaban kan yaadonni keessan itti kabajamanii fi gumaachi keessan dhugumaan barbaachisaa ta'e ni makamtu. Dhaabbileen neetworkii keenya keessa jiran naannoo nageenya xiinsammuu sirnaan ni jajjabeessu, miseensi garee hundi yaada haaraa qooduuf sodaa malee ofitti amanamummaa akka qabaatu mirkaneessu.\n\nCarraa addaa sammuuwwan ciccimoo indastirii keessan keessa jiran waliin hojjechuu ni argattu. Dhaabbileen nuti waliin hojjennu ulaagaa qaxarii cimaa fayyadamu, kana jechuun hojjettoonni isin waliin hojjetan dammaqoo, hayyoota fi milkaa'ina waliigalaatiif cimanii kan hojjetan ta'u. Kunis sirna gorsa uumamaa kan beekumsi guyyaa guyyaan itti darbu uuma, garee kanaa miseensa ta'uu qofaan ogummaa haaraa akka barataniif haala mijeessa.\n\nWalta'iinsi kutaa hojii garaagaraa gidduu jirus aadaa dhaabbilee kanaa keessatti utubaadha. Kutaa tokko keessatti qofa hin daangeffamtan; kanaa mannaa, pirojeektota walxaxaa fi dhiibbaa guddaa qaban hojjechuuf ogeeyyii injinariingii, gabaa, faayinaansii fi hojimaataa waliin yeroo baayyee ni hojjettu. Kunis ilaalcha ogummaa keessan bal'isuu qofa osoo hin taane dandeettii hoggansaa keessan saffisaan dabala.",
    highlights: [
      { title: "Gareewwan Garaagaraa", desc: "Ogeeyyii duubee fi aadaa adda addaa qaban waliin hojjedhaa." },
      { title: "Gorsa fi Deeggarsa", desc: "Hogganoota olaanoo muuxannoo qaban irraa kallattiin baradhaa." },
      { title: "Walta'iinsa Saffisaa", desc: "Hoggansa pirojeektii ammayyaa fi haala hojii walta'iinsaa." },
      { title: "Aadaa Hunda Hammataa", desc: "Bakka hojii sagaleen hundumaa itti dhaga'amuu fi kabajamu." }
    ],
    quote: "Kophaa keenya waan xiqqoo hojjechuu dandeenya; waliin taanee garuu waan guddaa hojjechuu dandeenya. Dhaabbileen keenya qindoomina gareetiif dursa kennu.",
    author: "Neetworkii Qabeenya Namaa Pathway",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "career-growth": {
    slug: "career-growth",
    title: "Guddina Ogummaa",
    subtitle: "Imala ogummaa keessanii saffisiisaa.",
    icon: "📈",
    heroImage: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
    gradient: "from-purple-600 to-violet-800",
    description: "Hojiin jalqaba qofa. Dhaabbileen nuti beeksifnu guddina hojjettootaaf kutaannoo cimaa qabu, guddina sadarkaa fi carraa barumsa itti fufiinsa qabuuf karaa ifaa fi gurmaa'aa ta'e ni dhiyeessu. Qabeenyi isaanii inni guddaan humna namaa akka ta'e ni hubatu, kanaafuu isin yeroo hunda guddachaa fi dandeettii keessan isa olaanaatti ga'uu keessan mirkaneessuuf invastimantii guddaa taasisaniiru.\n\nDhaabbilee sadarkaa olaanaa kana yeroo makamtan, sagantaalee barumsaa fi guddinaa sadarkaa addunyaa argachuu dandeessu. Kunis leenjii hojii jalqabaa bal'aa, awada-hojii ogummaa teeknikaa itti fufiinsa qabu, akadaamiiwwan hoggansaa, fi yeroo baayyee digriiwwan olaanoo fi waraqaa ragaa adda ta'aniif kaffaltii barnootaa guutummaatti deebisuu of keessatti qabata. Yoomiyyuu akka dhaabattan isinitti hin dhaga'amu; yeroo hunda qormaata haaraa injifatamu fi ogummaa haaraa baratamutu jira.\n\nDabalataanis, guddinni ogummaa ifa fi dandeettii irratti kan hundaa'edha. Yaada fooyya'iinsaaf gargaaru waliin gamaaggama raawwii idilee ni qabaattu, kunis gara sadarkaa itti aanuutti darbuuf maal galmaan ga'uu akka qabdan sirriitti karoorsuuf isin gargaara. Kaadhimamtootni keenya hedduun waggoota jalqabaa lamaan keessatti gara hoggansaa ykn hojiiwwan hoggansaa adda ta'anitti guddina argatu, kunis milkaa'ina hojii raawwachiisummaa yeroo dheeraaf isaan qopheessa.",
    highlights: [
      { title: "Sagantaalee Leenjii", desc: "Awada-hojii fi waraqaa ragaa keessoo fi alaa argachuu." },
      { title: "Guddina Ifa Ta'e", desc: "Sadarkaa dhaabbatichaa keessatti ol guddatuuf ulaagaa ifa ta'e." },
      { title: "Carraawwan Addunyaa", desc: "Ramaddii fi imala idil-addunyaaf carraawwan." },
      { title: "Deeggarsa Barnootaa", desc: "Barnoota itti fufiinsa qabuuf deeggarsa faayinaansii." }
    ],
    quote: "Nuti hojii qofa hin dhiyeessinu; ogummaa ni dhiyeessina. Ogeessa sadarkaa jalqabaa irraa gara hogganaa indastiriitti yeroo guddattan arguu barbaanna.",
    author: "Gorsitoota Ogummaa Pathway",
    images: [
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "interviews": {
    slug: "interviews",
    title: "Milkaa'ina Qormaata Afaanii (Interview)",
    subtitle: "Aartii qormaata afaanii ogummaa sirriitti to'adhaa.",
    icon: "🎯",
    heroImage: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=800&q=80",
    gradient: "from-orange-500 to-red-700",
    description: "Hojii abjootan argachuuf qormaata afaanii milkaa'inaan darbuun tarkaanfii isa murteessaadha. Pathway qaxartoota gurguddoo waliin isin walquunnamsiisuu qofa osoo hin taane, mariiwwan xiyyeeffannoo guddaa barbaadan kana keessatti ofii keessan isa hunda caalu dhiyeessuuf qabeenya bal'aa fi deeggarsa qabatamaa isin barbaachisu ni dhiyeessa. Qormaata afaanii kennuun ogummaa akka ta'e ni hubanna, akkuma ogummaa kamiiyyuu, qajeelfama sirrii ta'een sirriitti baratamuu danda'a.\n\nGuyyaa guddaa keessan dura ogeeyyiin qaxarii keenya ofkennan dhuunfaan isin waliin hojjetu. Dhaabbata fi gahee hojii isin iyyattan sanaaf addatti kan qophaa'e qormaata afaanii fakkiin ni geggeessina. Dhiibbaa naannoo dhugaa fakkeessuudhaan, deebii keessan akka fooyyessitan, afaan qaama keessanii akka sirreessitan, fi tooftaalee mirkanaa'an kan akka mala STAR fayyadamuun milkaa'ina keessan kanaan duraa akkamitti bareechitanii akka ibsitan isin gargaarra.\n\nGaaffiilee deebisuu qofa irra darbee, gaaffiilee sirrii ta'an akkamitti akka gaafattan isin barsiifna. Qormaanni afaanii daandii kallattii lamaati, galmoota tarsiimoowaa dhaabbatichaa irratti fedhii guddaa qabaachuu agarsiisuun dorgomtoota biroo irraa adda isin godha. Akkasumas hubannoo addaa qaxartootaa ni dhiyeessina—hojii raawwachiistotni qaxaranii maal akka barbaadan, aadaa dhaabbatichaa, fi dandeettiiwwan lallaafaa isaan hunda caalaa iddoo kennaniif ifa goona. Pathway waliin, yoomiyyuu qormaata afaaniitti ija cufattanii hin seentan.",
    highlights: [
      { title: "Qormaata Afaanii Fakkiin", desc: "Guyyaa dhugaa dura ogeeyyii waliin shaakalaa." },
      { title: "CV Fooyyessuu", desc: "Iyyanni keessan qaxartootaaf adda ta'ee akka mul'atu mirkaneessaa." },
      { title: "Leenjii Ofitti Amanamummaa", desc: "Sodaa to'achuu fi ifatti dubbachuuf tooftaalee baradhaa." },
      { title: "Hubannoo Qaxartootaa", desc: "Dhaabbileen maal akka barbaadan gorsa keessoo argadhaa." }
    ],
    quote: "Qormaanni afaanii qorannoo miti; gatii waloo argachuuf marii godhamudha. Qophaa'aa, ofitti amanaa, fi ofii keessan ta'aa.",
    author: "Garee Qaxarii Pathway",
    images: [
      "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
    ]
  }
};

for (const key of Object.keys(oromoData)) {
  const amRegex = new RegExp(\`\${key}["'\\s:]+\\{[\\s\\S]*?am:\\s*\\{[\\s\\S]*?\\}\\s*\\}\`);
  const match = content.match(amRegex);
  if (match) {
    // We can just append the "or" property right after the "am" property block.
    // The easiest way is to find the closing brace of the "am" block for this key.
    // Since parsing with regex is hard, let's just do a string replacement targeting the start of the next key or end of object.
  }
}

// Actually, since I have the full file and it's small, let's just use string replacement on the file.
const replacedContent = content
  .replace(/(am: {[\s\S]*?slug: "office-environment"[\s\S]*?]\s+})/, '$1,\n    or: ' + JSON.stringify(oromoData["office-environment"], null, 6))
  .replace(/(am: {[\s\S]*?slug: "teamwork"[\s\S]*?]\s+})/, '$1,\n    or: ' + JSON.stringify(oromoData["teamwork"], null, 6))
  .replace(/(am: {[\s\S]*?slug: "career-growth"[\s\S]*?]\s+})/, '$1,\n    or: ' + JSON.stringify(oromoData["career-growth"], null, 6))
  .replace(/(am: {[\s\S]*?slug: "interviews"[\s\S]*?]\s+})/, '$1,\n    or: ' + JSON.stringify(oromoData["interviews"], null, 6));

fs.writeFileSync(file, replacedContent);
console.log("Successfully updated cultureData.ts");
