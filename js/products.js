// Produktdata – ret navne, tekster og priser her.
// Priser er i DKK inkl. moms og er eksempelpriser.

const BRANDS = {
  dynavector: {
    name: "Dynavector",
    country: "Japan",
    founded: 1978,
    tagline: "Moving coil-pionerer fra Tokyo",
    intro: [
      "Dynavector Systems blev grundlagt i Tokyo i 1978 af professor Noboru Tominari, der kom fra en baggrund i forskning i fluiddynamik og præcisionsmekanik. Hans mål var at bygge pickupper, der gengiver musikken med den rytme, timing og dynamik, man oplever ved en levende koncert.",
      "Dynavector er især kendt for deres moving coil-pickupper og for opfindelser som 'Flux Damper' og 'Softened Magnetism', der stabiliserer magnetfeltet omkring spolerne og giver et mere roligt og detaljeret lydbillede. Mærket tilbyder både high output-modeller, der kan bruges med et almindeligt MM-trin, og low output-modeller til de mest krævende anlæg.",
      "Alle pickupper samles og justeres i hånden i Japan.",
    ],
  },
  nagaoka: {
    name: "Nagaoka",
    country: "Japan",
    founded: 1940,
    tagline: "Japansk præcision siden 1940",
    intro: [
      "Nagaoka blev grundlagt i Japan i 1940 og har i mere end 80 år fremstillet nåle, diamanter og pickupper. Firmaet har leveret nåle til en lang række kendte producenter og er i dag en af verdens mest erfarne specialister i pladeafspilning.",
      "Nagaokas MP-serie bygger på et 'Moving Permalloy'-princip, hvor en lille permalloy-cylinder bevæger sig i stedet for en tung magnet. Det giver lav bevægelig masse, god sporing og en varm, musikalsk lyd. Pickupperne har udskiftelige nåle, hvilket gør dem billige at holde ved lige.",
      "Nagaoka er det oplagte valg, hvis du vil have en markant opgradering af din pladespiller uden at skulle investere i et nyt forstærkertrin.",
    ],
  },
};

BRANDS.tilbehor = {
  name: "Tilbehør",
  eyebrow: "Pleje og rengøring",
  unit: "produkter",
  tagline: "Rene plader – bedre lyd og længere levetid for nålen",
  intro: [
    "Selv den bedste pickup kan kun gengive det, der er i rillen. Støv, fedt og snavs giver knas og støj og slider unødigt på nålen.",
    "HumminGuru-pladevaskerne renser dine plader med ultralyd: millioner af små bobler løfter snavset ud af rillerne, uden at noget rører pladens overflade. Bagefter tørres pladen med den indbyggede blæser, så den er klar til at blive spillet.",
  ],
};

