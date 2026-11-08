/**
 * Planetary Subject Worlds & Cartographic Schema for Sekolah Prompt-Fu
 * Source: .planning/phases/09-planetary-schema-subject-alignment/09-CONTEXT.md
 */

export type SubjectId = "prompting" | "bm" | "english" | "matematik" | "moral";

export type PlanetId =
  | "earth-prompting"
  | "moon-bm"
  | "mars-english"
  | "venus-matematik"
  | "mercury-moral";

export interface GeoCoordinates {
  lat: number; // Latitude in degrees [-90..90]
  lon: number; // Longitude in degrees [-180..180]
  radiusDeg?: number; // Visual boundary radius in degrees on the sphere surface
  elevation?: string; // Authentic geological elevation/depth description
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PlanetFeature {
  id: string; // URL-friendly unique slug (e.g. 'oceanus-procellarum')
  featureNumber: number; // 1 to 7
  year: number; // 1 to 6 (Features 1-6 map to Tahun 1-6; Feature 7 maps to Tahun 6 Mastery)
  isFinalBoss: boolean; // true ONLY for Feature 7 ("Cabaran Unggul")

  // Names
  name: string; // English / International geological name
  nameMs: string; // Bahasa Melayu geological name

  // Cartography & Coordinates
  coordinates: GeoCoordinates;

  // Pedagogical & Thematic Details
  badge: string; // English KSSR skill badge (e.g. 'Foundational Vocabulary')
  badgeMs: string; // Malay KSSR skill badge (e.g. 'Kosa Kata Asas')
  description: string; // English narrative & prompt learning focus
  descriptionMs: string; // Malay narrative & prompt learning focus
  geologicalProfile: string; // English authentic planetary geological summary
  geologicalProfileMs: string; // Malay authentic planetary geological summary

  // Visual Theme
  accentColor?: string; // Feature-specific neon hotspot glow
}

export interface Planet {
  id: PlanetId;
  order: number; // 1 to 5 display sequence
  celestialBody: string; // 'Earth' | 'Moon' | 'Mars' | 'Venus' | 'Mercury'
  celestialBodyMs: string; // 'Bumi' | 'Bulan' | 'Marikh' | 'Zuhrah' | 'Utarid'
  subjectId: SubjectId;
  subjectTitle: string; // 'Foundational Prompting' | 'Bahasa Melayu' | etc.
  subjectTitleMs: string; // 'Asas Prompting' | 'Bahasa Melayu' | etc.

  // Visual Aesthetics
  themeColor: string; // Primary surface color hex
  accentColor: string; // Glowing aura / UI accent hex
  textureType: "procedural" | "shader"; // Ready for Phase 10 Three.js rendering

  // Celestial & Orbital Telemetry
  tagline: string;
  taglineMs: string;
  orbitalPeriodDays?: number;
  diameterKm?: number;

