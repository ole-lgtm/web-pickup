// Skyanalog – priser fra Classic HiFi-prislisten 2025 (1 EUR = 7,50 DKK, afrundet til nærmeste 10 kr.).
// Billeder fra skyanalog.com/phono-cartridges. Tekniske data fra Skyanalogs manualer (skyanalog.com/specifications-*), nåletryk er det anbefalede.

BRANDS.skyanalog = {
  name: "Skyanalog",
  eyebrow: "Moving coil-pickupper · Jiangmen, Kina",
  tagline: "Moving coil-pickupper med høj præcision til en fornuftig pris",
  groups: ["Topmodeller", "G-serien MKII", "P-serien"],
  intro: [
    "Skyanalog bygger moving coil-pickupper i Jiangmen i det sydlige Kina. Firmaet laver selv vigtige dele som nålebærere og ophæng, og pickupperne har fået flotte anmeldelser i internationale hi-fi-blade, især for meget lyd for pengene.",
    "Programmet går fra P-serien, der er et oplagt første skridt ind i MC-verdenen, over den neutrale og detaljerede G-serie til REF med nålebærer af safir og Diamond 25th med nålebærer af diamant.",
    "Som moving coil-pickupper skal de bruges med et MC-trin eller en step up-transformer.",
  ],
};

PRODUCTS.push(
  {
    id: "sky-diamond-25th", brand: "skyanalog", group: "Topmodeller", model: "Skyanalog Diamond 25th", price: 48750,
    image: "img/skyanalog/skyanalog-diamond-25th.jpg",
    type: "MC (Moving Coil)",
    specs: [["Udgangsspænding", "0,52 mV"], ["Impedans", "15 Ω"], ["Anbefalet belastning", "100–470 Ω"], ["Nål", "Micro-ridge"], ["Nålebærer", "Diamant"], ["Ophæng", "Yan-ophæng"], ["Nåletryk", "1,3–1,8 g"], ["Vægt", "10,7 g"]],
    color: "#c8961e", accent: "#1a1a1a",
    desc: "Skyanalogs flagskib. Nålebæreren er af diamant og lavet af Skyanalog selv, og den sidder i det særlige Yan-ophæng. Den bedste lyd, Skyanalog kan lave.",
  },
  {
    id: "sky-reference", brand: "skyanalog", group: "Topmodeller", model: "Skyanalog Reference (REF)", price: 22120,
    image: "img/skyanalog/skyanalog-reference.jpg",
    type: "MC (Moving Coil)",
    specs: [["Udgangsspænding", "0,5 mV"], ["Impedans", "15 Ω"], ["Anbefalet belastning", "100–470 Ω"], ["Nål", "Micro-ridge"], ["Nålebærer", "Safir"], ["Nåletryk", "1,3–1,8 g"], ["Vægt", "10 g"]],
    color: "#c8961e", accent: "#1a1a1a",
    desc: "Den nye udgave af REF, gentænkt og omkonstrueret. Klar og åben lyd med et væld af detaljer, i det karakteristiske guldfarvede hus.",
  },
  {
    id: "sky-g-1-mkii", brand: "skyanalog", group: "G-serien MKII", model: "Skyanalog G-1 MKII", price: 8620,
    image: "img/skyanalog/skyanalog-g-1-mkii.jpg",
    type: "MC (Moving Coil)",
    specs: [["Udgangsspænding", "0,43 mV"], ["Impedans", "15 Ω"], ["Anbefalet belastning", "100–470 Ω"], ["Nål", "Elliptisk"], ["Nålebærer", "Bor"], ["Nåletryk", "1,3–1,8 g"], ["Vægt", "10,7 g"]],
    color: "#5b2a5e", accent: "#e8e2d4",
    desc: "Indgangen til G-serien. Meget flad frekvensgang giver en naturlig lyd, men den er stadig meget analytisk og detaljeret.",
  },
  {
    id: "sky-g-2-mkii", brand: "skyanalog", group: "G-serien MKII", model: "Skyanalog G-2 MKII", price: 12370,
    image: "img/skyanalog/skyanalog-g-2-mkii.jpg",
    type: "MC (Moving Coil)",
    specs: [["Udgangsspænding", "0,46 mV"], ["Impedans", "15 Ω"], ["Anbefalet belastning", "100–470 Ω"], ["Nål", "Elliptisk"], ["Nålebærer", "Rubin"], ["Nåletryk", "1,3–1,8 g"], ["Vægt", "10,7 g"]],
    color: "#4aa3d8", accent: "#1a1a1a",
    desc: "Mellemmodellen i G-serien. Samme naturlige og neutrale grundtone som G-1, men med en nålebærer af rubin, der giver endnu mere opløsning.",
  },
  {
    id: "sky-g-3-mkii", brand: "skyanalog", group: "G-serien MKII", model: "Skyanalog G-3 MKII", price: 16490,
    image: "img/skyanalog/skyanalog-g-3-mkii.jpg",
    type: "MC (Moving Coil)",
    specs: [["Udgangsspænding", "0,46 mV"], ["Impedans", "15 Ω"], ["Anbefalet belastning", "100–470 Ω"], ["Nål", "Elliptisk"], ["Nålebærer", "Safir"], ["Nåletryk", "1,3–1,8 g"], ["Vægt", "10,7 g"]],
    color: "#3a3a3c", accent: "#e8e2d4",
    desc: "Topmodellen i G-serien med nålebærer af safir. Den mest detaljerede og dynamiske af de tre, med den naturlige balance som G-serien er kendt for.",
  },
  {
    id: "sky-p-1g", brand: "skyanalog", group: "P-serien", model: "Skyanalog P-1G", price: 4490,
    image: "img/skyanalog/skyanalog-p-1g.jpg",
    type: "MC (Moving Coil)",
    specs: [["Udgangsspænding", "0,4 mV"], ["Impedans", "13 Ω"], ["Anbefalet belastning", "100–470 Ω"], ["Nål", "Elliptisk"], ["Nålebærer", "Bor"], ["Nåletryk", "1,3–1,8 g"], ["Vægt", "10 g"]],
    color: "#1f8a4c", accent: "#1a1a1a",
    desc: "Den grønne P-1G har en finere nåleslibning end P-1M og henter endnu flere detaljer ud af rillen. Dynamisk og klar lyd til en meget fornuftig pris.",
  },
  {
    id: "sky-p-1m", brand: "skyanalog", group: "P-serien", model: "Skyanalog P-1M", price: 2990,
    image: "img/skyanalog/skyanalog-p-1m.jpg",
    type: "MC (Moving Coil)",
    specs: [["Udgangsspænding", "0,4 mV"], ["Impedans", "5 Ω"], ["Anbefalet belastning", "200–470 Ω"], ["Nål", "Konisk"], ["Nålebærer", "Aluminium"], ["Nåletryk", "1,1–1,5 g"], ["Vægt", "10 g"]],
    color: "#2b2b2d", accent: "#e8e2d4",
    desc: "Den billigste vej ind i en rigtig moving coil-pickup. Masser af information, dynamik og klarhed for pengene.",
  },
);
