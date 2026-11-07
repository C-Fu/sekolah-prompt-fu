/**
 * Planetary Subject Worlds & Cartographic Schema for Sekolah Prompt-Fu
 */

export type SubjectId = "bm" | "sains" | "matematik" | "english" | "moral";

export interface PlanetFeature {
  id: string;
  name: string;
  nameMs: string;
  year: number; // 1 to 6 (representing Tahun 1 to Tahun 6)
  isFinalBoss?: boolean;
  description: string;
  descriptionMs: string;
}

export interface Planet {
  id: string;
  celestialBody: string;
  celestialBodyMs: string;
  subjectId: SubjectId;
  subjectTitle: string;
  subjectTitleMs: string;
  themeColor: string;
  accentColor: string;
  features: PlanetFeature[];
}

export const PLANET_WORLDS: Planet[] = [
  {
    id: "moon-bm",
    celestialBody: "Moon",
    celestialBodyMs: "Bulan",
    subjectId: "bm",
    subjectTitle: "Bahasa Melayu",
    subjectTitleMs: "Bahasa Melayu",
    themeColor: "#94A3B8", // Slate / Silver lunar crust
    accentColor: "#38BDF8",
    features: [
      {
        id: "oceanus-procellarum",
        name: "Oceanus Procellarum (The Western Ocean)",
        nameMs: "Lautan Procellarum",
        year: 1,
        description: "Vast smooth plains for learning foundational vocabulary, nouns, and verbs.",
        descriptionMs: "Dataran luas untuk mempelajari kata nama, kata kerja dan bina ayat asas.",
      },
      {
        id: "imbrium-basin",
        name: "The Imbrium Basin",
        nameMs: "Lembah Imbrium",
        year: 2,
        description: "Northern crater plains for expanding sentence variety and descriptive storytelling.",
        descriptionMs: "Dataran utara untuk memperluas ayat dan penceritaan deskriptif.",
      },
      {
        id: "eastern-maria",
        name: "Eastern Maria (Tranquility Cluster)",
        nameMs: "Laut Ketenangan",
        year: 3,
        description: "Interconnected dark basalt plains for mastering comprehension prompts.",
        descriptionMs: "Kawasan basalt gelap untuk menguasai soalan pemahaman dan kosa kata.",
      },
      {
        id: "near-side-highlands",
        name: "Near-Side Highlands",
        nameMs: "Tanah Tinggi Sisi Dekat",
        year: 4,
        description: "Cratered rugged terrain for formal letters and contextual dialogues.",
        descriptionMs: "Kawasan berbukit untuk membina surat rasmi dan dialog berkonteks.",
      },
      {
        id: "far-side-highlands",
        name: "Far-Side Highlands",
        nameMs: "Tanah Tinggi Sisi Jauh",
        year: 5,
        description: "Thick crust terrain for advanced essays, metaphors, and poetry prompts.",
        descriptionMs: "Kawasan berkawah tebal untuk karangan kreatif, peribahasa dan pantun.",
      },
      {
        id: "south-pole-aitken",
        name: "South Pole-Aitken Basin",
        nameMs: "Lembangan Kutub Selatan-Aitken",
        year: 6,
        isFinalBoss: true,
        description: "The titanic, deepest lunar crater — the Final Boss arena for Year 6 UPSA prompt mastery.",
        descriptionMs: "Kawah terdalam di bulan — arena Bos Terakhir untuk penguasaan karangan lengkap Tahun 6.",
      },
    ],
  },
  {
    id: "earth-sains",
    celestialBody: "Earth",
    celestialBodyMs: "Bumi",
    subjectId: "sains",
    subjectTitle: "Science",
    subjectTitleMs: "Sains",
    themeColor: "#10B981", // Lush green & deep blue
    accentColor: "#3B82F6",
    features: [
      {
        id: "biosphere-plains",
        name: "Biosphere Sanctuary",
        nameMs: "Dataran Biosfera",
        year: 1,
        description: "Living vs non-living identification and human five senses prompts.",
        descriptionMs: "Mengenal pasti benda hidup vs bukan hidup dan 5 deria manusia.",
      },
      {
        id: "canopy-rainforest",
        name: "Equatorial Rainforest Terrane",
        nameMs: "Hutan Hujan Khatulistiwa",
        year: 2,
        description: "Animal life cycles and plant growth requirement prompts.",
        descriptionMs: "Kitaran hidup haiwan dan keperluan tumbesaran tumbuhan.",
      },
      {
        id: "savanna-basin",
        name: "Great Rift Savanna",
        nameMs: "Lembah Savana",
        year: 3,
        description: "Animal teeth, nutrition classification, and magnetic properties.",
        descriptionMs: "Gigi haiwan, tabiat pemakanan dan sifat magnet.",
      },
      {
        id: "abyssal-trench",
        name: "Mariana Depths",
        nameMs: "Jurang Mariana",
        year: 4,
        description: "Living processes, photosynthesis, and sound energy prompts.",
        descriptionMs: "Proses hidup tumbuhan, fotosintesis dan tenaga bunyi.",
      },
      {
        id: "tectonic-plateau",
        name: "Alpine Geotectonic Plateau",
        nameMs: "Dataran Tektonik Alpine",
        year: 5,
        description: "Microorganisms, energy transformations, and matter states.",
        descriptionMs: "Mikroorganisma, perubahan bentuk tenaga dan jirim.",
      },
      {
        id: "everest-strata",
        name: "Himalayan Crown Peak",
        nameMs: "Kemuncak Himalaya",
        year: 6,
        isFinalBoss: true,
        description: "Ecosystem balance, planetary science, and complex scientific inquiry boss.",
        descriptionMs: "Keseimbangan ekosistem, sains angkasa dan penyiasatan saintifik lanjutan.",
      },
    ],
  },
  {
    id: "mars-matematik",
    celestialBody: "Mars",
    celestialBodyMs: "Marikh",
    subjectId: "matematik",
    subjectTitle: "Mathematics",
    subjectTitleMs: "Matematik",
    themeColor: "#EF4444", // Rust red
    accentColor: "#F59E0B",
    features: [
      {
        id: "elysium-planitia",
        name: "Elysium Planitia",
        nameMs: "Dataran Elysium",
        year: 1,
        description: "Numbers up to 100, basic addition/subtraction, and 2D shapes.",
        descriptionMs: "Nombor hingga 100, operasi asas tambah/tolak dan bentuk 2D.",
      },
      {
        id: "valles-marineris",
        name: "Valles Marineris",
        nameMs: "Lembah Marineris",
        year: 2,
        description: "Multiplication and division, fractions, and money up to RM100.",
        descriptionMs: "Darab dan bahagi asas, pecahan mudah dan wang hingga RM100.",
      },
      {
        id: "syrtis-major",
        name: "Syrtis Major Planum",
        nameMs: "Dataran Syrtis Major",
        year: 3,
        description: "Numbers up to 10,000, perimeter/area, and data charts.",
        descriptionMs: "Nombor hingga 10,000, perimeter, luas dan carta data.",
      },
      {
        id: "hellas-basin",
        name: "Hellas Planitia Basin",
        nameMs: "Lembangan Hellas Planitia",
        year: 4,
        description: "Decimals, percentages, time duration, and angles.",
        descriptionMs: "Perpuluhan, peratusan, tempoh masa dan sudut.",
      },
      {
        id: "tharsis-rise",
        name: "Tharsis Volcanic Plateau",
        nameMs: "Dataran Tinggi Tharsis",
        year: 5,
        description: "Mixed operations, volume, coordinate grids, and ratios.",
        descriptionMs: "Operasi bergabung, isi padu, koordinat dan nisbah.",
      },
      {
        id: "olympus-mons",
        name: "Olympus Mons",
        nameMs: "Gunung Olympus Mons",
        year: 6,
        isFinalBoss: true,
        description: "Solar system's tallest volcano — advanced financial problem-solving and algebra boss.",
        descriptionMs: "Gunung berapi tertinggi di sistem suria — arena Bos Terakhir celik kewangan & algebra.",
      },
    ],
  },
  {
    id: "venus-english",
    celestialBody: "Venus",
    celestialBodyMs: "Zuhrah",
    subjectId: "english",
    subjectTitle: "English Language",
    subjectTitleMs: "Bahasa Inggeris",
    themeColor: "#EAB308", // Golden atmospheric glow
    accentColor: "#EC4899",
    features: [
      {
        id: "ishtar-terra",
        name: "Ishtar Terra",
        nameMs: "Ishtar Terra",
        year: 1,
        description: "Phonics, greetings, classroom items, colors, and polite role-play.",
        descriptionMs: "Fonik, ucapan, objek bilik darjah, warna dan perbualan sopan.",
      },
      {
        id: "sedna-planitia",
        name: "Sedna Planitia",
        nameMs: "Sedna Planitia",
        year: 2,
        description: "Everyday routines, hobbies, and simple storytelling prompts.",
        descriptionMs: "Rutin harian, hobi dan arahan penceritaan mudah.",
      },
      {
        id: "aphrodite-terra",
        name: "Aphrodite Terra",
        nameMs: "Aphrodite Terra",
        year: 3,
        description: "Food, wild animals, weather descriptions, and question formation.",
        descriptionMs: "Makanan, haiwan liar, cuaca dan pembinaan soalan berstruktur.",
      },
      {
        id: "beta-regio",
        name: "Beta Regio",
        nameMs: "Beta Regio",
        year: 4,
        description: "Past experiences, future plans, and role-playing interviews.",
        descriptionMs: "Pengalaman lampau, perancangan masa depan dan temuramah watak.",
      },
      {
        id: "lada-terra",
        name: "Lada Terra",
        nameMs: "Lada Terra",
        year: 5,
        description: "Inventions, environmental awareness, and expressive role-playing.",
        descriptionMs: "Ciptaan sains, penjagaan alam sekitar dan dialog ekspresif.",
      },
      {
        id: "maxwell-montes",
        name: "Maxwell Montes",
        nameMs: "Pergunungan Maxwell",
        year: 6,
        isFinalBoss: true,
        description: "Highest peak on Venus — complex dialogue scripting and essay composition boss.",
        descriptionMs: "Puncak tertinggi di Zuhrah — arena Bos Terakhir penulisan esei dan dialog kritis.",
      },
    ],
  },
  {
    id: "mercury-moral",
    celestialBody: "Mercury",
    celestialBodyMs: "Utarid",
    subjectId: "moral",
    subjectTitle: "Pendidikan Moral",
    subjectTitleMs: "Pendidikan Moral",
    themeColor: "#8B5CF6", // Purple / Violet
    accentColor: "#F43F5E",
    features: [
      {
        id: "borealis-planitia",
        name: "Borealis Planitia",
        nameMs: "Borealis Planitia",
        year: 1,
        description: "Kindness, helping peers, honesty, and empathy prompts.",
        descriptionMs: "Kasih sayang, tolong-menolong, kejujuran dan empati sesama rakan.",
      },
      {
        id: "rembrandt-basin",
        name: "Rembrandt Basin",
        nameMs: "Lembah Rembrandt",
        year: 2,
        description: "Family harmony, respect for elders, and fair play in games.",
        descriptionMs: "Keharmonian keluarga, menghormati orang tua dan adil dalam permainan.",
      },
      {
        id: "beethoven-basin",
        name: "Beethoven Basin",
        nameMs: "Lembah Beethoven",
        year: 3,
        description: "Responsibility towards school environment and community hygiene.",
        descriptionMs: "Tanggungjawab terhadap kebersihan sekolah dan masyarakat setempat.",
      },
      {
        id: "rachmaninoff-basin",
        name: "Rachmaninoff Basin",
        nameMs: "Lembah Rachmaninoff",
        year: 4,
        description: "Appreciating multicultural neighbors and cultural diversity.",
        descriptionMs: "Menghargai jiran pelbagai kaum dan kepelbagaian budaya Malaysia.",
      },
      {
        id: "raditladi-basin",
        name: "Raditladi Basin",
        nameMs: "Lembah Raditladi",
        year: 5,
        description: "Courage to do right, peaceful conflict resolution, and digital ethics.",
        descriptionMs: "Keberanian menegakkan kebenaran, toleransi dan etika digital.",
      },
      {
        id: "caloris-basin",
        name: "Caloris Planitia (The Caloris Basin)",
        nameMs: "Lembangan Caloris",
        year: 6,
        isFinalBoss: true,
        description: "Titanic multi-ring impact basin — national pride, civic leadership, and integrity boss.",
        descriptionMs: "Lembangan impak gergasi — arena Bos Terakhir kepimpinan sivik dan integriti nasional.",
      },
    ],
  },
];