const PRODUCTS = [
  // ---------- Dynavector ----------
  // Priser fra Classic HiFi-prislisten (PhonoPhono, 23.09.2026), afrundet til hele kr. 10X5 MkII: 5.110 kr. (oplyst separat).
  // Tekniske data er vejledende.
  {
    id: "dv-10xa", brand: "dynavector", model: "DV 10XA", price: 5814, image: "img/DV-10XA-HL.jpg",
    options: { name: "Output", required: true, values: [["High output (H) – til MM-indgang", 0], ["Low output (L) – til MC-indgang", 0]] },
    type: "MC · vælg high eller low output", output: "H: 2,0 mV · L: 0,3 mV", stylus: "Elliptisk", cantilever: "Aluminium", weight: "6,2 g",
    color: "#7a1d22", accent: "#e8e2d4",
    desc: "Den nyeste indgang til Dynavectors moving coil-verden. Fås som high output til et almindeligt MM-trin eller som low output til et MC-trin.",
  },
  {
    id: "dv-10x5-mkii", brand: "dynavector", model: "DV 10X5 MkII", price: 5110, image: "img/DV-10X5-MkII.jpg",
    options: { name: "Output", required: true, values: [["High output (H) – til MM-indgang", 0], ["Low output (L) – til MC-indgang", 0]] },
    type: "MC · vælg high eller low output", output: "H: 2,5 mV · L: 0,3 mV", stylus: "Elliptisk", cantilever: "Aluminium", weight: "7,3 g",
    color: "#1d1f24", accent: "#c9a24b",
    desc: "Efterfølgeren til den klassiske 10X5. Fås som high output, der spiller direkte på et MM-trin, eller som low output med endnu mere detalje til et MC-trin.",
  },
  {
    id: "dv-20x2a", brand: "dynavector", model: "DV 20X2A", price: 9312, image: "img/DV-20X2A-HL.jpg",
    options: { name: "Output", required: true, values: [["High output (H) – til MM-indgang", 0], ["Low output (L) – til MC-indgang", 0]] },
    type: "MC · vælg high eller low output", output: "H: 2,0 mV · L: 0,3 mV", stylus: "Micro-ridge", cantilever: "Aluminium", weight: "7,3 g",
    color: "#a12a2f", accent: "#e8e2d4",
    desc: "En moderne klassiker i ny udgave med Micro-ridge-nål og Flux Damper. Rolig, dynamisk og meget detaljeret.",
  },
  {
    id: "dv-aska", brand: "dynavector", model: "DV Aska", price: 3879, image: "img/ASKA-HL.jpg",
    options: { name: "Output", required: true, values: [["High output (H) – til MM-indgang", 0], ["Low output (L) – til MC-indgang", 0]] },
    type: "MC · vælg high eller low output", output: "H: 2,0 mV · L: 0,3 mV", stylus: "Micro-ridge", cantilever: "Bor (boron)", weight: "8,0 g",
    color: "#14286b", accent: "#ffffff",
    desc: "Ny model med karakteristisk blåt hus og bor-nålebærer. Hurtig, åben og engageret lyd – også i en high output-udgave til MM-trin.",
  },
  {
    id: "dv-karat-17dx", brand: "dynavector", model: "DV Karat 17DX", price: 18251, image: "img/KARAT-17DX.jpg",
    type: "MC (low output)", output: "0,3 mV", stylus: "Line contact", cantilever: "Massiv diamant, 1,7 mm", weight: "5,3 g",
    color: "#2b2b2b", accent: "#d9d9d9",
    desc: "Ekstremt kort nålebærer af massiv diamant giver en hurtig, præcis og transparent gengivelse. Den nyeste udgave af den roste Karat.",
  },
  {
    id: "dv-xx-2a", brand: "dynavector", model: "DV XX-2A", price: 17839, image: "img/XX-2A.jpg",
    type: "MC (low output)", output: "0,28 mV", stylus: "Micro-ridge", cantilever: "Bor (boron)", weight: "8,6 g",
    color: "#0f2a44", accent: "#c9a24b",
    desc: "Dynavectors legendariske XX-2 i nyeste udgave. Kraftige neodymmagneter og Flux Damper giver en fyldig, varm og meget dynamisk lyd med stor rumlighed.",
  },
  {
    id: "dv-xv-prima", brand: "dynavector", model: "DV XV Prima", price: 46483, image: "img/XV-Prima.jpg",
    type: "MC (low output)", output: "0,3 mV", stylus: "Micro-ridge", cantilever: "Bor (boron)", weight: "11,5 g",
    color: "#3a2f22", accent: "#c9a24b",
    desc: "Arvtager til XV-1s med åben konstruktion og fire magneter i V-formation. Enorm opløsning og et naturligt, sammenhængende lydbillede.",
  },
  {
    id: "dv-xv-ultima", brand: "dynavector", model: "DV XV Ultima", price: 69103, image: "img/XV-Ultima.jpg",
    type: "MC (low output)", output: "0,3 mV", stylus: "PF line contact", cantilever: "Bor (boron)", weight: "12,7 g",
    color: "#14161a", accent: "#b88b4a",
    desc: "Toppen af XV-serien. Stor dynamik, sort baggrund og en imponerende ro i gengivelsen.",
  },
  {
    id: "dv-te-kaitora-rua", brand: "dynavector", model: "DV Te Kaitora Rua", price: 28372, image: "img/Te-Kaitora-Rua.jpg",
    type: "MC (low output)", output: "0,3 mV", stylus: "PF line contact", cantilever: "Bor (boron)", weight: "12,3 g",
    color: "#5b4a3a", accent: "#e8d9b0",
    desc: "En af Dynavectors topmodeller med Flux Damper og Softened Magnetism. Navnet betyder 'Opdageren nr. 2' på maori. Til de allerbedste anlæg.",
  },

  // ---------- Nagaoka ----------
  // Priser fra Classic HiFi Nagaoka-prisliste 2025 (pickup uden headshell). Tekniske data er vejledende.
  {
    id: "ng-mp-100", brand: "nagaoka", model: "Nagaoka MP-100", price: 970, spare: "JN-P100", sparePrice: 520, headshellPrice: 1270, image: "img/MP-100.webp",
    type: "MM (Moving Permalloy)", output: "5,0 mV", stylus: "Konisk", cantilever: "Aluminium", weight: "6,5 g",
    color: "#222222", accent: "#d6d6d6",
    desc: "Indgangsmodellen i MP-serien. En stor opgradering fra de fleste standardpickupper med varm og balanceret lyd.",
  },
  {
    id: "ng-mp-110", brand: "nagaoka", model: "Nagaoka MP-110", price: 1200, spare: "JN-P110", sparePrice: 670, headshellPrice: 1500, image: "img/MP-110.jpg",
    type: "MM (Moving Permalloy)", output: "5,0 mV", stylus: "Elliptisk", cantilever: "Aluminium", weight: "6,5 g",
    color: "#1c1c1c", accent: "#c62b2b",
    desc: "En populær favorit. Elliptisk nål giver flere detaljer og bedre sporing end MP-100, til en fornuftig pris.",
  },
  {
    id: "ng-mp-150", brand: "nagaoka", model: "Nagaoka MP-150", price: 2850, spare: "JN-P150", sparePrice: 1800, headshellPrice: 3300, image: "img/MP-150.webp",
    type: "MM (Moving Permalloy)", output: "4,0 mV", stylus: "Super-elliptisk", cantilever: "Bor (boron) tap", weight: "6,5 g",
    color: "#1a1a1a", accent: "#b9965a",
    desc: "Super-elliptisk nål og bor-nålebærer giver klar diskant og et præcist stereobillede. Meget pickup for pengene.",
  },
  {
    id: "ng-mp-200", brand: "nagaoka", model: "Nagaoka MP-200", price: 3600, spare: "JN-P200", sparePrice: 2250, headshellPrice: 4050, image: "img/MP-200.jpg",
    type: "MM (Moving Permalloy)", output: "3,5 mV", stylus: "Elliptisk, nøgen diamant", cantilever: "Bor (boron)", weight: "8,0 g",
    color: "#2a3b55", accent: "#d6d6d6",
    desc: "Bor-nålebærer og nøgen elliptisk diamant. Åben og dynamisk lyd med flot opløsning i mellemtonen.",
  },
  {
    id: "ng-mp-300", brand: "nagaoka", model: "Nagaoka MP-300", price: 5700, spare: "JN-P300", sparePrice: 3200, headshellPrice: 6480, image: "img/MP-300.jpg",
    type: "MM (Moving Permalloy)", output: "3,0 mV", stylus: "Elliptisk, nøgen diamant", cantilever: "Bor (boron)", weight: "8,5 g",
    color: "#5a1520", accent: "#e0c58a",
    desc: "Lavere bevægelig masse og forbedret dæmpning. Fyldig bas og en meget naturlig klangfarve.",
  },
  {
    id: "ng-mp-500", brand: "nagaoka", model: "Nagaoka MP-500", price: 6800, spare: "JN-P500", sparePrice: 3900, headshellPrice: 7500, image: "img/MP-500.jpg",
    type: "MM (Moving Permalloy)", output: "3,0 mV", stylus: "Super-elliptisk, nøgen diamant", cantilever: "Bor (boron)", weight: "8,5 g",
    color: "#111111", accent: "#d4af37",
    desc: "Hus i messing og et lydbillede, der matcher langt dyrere moving coil-pickupper.",
  },
  {
    id: "ng-mp-700", brand: "nagaoka", model: "Nagaoka MP-700", price: 9740, spare: "JN-P700", sparePrice: 5460, headshellPrice: 10400, image: "img/MP-700.jpg",
    type: "MM (Moving Permalloy)", output: "3,0 mV", stylus: "Super-elliptisk, nøgen diamant", cantilever: "Bor (boron)", weight: "9,0 g",
    color: "#111111", accent: "#c9a24b",
    desc: "Nagaokas nye topmodel i MP-serien. Bor-nålebærer og nøgen diamant giver en åben, detaljeret og meget naturlig gengivelse.",
  },
  {
    id: "ng-jt-80bk", brand: "nagaoka", model: "Nagaoka JT-80BK", price: 4470, spare: "JTS-80BK", sparePrice: 2970, image: "img/JT-80BK.jpg",
    type: "MM", output: "5,0 mV", stylus: "Konisk", cantilever: "Aluminium", weight: "6,0 g",
    color: "#151515", accent: "#888888",
    desc: "Solid og robust pickup til DJ-brug og hverdagslytning. Høj udgang og god sporing ved stor nålevægt.",
  },
  {
    id: "ng-jt-80lb", brand: "nagaoka", model: "Nagaoka JT-80LB", price: 1730, spare: "JTS-80LB", sparePrice: 1120, image: "img/JT-80LB.jpg",
    type: "MM", output: "5,0 mV", stylus: "Konisk", cantilever: "Aluminium", weight: "6,0 g",
    color: "#6fa8c9", accent: "#ffffff",
    desc: "Den lyseblå søster til JT-80BK. En robust og letspillet pickup til hverdagslytning, der sporer sikkert og er nem at montere.",
  },

  // ---------- Tilbehør ----------
  {
    id: "hg-01", brand: "tilbehor", model: "HumminGuru HG01", price: 4990, image: "img/humminguru-hg01.jpg",
    type: "Ultralyds-pladevasker",
    specs: [["Rensning", "Ultralyd"], ["Tørring", "Indbygget blæser"], ["Betjening", "Én knap – automatisk program"]],
    color: "#4a4d52", accent: "#ffffff",
    desc: "Kompakt pladevasker, der renser dine plader grundigt med ultralyd og tørrer dem bagefter. Fyld vand i, sæt pladen i, og tryk på knappen. Nem at bruge og fylder ikke meget.",
  },
  {
    id: "hg-05-nova", brand: "tilbehor", model: "HumminGuru HG05 Nova", price: 7990, image: "img/HumminGuru-HG05-Nova.jpg",
    type: "Ultralyds-pladevasker",
    specs: [["Rensning", "Ultralyd"], ["Tørring", "Indbygget blæser"], ["Betjening", "Kontrolpanel med flere programmer"]],
    color: "#9a9ca0", accent: "#222222",
    desc: "Den nyeste HumminGuru i børstet aluminiumsfinish. Samme effektive ultralydsrens og tørring som HG01, men med flere programmer, så du kan tilpasse rens og tørring til den enkelte plade.",
  },

];

// Nagaoka: vælg pickup, pickup med headshell eller erstatningsnål (priser fra Classic HiFi Nagaoka-prisliste 2025).
PRODUCTS.filter(p => p.brand === "nagaoka").forEach(p => {
  const v = [["Pickup", 0]];
  if (p.headshellPrice) v.push(["Pickup m/headshell", p.headshellPrice - p.price]);
  if (p.spare) v.push([`Erstatningsnål ${p.spare}`, p.sparePrice - p.price]);
  p.options = { name: "Vælg", absolute: true, values: v };
});
