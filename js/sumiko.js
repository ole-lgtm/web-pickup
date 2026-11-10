// Sumiko – priser fra Classic HiFi-prislisten 2026 (1 EUR = 7,50 DKK, afrundet til nærmeste 10 kr.).
// Udskiftningsnåle er ikke med. Billeder fra PS Audio Scandinavias prisliste 2026. Tekniske data er vejledende.

BRANDS.sumiko = {
  name: "Sumiko",
  country: "USA",
  founded: 1975,
  tagline: "Amerikanske pickupper til alle pladespillere",
  groups: ["MM-pickupper", "MC-pickupper"],
  intro: [
    "Sumiko blev grundlagt i Californien i 1975 og har i mere end 50 år lavet pickupper til både begyndere og erfarne vinylentusiaster.",
    "MM-serien med Rainier, Olympia, Moonstone, Wellfleet og Amethyst har udskiftelige nåle. Nålene passer på tværs af serien, så du senere kan opgradere ved blot at skifte nålen.",
    "I MC-serien finder du Blue Point No. 3 og Songbird, som begge fås i en high output-udgave til et almindeligt MM-trin og en low output-udgave til et MC-trin, og topmodellerne Oriole og Starling.",
  ],
};

const SUMIKO_OUTPUT = { name: "Output", required: true, values: [["High output – til MM-indgang", 0], ["Low output – til MC-indgang", 0]] };

PRODUCTS.push(
  // ---------- MM ----------
  {
    id: "su-rainier", brand: "sumiko", group: "MM-pickupper", model: "Sumiko Rainier", price: 1650,
    image: "img/sumiko/sumiko-rainier.jpg", type: "MM (Moving Magnet)",
    specs: [["Type", "Moving magnet"], ["Nål", "Udskiftelig"]],
    color: "#1a1a1a", accent: "#f2efe6",
    desc: "Indgangsmodellen i Sumikos MM-serie. En nem og billig opgradering, der kan vokse med dig: nålen kan senere skiftes til en Olympia- eller Moonstone-nål.",
  },
  {
    id: "su-olympia", brand: "sumiko", group: "MM-pickupper", model: "Sumiko Olympia", price: 2030,
    image: "img/sumiko/sumiko-olympia.jpg", type: "MM (Moving Magnet)",
    specs: [["Type", "Moving magnet"], ["Nål", "Udskiftelig"]],
    color: "#1a1a1a", accent: "#1f9e7e",
    desc: "Et skridt op fra Rainier med flere detaljer og bedre sporing. En populær all-round-pickup til de fleste pladespillere.",
  },
  {
    id: "su-moonstone", brand: "sumiko", group: "MM-pickupper", model: "Sumiko Moonstone", price: 2850,
    image: "img/sumiko/sumiko-moonstone.jpg", type: "MM (Moving Magnet)",
    specs: [["Type", "Moving magnet"], ["Nål", "Udskiftelig"]],
    color: "#1a1a1a", accent: "#e0585d",
    desc: "Mellemmodellen i MM-serien. Mere åben og detaljeret lyd med god dynamik og et stort lydbillede.",
  },
  {
    id: "su-wellfleet", brand: "sumiko", group: "MM-pickupper", model: "Sumiko Wellfleet", price: 4430,
    image: "img/sumiko/sumiko-wellfleet.jpg", type: "MM (Moving Magnet)",
    specs: [["Type", "Moving magnet"], ["Nål", "Udskiftelig"]],
    color: "#1a1a1a", accent: "#2850a8",
    desc: "En af de mest forfinede MM-pickupper fra Sumiko. Høj opløsning og fin balance, som spiller direkte på et almindeligt MM-trin.",
  },
  {
    id: "su-amethyst", brand: "sumiko", group: "MM-pickupper", model: "Sumiko Amethyst", price: 5630,
    image: "img/sumiko/sumiko-amethyst.jpg", type: "MM (Moving Magnet)",
    specs: [["Type", "Moving magnet"], ["Nål", "Udskiftelig"]],
    color: "#1a1a1a", accent: "#8e6bb0",
    desc: "Topmodellen i Sumikos MM-serie. Mange detaljer og et stort, roligt lydbillede, for dig der vil have det maksimale ud af et MM-trin.",
  },
  // ---------- MC ----------
  {
    id: "su-blue-point-no3", brand: "sumiko", group: "MC-pickupper", model: "Sumiko Blue Point No. 3", price: 4880,
    image: "img/sumiko/sumiko-blue-point-no3.jpg", type: "MC · vælg high eller low output",
    options: SUMIKO_OUTPUT,
    specs: [["Type", "Moving coil"], ["Udgaver", "High output og low output"]],
    color: "#1f3f8f", accent: "#e8e2d4",
    desc: "En klassiker og en af de mest populære veje ind i MC-verdenen. Fås som high output, der spiller direkte på et MM-trin, eller som low output til et MC-trin.",
  },
  {
    id: "su-songbird", brand: "sumiko", group: "MC-pickupper", model: "Sumiko Songbird", price: 8250,
    image: "img/sumiko/sumiko-songbird.jpg", type: "MC · vælg high eller low output",
    options: SUMIKO_OUTPUT,
    specs: [["Type", "Moving coil"], ["Udgaver", "High output og low output"]],
    color: "#1f3fbf", accent: "#e8e2d4",
    desc: "Levende og engageret MC-pickup i det blå hus. Fås som high output til et MM-trin eller som low output til et MC-trin.",
  },
  {
    id: "su-oriole", brand: "sumiko", group: "MC-pickupper", model: "Sumiko Oriole", price: 12750,
    image: "img/sumiko/sumiko-oriole.jpg", type: "MC (Moving Coil)",
    specs: [["Type", "Moving coil"]],
    color: "#d9531e", accent: "#1a1a1a",
    desc: "MC-pickup i det markante orange hus. Detaljeret og musikalsk med flot rumlighed.",
  },
  {
    id: "su-starling", brand: "sumiko", group: "MC-pickupper", model: "Sumiko Starling", price: 18000,
    image: "img/sumiko/sumiko-starling.jpg", type: "MC (Moving Coil)",
    specs: [["Type", "Moving coil"]],
    color: "#1a1a1a", accent: "#c9a24b",
    desc: "Sumikos topmodel. Meget høj opløsning, stor dynamik og et roligt, sammenhængende lydbillede.",
  },
);