  // The 7 Distinct Geological Features
  features: PlanetFeature[];
}

/**
 * Converts standard spherical coordinates (latitude, longitude in degrees)
 * into a Three.js Cartesian Vector3 (Y-up convention).
 * Standard: lat [-90..90], lon [-180..180].
 */
export function latLonToVector3(lat: number, lon: number, radius: number = 1.0): Vector3D {
  // Clamping / safety bounds handling
  const safeLat = Number.isFinite(lat) ? Math.max(-90, Math.min(90, lat)) : 0;
  const safeLon = Number.isFinite(lon) ? lon : 0;
  const safeRadius = Number.isFinite(radius) ? radius : 1.0;

  const phi = (90 - safeLat) * (Math.PI / 180);
  const theta = (safeLon + 180) * (Math.PI / 180);

  return {
    x: -(safeRadius * Math.sin(phi) * Math.cos(theta)),
    y: safeRadius * Math.cos(phi),
    z: safeRadius * Math.sin(phi) * Math.sin(theta),
  };
}

export const PLANET_WORLDS: Planet[] = [
  // 1. Mercury: Moral Education (D-01)
  {
    id: "mercury-moral",
    order: 1,
    celestialBody: "Mercury",
    celestialBodyMs: "Utarid",
    subjectId: "moral",
    subjectTitle: "Pendidikan Moral",
    subjectTitleMs: "Pendidikan Moral",
    themeColor: "#64748B", // Charcoal Basalt
    accentColor: "#A855F7", // Electric Violet Glow
    textureType: "shader",
    tagline: "Sun-scorched basalt craters forged in integrity, empathy, and courage.",
    taglineMs: "Kawah basalt membina keteguhan integriti, empati dan keperibadian mulia.",
    orbitalPeriodDays: 87.97,
    diameterKm: 4879,
    features: [
      {
        id: "borealis-planitia",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        name: "Borealis Planitia (Northern Volcanic Plains)",
        nameMs: "Dataran Borealis",
        coordinates: {
          lat: 73.0,
          lon: -80.0,
          radiusDeg: 15.0,
          elevation: "-1.5 km to -2.0 km",
        },
        badge: "Kindness & Peer Respect",
        badgeMs: "Kasih Sayang & Menghormati Rakan",
        description: "Prompts for kindness, mutual assistance, honesty, and empathy among classmates.",
        descriptionMs: "Arahan untuk menyemai kasih sayang, tolong-menolong, kejujuran dan empati sesama rakan.",
        geologicalProfile: "Vast smooth volcanic expanse encircling the north polar region, buried under flood basalt sheets.",
        geologicalProfileMs: "Dataran gunung berapi luas melingkari kutub utara yang dilitupi lapisan lava basalt tebal.",
        accentColor: "#A855F7",
      },
      {
        id: "rembrandt-basin",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        name: "Rembrandt Basin",
        nameMs: "Lembah Rembrandt",
        coordinates: {
          lat: -33.2,
          lon: 88.2,
          radiusDeg: 12.0,
          elevation: "-2.0 km",
        },
        badge: "Family Harmony & Responsibility",
        badgeMs: "Keharmonian Keluarga & Tanggungjawab",
        description: "Prompts exploring family harmony, respecting elders, and fair cooperation in daily life.",
        descriptionMs: "Arahan meneroka keharmonian keluarga, menghormati orang tua dan kerjasama adil dalam kehidupan.",
        geologicalProfile: "The second-largest well-preserved impact basin on Mercury, displaying radial wrinkle ridges and extensional troughs.",
        geologicalProfileMs: "Lembangan impak kedua terbesar yang terpelihara baik di Utarid dengan rekahan mampatan dan jurang penyejukan.",
        accentColor: "#A855F7",
      },
      {
        id: "beethoven-basin",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        name: "Beethoven Basin",
        nameMs: "Lembah Beethoven",
        coordinates: {
          lat: -20.8,
          lon: -123.6,
          radiusDeg: 11.0,
          elevation: "-1.8 km",
        },
        badge: "Community Hygiene & Civic Care",
        badgeMs: "Kebersihan Komuniti & Sayangi Sekolah",
        description: "Prompts instilling responsibility toward school cleanliness, public spaces, and community care.",
        descriptionMs: "Arahan menanam tanggungjawab menjaga kebersihan sekolah, kemudahan awam dan masyarakat.",
        geologicalProfile: "Ancient multi-ring impact basin heavily pitted by secondary cratering, preserving intermediate cratering age history.",
        geologicalProfileMs: "Lembangan impak berbilang cincin purba yang merekodkan sejarah peralihan pembentukan kawah Utarid.",
        accentColor: "#A855F7",
      },
      {
        id: "rachmaninoff-basin",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        name: "Rachmaninoff Basin",
        nameMs: "Lembah Rachmaninoff",
        coordinates: {
          lat: 27.6,
          lon: 57.6,
          radiusDeg: 8.0,
          elevation: "-5.0 km",
        },
        badge: "Multicultural Respect & Neighborliness",
        badgeMs: "Menghargai Jiran & Kepelbagaian Budaya",
        description: "Prompts encouraging appreciation of Malaysia's multicultural heritage, traditions, and supportive neighbors.",
        descriptionMs: "Arahan memupuk penghargaan warisan pelbagai kaum Malaysia, perayaan dan semangat kejiranan erat.",
        geologicalProfile: "Striking double-ring basin with an inner peak ring and one of the lowest volcanic floor elevations on Mercury.",
        geologicalProfileMs: "Lembangan dua cincin menonjol dengan aras lantai gunung berapi terdalam di planet Utarid.",
        accentColor: "#A855F7",
      },
      {
        id: "raditladi-basin",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        name: "Raditladi Basin",
        nameMs: "Lembah Raditladi",
        coordinates: {
          lat: 27.3,
          lon: 119.1,
          radiusDeg: 7.0,
          elevation: "-1.2 km",
        },
        badge: "Moral Courage & Digital Ethics",
        badgeMs: "Keberanian Menolak Kezaliman & Etika Digital",
        description: "Prompts analyzing moral courage, constructive conflict resolution, cyberbullying prevention, and digital ethics.",
        descriptionMs: "Arahan menilai keberanian menegakkan kebenaran, penyelesaian konflik damai dan etika berhemah di dunia digital.",
        geologicalProfile: "Pristine, relatively young impact basin hosting extensional grabens and unusual shallow, rimless hollows.",
        geologicalProfileMs: "Lembangan muda berkeadaan asli dengan jaringan jurang sesar dan lubang lekukan tanpa tebing yang unik.",
        accentColor: "#A855F7",
      },
      {
        id: "antipodal-weird-terrain",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        name: "The Antipodal Chaotic Terrain",
        nameMs: "Bentuk Muka Bumi Antipodal",
        coordinates: {
          lat: -30.0,
          lon: 20.0,
          radiusDeg: 14.0,
          elevation: "Disrupted hilly massifs",
        },
        badge: "Patriotism, Unity & Tolerance",
        badgeMs: "Toleransi, Perpaduan & Patriotik",
        description: "Prompts for national unity, cross-cultural tolerance, democratic participation, and patriotic pride.",
        descriptionMs: "Arahan untuk perpaduan nasional, toleransi antara budaya, peranan sivik dan kebanggaan sebagai warga Malaysia.",
        geologicalProfile: "Disrupted hills and broken massifs formed when seismic shockwaves from the Caloris impact shattered the opposite crust.",
        geologicalProfileMs: "Kawasan berbukit patah dan tanah bercelaru akibat tumpuan gelombang seismik hentaman gergasi Caloris di hemisfera bertentangan.",
        accentColor: "#A855F7",
      },
      {
        id: "caloris-planitia",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        name: "Caloris Planitia (The Caloris Basin)",
        nameMs: "Lembangan Caloris",
        coordinates: {
          lat: 30.5,
          lon: -160.2,
          radiusDeg: 25.0,
          elevation: "-2.5 km (rims up to +2.0 km)",
        },
        badge: "Capstone Boss: Civic Leadership & Integrity",
        badgeMs: "Cabaran Unggul: Kepimpinan Sivik & Integriti",
        description: "Capstone boss arena: Synthesize comprehensive moral reasoning, ethical leadership dilemmas, and national integrity.",
        descriptionMs: "Arena bos terakhir: Menggabungkan penaakulan moral berstruktur, dilema kepimpinan etika dan integriti peribadi terpuji.",
        geologicalProfile: "Mercury's titanic 1,550 km multi-ring impact basin rimmed by 2 km mountains and fractured by Pantheon Fossae spiderweb grabens.",
        geologicalProfileMs: "Lembangan impak raksasa 1,550 km dilingkungi gunung berketinggian 2 km dan retakan sawang Pantheon Fossae.",
        accentColor: "#F43F5E",
      },
    ],
  },

  // 2. Venus: Mathematics (D-01)
  {
    id: "venus-matematik",
    order: 2,
    celestialBody: "Venus",
    celestialBodyMs: "Zuhrah",
    subjectId: "matematik",
    subjectTitle: "Mathematics",
    subjectTitleMs: "Matematik",
    themeColor: "#F59E0B", // Sulfur Amber
    accentColor: "#FBBF24", // Golden Shroud
    textureType: "shader",
    tagline: "Golden clouds concealing geometric order and numerical logic.",
    taglineMs: "Kabut keemasan merungkai ketertiban logik dan kejituan nombor.",
    orbitalPeriodDays: 224.7,
    diameterKm: 12104,
    features: [
      {
        id: "sedna-planitia",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        name: "Sedna Planitia (Volcanic Channel Plain)",
        nameMs: "Dataran Sedna",
        coordinates: {
          lat: 40.0,
          lon: -20.0,
          radiusDeg: 14.0,
          elevation: "-0.5 km",
        },
        badge: "Numbers to 100 & Basic Operations",
        badgeMs: "Nombor hingga 100 & Operasi Asas",
        description: "Prompts guiding number recognition up to 100, place values, basic addition, and subtraction word problems.",
        descriptionMs: "Arahan membimbing pengenalan nombor hingga 100, nilai tempat, serta penyelesaian masalah tambah dan tolak asas.",
        geologicalProfile: "Smooth volcanic lowland carved by thermal-erosion lava rivers (canali) stretching across radar-smooth basalt flows.",
        geologicalProfileMs: "Dataran lahar rata yang diukir oleh sungai lava terma (canali) merentasi hamparan basalt luas.",
        accentColor: "#FBBF24",
      },
      {
        id: "atalanta-planitia",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        name: "Atalanta Planitia (Deep Lowland Basin)",
        nameMs: "Dataran Atalanta",
        coordinates: {
          lat: 56.0,
          lon: 165.0,
          radiusDeg: 18.0,
          elevation: "-1.5 km",
        },
        badge: "Multiplication, Division & Fractions",
        badgeMs: "Darab, Bahagi & Pecahan Wajar",
        description: "Prompts for basic multiplication tables, equal sharing division, proper fractions, and money up to RM100.",
        descriptionMs: "Arahan menguasai sifir darab asas, bahagi perkongsian sama rata, pecahan wajar dan pengiraan wang hingga RM100.",
        geologicalProfile: "One of the deepest circular lowland volcanic basins on Venus, formed by large-scale crustal downwelling.",
        geologicalProfileMs: "Salah satu lembangan lahar pekeliling terdalam di Zuhrah hasil penurunan kerak berskala besar.",
        accentColor: "#FBBF24",
      },
      {
        id: "aphrodite-terra",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        name: "Aphrodite Terra (Equatorial Highland)",
        nameMs: "Aphrodite Terra",
        coordinates: {
          lat: -6.0,
          lon: 110.0,
          radiusDeg: 26.0,
          elevation: "+3.0 km to +5.0 km",
        },
        badge: "Numbers to 10,000, Time & Measurement",
        badgeMs: "Nombor hingga 10,000 & Wang RM10,000",
        description: "Prompts for numbers up to 10,000, money up to RM10,000, hours/minutes duration, and mass/volume units.",
        descriptionMs: "Arahan bagi nombor hingga 10,000, transaksi wang hingga RM10,000, tempoh masa jam/minit dan unit timbangan.",
        geologicalProfile: "Venus's largest continent-sized highland stretching along the equator, composed of folded tesserae and extensional rifts.",
        geologicalProfileMs: "Benua tanah tinggi terbesar Zuhrah merentasi khatulistiwa dengan lipatan tessera purba dan rekahan ngarai terbelah.",
        accentColor: "#FBBF24",
      },
      {
        id: "beta-regio",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        name: "Beta Regio (Volcanic Rise & Rift)",
        nameMs: "Beta Regio",
        coordinates: {
          lat: 25.3,
          lon: -78.0,
          radiusDeg: 13.0,
          elevation: "+5.0 km",
        },
        badge: "Decimals, Percentages & Angles",
        badgeMs: "Perpuluhan, Peratusan & Ruang Sudut",
        description: "Prompts mastering decimals to hundredths, percentages, line angles, perimeter, and area calculation.",
        descriptionMs: "Arahan menguasai perpuluhan hingga dua tempat, peratusan, sudut garis, perimeter dan ukuran luas poligon.",
        geologicalProfile: "Prominent volcanic rise driven by an underlying mantle plume, cleaved by the colossal Devana Chasma rift graben.",
        geologicalProfileMs: "Kawasan kenaikan gunung berapi hasil plume mantel yang dibelah oleh rekahan ngarai jurang Devana Chasma.",
        accentColor: "#FBBF24",
      },
      {
        id: "lada-terra",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        name: "Lada Terra (Southern Coronae Highlands)",
        nameMs: "Lada Terra",
        coordinates: {
          lat: -62.0,
          lon: 20.0,
          radiusDeg: 17.0,
          elevation: "+2.0 km to +3.5 km",
        },
        badge: "Mixed Operations, Ratios & Coordinates",
        badgeMs: "Operasi Bergabung, Nisbah & Koordinat",
        description: "Prompts solving mixed BODMAS arithmetic, ratio comparisons, coordinate grid plotting, and volume of solids.",
        descriptionMs: "Arahan menyelesaikan operasi bergabung, perbandingan nisbah, pemetaan satah koordinat dan isi padu bentuk pepejal.",
        geologicalProfile: "Southern highland province characterized by vast flood volcanism and immense circular coronae collapses.",
        geologicalProfileMs: "Kawasan tanah tinggi selatan dengan aliran lava banjir luas dan kelompok korona bulat akibat tekanan mantel.",
        accentColor: "#FBBF24",
      },
      {
        id: "ishtar-terra",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        name: "Ishtar Terra (Lakshmi Highland Plateau)",
        nameMs: "Ishtar Terra",
        coordinates: {
          lat: 70.0,
          lon: 25.0,
          radiusDeg: 19.0,
          elevation: "+3.5 km to +4.0 km",
        },
        badge: "Data Representation & Financial Literacy",
        badgeMs: "Pengendalian Data & Celik Kewangan",
        description: "Prompts interpreting pie charts, probability likelihood, profit/loss calculations, and budget planning.",
        descriptionMs: "Arahan mentafsir carta pai, kebolehjadian, perakaunan untung/rugi, dividen, dan perancangan belanjawan cermat.",
        geologicalProfile: "Vast northern highland plateau the size of Australia, centered on the volcanic plateau Lakshmi Planum.",
        geologicalProfileMs: "Tanah tinggi utara bersaiz benua Australia yang menempatkan dataran gunung berapi bertingkat Lakshmi Planum.",
        accentColor: "#FBBF24",
      },
      {
        id: "maxwell-montes",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        name: "Maxwell Montes (Venusian Apex)",
        nameMs: "Pergunungan Maxwell",
        coordinates: {
          lat: 65.2,
          lon: 3.3,
          radiusDeg: 8.0,
          elevation: "+11.0 km (Highest Peak on Venus)",
        },
        badge: "Capstone Boss: KBAT Mathematical Mastery",
        badgeMs: "Cabaran Unggul: Penyelesaian Masalah KBAT",
        description: "Capstone boss arena: Complex multi-step KBAT mathematical word problems combining algebra, geometry, and finance.",
        descriptionMs: "Arena bos terakhir: Masalah bukan rutin KBAT berbilang langkah menggabungkan algebra, geometri dan pengurusan wang.",
        geologicalProfile: "Towering mountain range rising 11 km above mean radius, the tallest point on Venus coated with metallic pyrite snow.",
        geologicalProfileMs: "Banjaran pergunungan tertinggi di Zuhrah berketinggian 11 km yang diselaputi debu mineral berlogam berkilat.",
        accentColor: "#EF4444",
      },
    ],
  },

  // 3. Earth: Foundational Prompting (D-01)
  {
    id: "earth-prompting",
    order: 3,
    celestialBody: "Earth",
    celestialBodyMs: "Bumi",
    subjectId: "prompting",
    subjectTitle: "Foundational Prompting",
    subjectTitleMs: "Asas Prompting",
    themeColor: "#10B981", // Verdant Green
    accentColor: "#3B82F6", // Atmospheric Blue
    textureType: "shader",
    tagline: "The cradle of intelligence and prompt crafting mastery.",
    taglineMs: "Pusat kecerdasan dan penguasaan teknik binaan arahan AI.",
    orbitalPeriodDays: 365.25,
    diameterKm: 12742,
    features: [
      {
        id: "africa-cradle",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        name: "Africa (The Rift Cradle)",
        nameMs: "Afrika (Lembah Rekahan)",
        coordinates: {
          lat: 2.0,
          lon: 21.0,
          radiusDeg: 28.0,
          elevation: "+5,895m (Kilimanjaro) / -155m (Lake Assal)",
        },
        badge: "Clarity & Clear Intent",
        badgeMs: "Kejelasan Arahan Asas",
        description: "Foundational prompts focusing on simple, direct instructions without confusing ambiguities.",
        descriptionMs: "Arahan asas yang menekankan kejelasan, matlamat tepat dan ayat langsung tanpa kekeliruan.",
        geologicalProfile: "Second largest continent, dominated by the Great Rift Valley, vast central basins, and ancient continental shields.",
        geologicalProfileMs: "Benua kedua terbesar dengan Lembah Rekahan Besar, lembangan sungai luas dan perisai geologi purba.",
        accentColor: "#3B82F6",
      },
      {
        id: "asia-himalayas",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        name: "Asia (Himalayan Crown)",
        nameMs: "Asia (Kemuncak Himalaya)",
        coordinates: {
          lat: 34.0,
          lon: 95.0,
          radiusDeg: 32.0,
          elevation: "+8,848m (Everest) / -428m (Dead Sea)",
        },
        badge: "Context & Wh-Details",
        badgeMs: "Konteks & Butiran Lengkap",
        description: "Prompts specifying who, what, when, where, and why to deliver rich, targeted AI responses.",
        descriptionMs: "Arahan mengandungi siapa, apa, bila, di mana dan mengapa untuk menghasilkan jawapan AI yang tepat.",
        geologicalProfile: "Most massive continental mass, hosting Earth's highest orogenies and sprawling alluvial plains.",
        geologicalProfileMs: "Jisim daratan terbesar di Bumi yang menempatkan banjaran gunung tertinggi dan lembah aluvium subur.",
        accentColor: "#3B82F6",
      },
      {
        id: "europe-peninsula",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        name: "Europe (Peninsula of Knowledge)",
        nameMs: "Eropah (Semenanjung Ilmu)",
        coordinates: {
          lat: 53.0,
          lon: 18.0,
          radiusDeg: 20.0,
          elevation: "+5,642m (Elbrus) / -28m (Caspian Sea)",
        },
        badge: "Tone, Audience & Modifiers",
        badgeMs: "Nada, Sasaran & Gaya Bahasa",
        description: "Prompts tailoring tone (friendly, formal, adventurous) and selecting appropriate target audiences.",
        descriptionMs: "Arahan menyesuaikan nada (mesra, rasmi, pengembaraan) dan menentukan audiens sasaran yang tepat.",
        geologicalProfile: "Western peninsula of Eurasia bounded by the Atlantic Ocean, Arctic Ocean, and Alpine mountain chains.",
        geologicalProfileMs: "Semenanjung barat Eurasia yang disempadankan oleh Lautan Atlantik, Artik dan banjaran Alpine.",
        accentColor: "#3B82F6",
      },
      {
        id: "north-america-canyons",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        name: "North America (Great Basin & Plains)",
        nameMs: "Amerika Utara (Lembah & Dataran)",
        coordinates: {
          lat: 44.0,
          lon: -100.0,
          radiusDeg: 26.0,
          elevation: "+6,190m (Denali) / -86m (Death Valley)",
        },
        badge: "Role-Play & Persona Crafting",
        badgeMs: "Peranan Watak & Persona AI",
        description: "Prompts instructing AI to adopt specialized personas (e.g., historical explorer, robot guide, nature scientist).",
        descriptionMs: "Arahan menetapkan persona khusus (peneroka sejarah, robot pemandu, pakar hidupan liar) bagi menjana dialog hidup.",
        geologicalProfile: "Expansive continent stretching from the Canadian Arctic shield across central plains to western Cordillera ranges.",
        geologicalProfileMs: "Benua luas merangkumi perisai Artik Kanada, dataran luas tengah sehingga banjaran Cordillera barat.",
        accentColor: "#3B82F6",
      },
      {
        id: "south-america-amazon",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        name: "South America (Amazonia & Andes)",
        nameMs: "Amerika Selatan (Amazonia & Andes)",
        coordinates: {
          lat: -14.0,
          lon: -58.0,
          radiusDeg: 24.0,
          elevation: "+6,961m (Aconcagua) / -105m (Laguna del Carbón)",
        },
        badge: "Multi-Step & Output Formatting",
        badgeMs: "Langkah Berperingkat & Format",
        description: "Prompts chaining multi-step reasoning, constraints, bullet points, tables, and structured summaries.",
        descriptionMs: "Arahan berantai pelbagai langkah, kawalan syarat, format senarai bernombor, jadual dan rumusan padat.",
        geologicalProfile: "Dominated by the continuous Andes cordillera along the west and the massive Amazon drainage basin to the east.",
        geologicalProfileMs: "Dikuasai oleh banjaran gunung Andes yang panjang di barat serta lembangan saliran Sungai Amazon di timur.",
        accentColor: "#3B82F6",
      },
      {
        id: "oceania-archipelago",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        name: "Australia & Oceania (Great Barrier Terrane)",
        nameMs: "Oceania & Australia (Terumbu Karang)",
        coordinates: {
          lat: -24.0,
          lon: 134.0,
          radiusDeg: 22.0,
          elevation: "+2,228m (Kosciuszko) / -15m (Lake Eyre)",
        },
        badge: "Critical Evaluation & Iteration",
        badgeMs: "Penilaian Kritis & Pembetulan",
        description: "Prompts testing edge cases, spotting AI hallucinations, verifying facts, and refining iterative responses.",
        descriptionMs: "Arahan menguji kesilapan fakta, menyemak halusinasi AI, membetulkan jawapan serta menggilap draf berulang kali.",
        geologicalProfile: "The oldest and flattest continental landmass on Earth, surrounded by coral archipelagos and ancient cratons.",
        geologicalProfileMs: "Daratan benua tertua dan paling rata di Bumi dilingkungi kepulauan batu karang dan kraton kuno.",
        accentColor: "#3B82F6",
      },
      {
        id: "antarctica-apex",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        name: "Antarctica (The Polar Ice Cap)",
        nameMs: "Antartika (Kutub Ais Abadi)",
        coordinates: {
          lat: -82.0,
          lon: 0.0,
          radiusDeg: 20.0,
          elevation: "+4,892m (Vinson) / -50m (Deep Lake)",
        },
        badge: "Capstone Boss: Master Prompting Arena",
        badgeMs: "Cabaran Unggul: Arena Mahaguru Prompting",
        description: "Capstone boss arena: Design end-to-end multi-agent prompts combining persona, rich context, formatting, and iterative refinement.",
        descriptionMs: "Arena bos terakhir: Mencipta arahan lengkap berstandard tinggi merangkumi watak persona, konteks mantap dan kawalan kualiti jitu.",
        geologicalProfile: "Earth's southernmost continent encapsulated by a massive ice sheet holding 70% of the world's fresh water.",
        geologicalProfileMs: "Benua paling selatan di Bumi dilitupi lapisan ais abadi yang menyimpan 70% bekalan air tawar dunia.",
        accentColor: "#F43F5E",
      },
    ],
  },

  // 4. Moon: Bahasa Melayu (D-01)
  {
    id: "moon-bm",
    order: 4,
    celestialBody: "Moon",
    celestialBodyMs: "Bulan",
    subjectId: "bm",
    subjectTitle: "Bahasa Melayu",
    subjectTitleMs: "Bahasa Melayu",
    themeColor: "#94A3B8", // Slate / Silver lunar crust
    accentColor: "#38BDF8", // Cyan / Sky Glow
    textureType: "shader",
    tagline: "Ancient volcanic maria inspiring eloquence and rich Malay prose.",
    taglineMs: "Lautan lava purba menyemarakkan keindahan bahasa dan sastera Melayu.",
    orbitalPeriodDays: 27.32,
    diameterKm: 3474,
    features: [
      {
        id: "oceanus-procellarum",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        name: "Oceanus Procellarum (The Western Ocean)",
        nameMs: "Lautan Procellarum",
        coordinates: {
          lat: 10.0,
          lon: -50.0,
          radiusDeg: 22.0,
          elevation: "-1.0 km to -2.0 km",
        },
        badge: "Kata Nama & Kata Kerja Asas",
        badgeMs: "Kata Nama & Kata Kerja Asas",
        description: "Prompts identifying concrete nouns, active verbs, and constructing basic subject-verb-object sentences.",
        descriptionMs: "Arahan mengenal pasti kata nama am/khas, kata kerja perbuatan dan membina ayat tunggal mudah.",
        geologicalProfile: "Vast irregular volcanic plain dominating the western edge of the lunar near side, spanning over 2,500 km.",
        geologicalProfileMs: "Dataran gunung berapi terbesar di sisi dekat bulan dengan kepanjangan melebihi 2,500 km.",
        accentColor: "#38BDF8",
      },
      {
        id: "imbrium-basin",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        name: "The Imbrium Basin",
        nameMs: "Lembah Imbrium",
        coordinates: {
          lat: 35.0,
          lon: -15.0,
          radiusDeg: 16.0,
          elevation: "-2.0 km to -3.0 km",
        },
        badge: "Kata Adjektif & Kembangan Ayat",
        badgeMs: "Kata Adjektif & Kembangan Ayat",
        description: "Prompts enhancing descriptive vocabulary with color, shape, and sensory adjectives to expand compound sentences.",
        descriptionMs: "Arahan meluaskan kosa kata sifat (warna, bentuk, pancaindera) bagi membina ayat majmuk deskriptif.",
        geologicalProfile: "Massive circular impact basin ringed by the Montes Apenninus mountains rising higher than terrestrial peaks.",
        geologicalProfileMs: "Lembangan impak pekeliling luas yang dikelilingi banjaran pergunungan Montes Apenninus yang curam.",
        accentColor: "#38BDF8",
      },
      {
        id: "eastern-maria",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        name: "Eastern Maria (Tranquility Cluster)",
        nameMs: "Laut Ketenangan (Maria Timur)",
        coordinates: {
          lat: 10.0,
          lon: 30.0,
          radiusDeg: 18.0,
          elevation: "-1.5 km",
        },
        badge: "Soalan Pemahaman & Imbuhan",
        badgeMs: "Soalan Pemahaman & Imbuhan",
        description: "Prompts mastering reading comprehension answers, question words, and prefix/suffix affixation (imbuhan awalan/akhiran).",
        descriptionMs: "Arahan menguasai teknik menjawab soalan pemahaman, kata tanya dan pengimbuhan kata dasar secara tepat.",
        geologicalProfile: "Interconnected dark basaltic plains on the lunar eastern limb, including Mare Tranquillitatis and Serenitatis.",
        geologicalProfileMs: "Jaringan dataran basalt gelap di bahagian timur bulan termasuk Laut Ketenangan dan Laut Kejernihan.",
        accentColor: "#38BDF8",
      },
      {
        id: "near-side-highlands",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        name: "Near-Side Southern Highlands",
        nameMs: "Tanah Tinggi Sisi Dekat",
        coordinates: {
          lat: -40.0,
          lon: 0.0,
          radiusDeg: 20.0,
          elevation: "+1.5 km to +3.0 km",
        },
        badge: "Format Surat & Dialog Temubual",
        badgeMs: "Format Surat & Dialog Temubual",
        description: "Prompts formatting formal/informal letters, structured interviews, email correspondence, and polite dialogues.",
        descriptionMs: "Arahan mengarang surat kiriman rasmi/tidak rasmi, catatan harian, dialog temuramah dan emel berformat.",
        geologicalProfile: "Rugged ancient crust taking up the southern near side, illuminated by the brilliant ray system of Tycho crater.",
        geologicalProfileMs: "Kerak purba berbatu cerah yang berkedut di selatan sisi dekat, diterangi jalur sinaran kawah Tycho.",
        accentColor: "#38BDF8",
      },
      {
        id: "far-side-highlands",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        name: "Far-Side Highlands (Feldspathic Terrane)",
        nameMs: "Tanah Tinggi Sisi Jauh",
        coordinates: {
          lat: 0.0,
          lon: 180.0,
          radiusDeg: 28.0,
          elevation: "+2.0 km to +5.0 km",
        },
        badge: "Karangan Kreatif, Peribahasa & Pantun",
        badgeMs: "Karangan Kreatif, Peribahasa & Pantun",
        description: "Prompts exploring creative stories, contextual proverbs (peribahasa), metaphors, and traditional 4-line pantun poetry.",
        descriptionMs: "Arahan menulis cerita imaginatif, penerapan peribahasa secara kontekstual, bahasa berirama dan pantun empat kerat.",
        geologicalProfile: "Thick continuous feldspathic crust almost completely lacking dark maria, characterized by dense overlapping craters.",
        geologicalProfileMs: "Kerak tebal anortositik di sebelah belakang bulan tanpa dataran laut gelap, dipenuhi pertindihan kawah padat.",
        accentColor: "#38BDF8",
      },
      {
        id: "near-side-north-highlands",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        name: "Near-Side Northern Highlands",
        nameMs: "Tanah Tinggi Utara Sisi Dekat",
        coordinates: {
          lat: 60.0,
          lon: 0.0,
          radiusDeg: 16.0,
          elevation: "+1.0 km to +2.5 km",
        },
        badge: "Ulasan Kritis & Wacana Tatabahasa",
        badgeMs: "Ulasan Kritis & Wacana Tatabahasa",
        description: "Prompts writing objective analysis based on stimulus graphics, cohesive linkers (penanda wacana), and critical reviews.",
        descriptionMs: "Arahan membina ulasan berpandukan bahan rangsangan, penanda wacana bertaut, dan hujah tatabahasa kritis.",
        geologicalProfile: "Degraded band of ancient highland crust separating the northern maria from the Moon's icy northern polar traps.",
        geologicalProfileMs: "Jalur tanah tinggi purba yang memisahkan lautan utara dengan zon perangkap berais di kutub utara bulan.",
        accentColor: "#38BDF8",
      },
      {
        id: "south-pole-aitken",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        name: "South Pole-Aitken Basin",
        nameMs: "Lembangan Kutub Selatan-Aitken",
        coordinates: {
          lat: -50.0,
          lon: 180.0,
          radiusDeg: 24.0,
          elevation: "-6.0 km to -8.0 km (Deepest Basin)",
        },
        badge: "Capstone Boss: Karangan Lengkap & KBAT",
        badgeMs: "Cabaran Unggul: Karangan Lengkap & KBAT",
        description: "Capstone boss arena: Master Year 6 UPSA prompt compositions, persuasive opinion essays, and high-order critical reasoning.",
        descriptionMs: "Arena bos terakhir: Mengarang esei karangan fakta penuh bertaraf UPSA, perbahasan matang dan pemikiran KBAT bernilai murni.",
        geologicalProfile: "Titanic 2,500 km wide impact basin, the oldest and deepest in the solar system, excavating lower crust and lunar mantle rocks.",
        geologicalProfileMs: "Lembangan impak gergasi selebar 2,500 km dan sedalam 8 km yang mendedahkan batuan mantel dalam bulan.",
        accentColor: "#EF4444",
      },
    ],
  },

  // 5. Mars: English Language (D-01)
  {
    id: "mars-english",
    order: 5,
    celestialBody: "Mars",
    celestialBodyMs: "Marikh",
    subjectId: "english",
    subjectTitle: "English Language",
    subjectTitleMs: "Bahasa Inggeris",
    themeColor: "#EF4444", // Rust Red
    accentColor: "#F97316", // Vibrant Orange
    textureType: "shader",
    tagline: "Vast canyons and soaring volcanoes fueling bold English expression.",
    taglineMs: "Lembah raksasa membina keyakinan bertutur dan berkarya dalam bahasa Inggeris.",
    orbitalPeriodDays: 686.98,
    diameterKm: 6779,
    features: [
      {
        id: "elysium-planitia",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        name: "Elysium Planitia (Eastern Volcanic Plains)",
        nameMs: "Dataran Elysium",
        coordinates: {
          lat: 25.0,
          lon: 147.0,
          radiusDeg: 12.0,
          elevation: "+2.0 km",
        },
        badge: "Phonics, Greetings & Classroom Words",
        badgeMs: "Fonik, Ucapan & Objek Bilik Darjah",
        description: "Prompts practicing phonics sounds, simple polite greetings, colors, classroom objects, and guided word repetition.",
        descriptionMs: "Arahan melatih sebutan fonik asas, ucapan santun, warna, alatan bilik darjah dan perkataan mudah berulang.",
        geologicalProfile: "Mars's second-largest volcanic province, crowned by Elysium Mons and smooth young flood-basalt plains.",
        geologicalProfileMs: "Wilayah gunung berapi kedua terbesar di Marikh yang dikelilingi dataran aliran lava muda Cerberus.",
        accentColor: "#F97316",
      },
      {
        id: "valles-marineris",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        name: "Valles Marineris (The Grand Chasm)",
        nameMs: "Lembah Marineris",
        coordinates: {
          lat: -14.0,
          lon: -70.0,
          radiusDeg: 16.0,
          elevation: "-7.0 km (Deep Canyon System)",
        },
        badge: "Daily Routines & Storytelling",
        badgeMs: "Rutin Harian & Penceritaan Mudah",
        description: "Prompts describing morning routines, family hobbies, animal habitats, and composing simple chronological stories.",
        descriptionMs: "Arahan menerangkan rutin harian, hobi keluarga, habitat haiwan dan membina jalinan cerita pendek teratur.",
        geologicalProfile: "The largest canyon system in the Solar System, slicing across the Martian equator for over 4,000 km.",
        geologicalProfileMs: "Sistem gaung terpanjang dalam Sistem Suria merentasi 4,000 km di sepanjang khatulistiwa Marikh.",
        accentColor: "#F97316",
      },
      {
        id: "syrtis-major",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        name: "Syrtis Major Planum (Basaltic Shield)",
        nameMs: "Dataran Syrtis Major",
        coordinates: {
          lat: 9.9,
          lon: 70.0,
          radiusDeg: 14.0,
          elevation: "+1.0 km",
        },
        badge: "Question Words, Weather & Animals",
        badgeMs: "Kata Soalan, Cuaca & Haiwan",
        description: "Prompts formulating questions with 5W1H, describing changing weather conditions, and comparing animal characteristics.",
        descriptionMs: "Arahan membina soalan berasaskan kata tanya, memerihalkan cuaca dan membandingkan ciri hidupan liar.",
        geologicalProfile: "A dark low-relief volcanic shield plain stripped of dust by winds, exposing pristine pyroxene basalt rock.",
        geologicalProfileMs: "Dataran perisai gunung berapi gelap yang disapu angin kuat, mendedahkan batuan basalt bebas debu.",
        accentColor: "#F97316",
      },
      {
        id: "hellas-planitia",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        name: "Hellas Planitia (Hellas Impact Basin)",
        nameMs: "Lembangan Hellas Planitia",
        coordinates: {
          lat: -42.5,
          lon: 70.0,
          radiusDeg: 14.0,
          elevation: "-7.15 km (Lowest Elevation on Mars)",
        },
        badge: "Past & Future Tenses, Role-Plays",
        badgeMs: "Tatabahasa Masa & Lakonan Watak",
        description: "Prompts applying past simple tense for holiday trips, future 'going to' plans, and simulated conversational interviews.",
        descriptionMs: "Arahan mengaplikasikan waktu lampau untuk percutian, rancangan masa depan dan skrip temu bual perbualan.",
        geologicalProfile: "Giant elliptical impact basin spanning 2,300 km in the southern highlands, often blanketed in frost and dust hazes.",
        geologicalProfileMs: "Lembangan impak elips gergasi 2,300 km di tanah tinggi selatan yang kerap dilitupi kabus fros dan ribut debu.",
        accentColor: "#F97316",
      },
      {
        id: "tharsis-rise",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        name: "Tharsis Rise (The Great Volcanic Bulge)",
        nameMs: "Dataran Tinggi Tharsis",
        coordinates: {
          lat: 0.0,
          lon: -110.0,
          radiusDeg: 24.0,
          elevation: "+10.0 km",
        },
        badge: "Environmental Prompts & Persuasive Talks",
        badgeMs: "Isu Alam Sekitar & Pengucapan Awam",
        description: "Prompts advocating eco-friendly practices, conservation speeches, persuasive opinion pieces, and formal email requests.",
        descriptionMs: "Arahan menulis pidato pemeliharaan alam sekitar, karangan memujuk dan surat rasmi memohon maklumat.",
        geologicalProfile: "Continent-sized volcanic swell elevated up to 10 km, hosting the three giant Tharsis Montes shield volcanoes.",
        geologicalProfileMs: "Kawasan perisai benua membengkak setinggi 10 km yang menempatkan gugusan tiga gunung berapi gergasi Tharsis Montes.",
        accentColor: "#F97316",
      },
      {
        id: "arabia-terra",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        name: "Arabia Terra Highlands",
        nameMs: "Tanah Tinggi Arabia Terra",
        coordinates: {
          lat: 20.0,
          lon: 30.0,
          radiusDeg: 18.0,
          elevation: "+1.5 km to +3.0 km",
        },
        badge: "Figurative Language, Idioms & Debates",
        badgeMs: "Bahasa Kiasan, Idiom & Perbahasan",
        description: "Prompts utilizing English idioms, similes, metaphors, balanced argument essays, and structured debate outlines.",
        descriptionMs: "Arahan memanfaatkan simpulan bahasa Inggeris, metafora, penulisan karangan perbincangan dua pihak dan format debat.",
        geologicalProfile: "Ancient, densely cratered upland region representing some of the oldest Noachian crust and supervolcano calderas.",
        geologicalProfileMs: "Wilayah tanah tinggi berkawah purba yang memelihara kerak Noachian tertua serta kaldera supergunung berapi.",
        accentColor: "#F97316",
      },
      {
        id: "olympus-mons",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        name: "Olympus Mons (The Solar System's Tallest Volcano)",
        nameMs: "Gunung Olympus Mons",
        coordinates: {
          lat: 18.65,
          lon: -133.8,
          radiusDeg: 6.5,
          elevation: "+21.9 km (Highest Volcano in Solar System)",
        },
        badge: "Capstone Boss: Advanced Essay & Dialogue Scripting",
        badgeMs: "Cabaran Unggul: Esei Lanjutan & Skrip Dialog",
        description: "Capstone boss arena: Comprehensive narrative writing, multi-speaker dialogue scripts, and critical discourse prompts.",
        descriptionMs: "Arena bos terakhir: Karangan naratif kreatif bertaraf tinggi, skrip dialog pelbagai watak dan wacana kritis menyeluruh.",
        geologicalProfile: "Colossal shield volcano rising 21.9 km above datum with an 8 km basal cliff and an 80 km summit caldera collapse.",
        geologicalProfileMs: "Gunung berapi perisai kolosal setinggi 21.9 km dengan tebing tegak 8 km dan kaldera puncak selebar 80 km.",
        accentColor: "#F43F5E",
      },
    ],
  },
];

/**
 * Helper to retrieve a Planet by its PlanetId.
 */
export function getPlanetWorld(id: string): Planet | undefined {
  return PLANET_WORLDS.find((planet) => planet.id === id);
}

/**
 * Returns a flat array of all 35 geological features across all planets.
 */
export function getAllPlanetFeatures(): PlanetFeature[] {
  return PLANET_WORLDS.flatMap((planet) => planet.features);
}

/**
 * Helper to retrieve a single feature by planetId and featureId slug.
 */
export function getFeatureBySlug(
  planetId: string,
  featureSlug: string
): PlanetFeature | undefined {
  const planet = getPlanetWorld(planetId);
  if (!planet) return undefined;
  return planet.features.find((feature) => feature.id === featureSlug);
}

/**
 * Helper to retrieve all 7 features of a specific planet.
 */
export function getFeaturesByPlanet(planetId: string): PlanetFeature[] {
  const planet = getPlanetWorld(planetId);
  return planet ? planet.features : [];
}

/**
 * Resolves destination route URL for feature missions (FLOW-02, D-06, T-11-03).
 * Mitigates open redirects by returning only strict, hardcoded internal routes.
 */
export function resolveMissionRoute(planetId: PlanetId | string, _feature?: PlanetFeature): string {
  switch (planetId) {
    case 'earth-prompting':
      return '/map';
    case 'moon-bm':
      return '/level/6-1-bm-kucing-peromfu';
    case 'venus-matematik':
      return '/level/8-1-matematik-tambah-bintang';
    case 'mars-english':
      return '/level/9-1-english-colorful-toys';
    case 'mercury-moral':
      return '/level/10-1-moral-sahabat-prihatin';
    default:
      return '/map';
  }
}
