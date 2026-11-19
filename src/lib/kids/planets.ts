/**
 * Planetary Subject Worlds & Cartographic Schema for Sekolah Prompt-Fu
 * Source: .planning/phases/09-planetary-schema-subject-alignment/09-CONTEXT.md
 */

export type SubjectId = "prompting" | "bm" | "english" | "matematik" | "moral" | "sains" | "sejarah" | "rbt" | "psv" | "astronomy";

export type CanonicalPlanetId =
  | "earth-prompting"
  | "moon-bm"
  | "mars-english"
  | "venus-matematik"
  | "mercury-moral"
  | "jupiter-sains"
  | "saturn-sejarah"
  | "uranus-rbt"
  | "neptune-psv";

export type LegacyPlanetId =
  | "jupiter-astronomy"
  | "saturn-astronomy"
  | "uranus-astronomy"
  | "neptune-astronomy";

export type PlanetId = CanonicalPlanetId | LegacyPlanetId;

export function normalizePlanetId(id: PlanetId | string): CanonicalPlanetId | string {
  switch (id) {
    case "jupiter-astronomy":
      return "jupiter-sains";
    case "saturn-astronomy":
      return "saturn-sejarah";
    case "uranus-astronomy":
      return "uranus-rbt";
    case "neptune-astronomy":
      return "neptune-psv";
    default:
      return id;
  }
}

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

  // Mission availability (E3 partial)
  hasMission?: boolean; // false indicates no mission available for this feature

  // Visual Theme
  accentColor?: string; // Feature-specific neon hotspot glow
}


export interface PlanetFieldNote {
  title: string;
  titleMs: string;
  note: string;
  noteMs: string;
}

export interface PlanetDistanceTelemetry {
  big: string;
  bigMs: string;
  small: string;
  smallMs: string;
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
  radiusKm: number;
  primaryFact: string;
  primaryFactMs: string;
  distanceFromSun: PlanetDistanceTelemetry;
  fieldNotes: PlanetFieldNote[];

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
    radiusKm: 2439.7,
    primaryFact: "The smallest planet, scarred by ancient impacts and only about 40% wider than our Moon.",
    primaryFactMs: "Planet terkecil dalam sistem suria kita, dipenuhi kawah purba dan hanya kira-kira 40% lebih lebar daripada Bulan kita.",
    distanceFromSun: {
      big: "58 million km",
      bigMs: "58 juta km",
      small: "from the Sun. Sunlight gets here in 3 minutes.",
      smallMs: "dari Matahari. Cahaya matahari tiba di sini dalam masa 3 minit.",
    },
    fieldNotes: [
      {
        title: "Fire and ice",
        titleMs: "Api dan ais",
        note: "Daytime reaches 430 °C and night drops to minus 180. Craters at the poles never see the Sun and very likely hold water ice.",
        noteMs: "Suhu waktu siang mencecah 430 °C dan malam merudum ke -180 °C. Kawah di kutubnya tidak pernah terkena cahaya matahari dan menakung ais air.",
      },
      {
        title: "Long days",
        titleMs: "Hari yang panjang",
        note: "A year here lasts 88 Earth days. One full day, sunrise to sunrise, lasts 176.",
        noteMs: "Satu tahun di Utarid berlangsung selama 88 hari Bumi, manakala satu hari penuh dari matahari terbit ke terbit memakan masa 176 hari Bumi.",
      },
    ],
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
    radiusKm: 6051.8,
    primaryFact: "Almost Earth's twin in diameter, wrapped in super-rotating sulfuric clouds above a surface hot enough to melt lead.",
    primaryFactMs: "Hampir sepadan dengan diameter Bumi, diselubungi awan asid sulfurik yang berputar pantas di atas permukaan yang cukup panas untuk meleburkan plumbum.",
    distanceFromSun: {
      big: "108 million km",
      bigMs: "108 juta km",
      small: "from the Sun. Six light-minutes.",
      smallMs: "dari Matahari. Enam minit perjalanan cahaya.",
    },
    fieldNotes: [
      {
        title: "Backwards",
        titleMs: "Putaran songsang",
        note: "Venus spins the opposite way to most planets, and so slowly that one full turn takes longer than its year.",
        noteMs: "Zuhrah berputar arah bertentangan daripada kebanyakan planet, dan sangat perlahan sehingga satu putaran penuh mengambil masa lebih lama daripada setahunnya.",
      },
      {
        title: "Pressure",
        titleMs: "Tekanan lampau",
        note: "The air at the surface presses 92 times harder than on Earth. Like standing 900 m under the sea.",
        noteMs: "Tekanan udara di permukaannya adalah 92 kali lebih kuat berbanding di Bumi—seperti menyelam 900 meter di dasar lautan.",
      },
    ],
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
    radiusKm: 6371,
    primaryFact: "Every person who has ever lived, every ocean, mountain and city. All of it rests under this paper-thin blue sky.",
    primaryFactMs: "Setiap insan yang pernah hidup, setiap lautan, gunung dan kota. Semuanya bersemadi di bawah langit biru yang senipis kertas ini.",
    distanceFromSun: {
      big: "150 million km",
      bigMs: "150 juta km",
      small: "from the Sun. Home, 8 light-minutes out.",
      smallMs: "dari Matahari. Rumah kita, 8 minit perjalanan cahaya.",
    },
    fieldNotes: [
      {
        title: "Thin skin",
        titleMs: "Lapisan nipis",
        note: "Shrink Earth to the size of an apple and the air we can breathe would be thinner than the skin.",
        noteMs: "Kecilkan Bumi menjadi sebesar epal, dan udara yang kita hirup akan lebih nipis daripada kulitnya.",
      },
      {
        title: "Already moving",
        titleMs: "Sentiasa bergerak",
        note: "You are moving right now. Earth circles the Sun at 30 km every second.",
        noteMs: "Anda sedang bergerak sekarang! Bumi mengorbit Matahari pada kelajuan 30 km sesaat.",
      },
    ],
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
    radiusKm: 1737.4,
    primaryFact: "With the Moon at its farthest, every other planet of the solar system would fit side by side in the gap between it and Earth.",
    primaryFactMs: "Apabila Bulan berada pada titik terjauhnya, setiap planet lain dalam sistem suria boleh muat bersebelahan di ruang antara Bumi dan Bulan.",
    distanceFromSun: {
      big: "384,400 km",
      bigMs: "384,400 km",
      small: "from Earth. Around 1.3 light-seconds away.",
      smallMs: "dari Bumi. Lebih kurang 1.3 saat perjalanan cahaya.",
    },
    fieldNotes: [
      {
        title: "One face",
        titleMs: "Satu wajah",
        note: "The Moon turns exactly once per orbit, so the same side always faces Earth. Nobody saw the far side until a Soviet probe photographed it in 1959.",
        noteMs: "Bulan berputar tepat sekali setiap orbit, jadi sisi yang sama sentiasa menghadap Bumi. Bahagian belakangnya hanya dilihat kali pertama melalui gambar prob Soviet pada 1959.",
      },
      {
        title: "Drifting away",
        titleMs: "Menjauh perlahan-lahan",
        note: "It moves 3.8 cm farther from Earth every year. About as fast as your fingernails grow.",
        noteMs: "Bulan bergerak 3.8 cm lebih jauh dari Bumi setiap tahun, kira-kira sepantas kuku anda memanjang.",
      },
    ],
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
    radiusKm: 3389.5,
    primaryFact: "Half as wide as Earth, yet it holds about as much dry land as all of Earth's continents combined.",
    primaryFactMs: "Hanya separuh saiz Bumi, tetapi Marikh memiliki keluasan daratan kering yang hampir menyamai gabungan semua benua di Bumi.",
    distanceFromSun: {
      big: "228 million km",
      bigMs: "228 juta km",
      small: "from the Sun. Sunlight needs almost 13 minutes.",
      smallMs: "dari Matahari. Cahaya matahari memerlukan hampir 13 minit untuk sampai.",
    },
    fieldNotes: [
      {
        title: "Olympus Mons",
        titleMs: "Olympus Mons",
        note: "Its largest volcano is 22 km high, well over twice Mount Everest, and 600 km across.",
        noteMs: "Gunung berapi terbesarnya setinggi 22 km—lebih dua kali ganda ketinggian Gunung Everest—dengan kelebaran 600 km.",
      },
      {
        title: "Rust",
        titleMs: "Karat merah",
        note: "The red is iron oxide. Mars is a planet-wide desert of rust, and its sunsets are blue.",
        noteMs: "Warna merahnya berasal dari besi oksida. Marikh adalah gurun karat yang luas, dan pemandangan matahari terbenamnya berwarna biru!",
      },
    ],
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
  // 6. Jupiter: Sains (Musytari) - D-01, D-02, D-03
  {
    id: "jupiter-sains",
    order: 6,
    celestialBody: "Jupiter",
    celestialBodyMs: "Musytari",
    subjectId: "sains",
    subjectTitle: "Science & Empirical Inquiry",
    subjectTitleMs: "Sains & Penerokaan Saintifik",
    themeColor: "#D97706",
    accentColor: "#F59E0B",
    textureType: "shader",
    tagline: "Swirling giant unlocks the secrets of scientific observation, living wonders, and nature hypotheses.",
    taglineMs: "Gergasi bergelora membuka rahsia pemerhatian saintifik, benda hidup, dan hipotesis alam.",
    orbitalPeriodDays: 4332.59,
    diameterKm: 139820,
    radiusKm: 69911,
    primaryFact: "More than 1,300 Earths would fit inside. Its Great Red Spot alone is an anticyclone wider than our entire planet.",
    primaryFactMs: "Lebih 1,300 buah Bumi boleh muat di dalamnya. Bintik Merah Gergasinya sahaja merupakan antisiklon yang lebih lebar daripada seluruh planet Bumi.",
    distanceFromSun: {
      big: "778 million km",
      bigMs: "778 juta km",
      small: "from the Sun. 43 light-minutes.",
      smallMs: "dari Matahari. 43 minit perjalanan cahaya.",
    },
    fieldNotes: [
      {
        title: "Fast spin",
        titleMs: "Putaran pantas",
        note: "The largest planet has the shortest day, under 10 hours. That spin is what stretches its clouds into bands.",
        noteMs: "Planet terbesar ini mempunyai hari terpendek, bawah 10 jam. Putaran laju ini meregangkan awannya menjadi jaluran berlapis.",
      },
      {
        title: "Moons",
        titleMs: "Bulan-bulan satelit",
        note: "It has more than 100 known moons. One of them, Ganymede, is bigger than the planet Mercury.",
        noteMs: "Musytari memiliki lebih 100 bulan. Salah satunya, Ganymede, lebih besar daripada planet Utarid.",
      },
    ],
    features: [
      {
        id: "great-red-spot",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        hasMission: true,
        name: "Great Red Spot (Bintik Merah Gergasi)",
        nameMs: "Bintik Merah Gergasi",
        coordinates: {
          lat: -22.0,
          lon: -165.0,
          radiusDeg: 16.0,
          elevation: "+8 km above cloud deck (high pressure anticyclone)",
        },
        badge: "Living & Non-Living Classification",
        badgeMs: "Pengelasan Benda Hidup & Bukan Hidup",
        description: "Prompts guiding scientific observation, identifying living vs non-living characteristics, and nature inquiry.",
        descriptionMs: "Arahan membimbing pemerhatian saintifik, membezakan ciri benda hidup dan bukan hidup, serta penerokaan alam.",
        geologicalProfile: "Titanic anticyclonic storm raging for centuries, spanning wider than Earth with high-altitude crimson clouds.",
        geologicalProfileMs: "Ribut antisiklon gergasi yang bergolak selama berabad-abad, lebih lebar daripada Bumi dengan awan merah aras tinggi.",
        accentColor: "#F59E0B",
      },
      {
        id: "oval-ba",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        hasMission: false,
        name: "Oval BA (Red Spot Jr.)",
        nameMs: "Oval BA (Bintik Merah Muda)",
        coordinates: {
          lat: -33.0,
          lon: -120.0,
          radiusDeg: 10.0,
          elevation: "+4 km above main deck",
        },
        badge: "Sensory Observation & Growth",
        badgeMs: "Pemerhatian Deria & Tumbesaran",
        description: "Describing physical growth, sensory observations, and life cycles using structured prompt clauses.",
        descriptionMs: "Memerihalkan tumbesaran fizikal, pemerhatian deria, dan kitaran hidup menggunakan klausa arahan berstruktur.",
        geologicalProfile: "Formed from the merger of three smaller white ovals between 1998 and 2000, turning reddish brown as it intensified.",
        geologicalProfileMs: "Terbentuk hasil gabungan tiga ribut bujur putih antara 1998 dan 2000, bertukar menjadi perang kemerahan apabila semakin kuat.",
        accentColor: "#F59E0B",
      },
      {
        id: "north-temperate-belt",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        hasMission: false,
        name: "North Temperate Belt",
        nameMs: "Jalur Suhu Utara",
        coordinates: {
          lat: 30.0,
          lon: 45.0,
          radiusDeg: 14.0,
          elevation: "-12 km jetstream depression",
        },
        badge: "Animal Classes & Plant Habits",
        badgeMs: "Kelas Haiwan & Tabiat Tumbuhan",
        description: "Prompts classifying animal eating habits, plant characteristics, and magnetic properties.",
        descriptionMs: "Arahan mengelaskan tabiat pemakanan haiwan, ciri-ciri tumbuhan, dan sifat magnet.",
        geologicalProfile: "Prominent dark atmospheric band characterized by high-speed eastward atmospheric jet streams and cyclic color fading.",
        geologicalProfileMs: "Jaluran atmosfera gelap ketara yang dicirikan oleh arus jet atmosfera ke arah timur berkelajuan tinggi.",
        accentColor: "#D97706",
      },
      {
        id: "south-equatorial-belt",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        hasMission: false,
        name: "South Equatorial Belt",
        nameMs: "Jalur Khatulistiwa Selatan",
        coordinates: {
          lat: -15.0,
          lon: 80.0,
          radiusDeg: 15.0,
          elevation: "-8 km turbulent trough",
        },
        badge: "States of Matter & Water Cycles",
        badgeMs: "Sifat Jirim & Kitaran Air",
        description: "Engineering prompts modeling solid, liquid, gas transformations, sound travel, and water cycles.",
        descriptionMs: "Membina arahan memodelkan perubahan pepejal, cecair, gas, perambatan bunyi, dan kitaran air.",
        geologicalProfile: "Highly variable atmospheric belt undergoing dramatic periodic fade and revival cycles bordered by turbulent storms.",
        geologicalProfileMs: "Jaluran atmosfera dinamik yang mengalami kitaran kepudaran dan kebangkitan dramatik yang bersempadan dengan ribut bergelora.",
        accentColor: "#D97706",
      },
      {
        id: "polar-cyclone-ring",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        hasMission: false,
        name: "Polar Cyclone Ring",
        nameMs: "Gelung Siklon Kutub",
        coordinates: {
          lat: 82.0,
          lon: 0.0,
          radiusDeg: 18.0,
          elevation: "+5 km circumpolar vortex ring",
        },
        badge: "Energy Transformations & Electricity",
        badgeMs: "Perubahan Tenaga & Elektrik",
        description: "Prompts analyzing electrical circuits, energy transformations, light behaviors, and astronomy concepts.",
        descriptionMs: "Arahan menganalisis litar elektrik, transformasi tenaga, sifat cahaya, dan konsep astronomi.",
        geologicalProfile: "Geometric cluster of persistent cyclonic storms orbiting a central polar vortex revealed by NASA's Juno spacecraft.",
        geologicalProfileMs: "Gugusan geometri ribut siklon berterusan yang mengelilingi pusaran kutub tengah seperti dirakam oleh wahana Juno NASA.",
        accentColor: "#F59E0B",
      },
      {
        id: "white-ovals-domain",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        hasMission: false,
        name: "White Ovals Domain",
        nameMs: "Domain Oval Putih",
        coordinates: {
          lat: -40.0,
          lon: -30.0,
          radiusDeg: 12.0,
          elevation: "+3 km anticyclonic domes",
        },
        badge: "Ecosystem Balance & Adaptations",
        badgeMs: "Keseimbangan Ekosistem & Adaptasi",
        description: "Constructing prompts testing food webs, microbial interactions, and survival adaptations.",
        descriptionMs: "Membina arahan menguji siratan makanan, interaksi mikroorganisma, dan penyesuaian kemandirian spesies.",
        geologicalProfile: "Long-lived high-pressure storm cells in the South South Temperate Zone characterized by cool ammonia cloud tops.",
        geologicalProfileMs: "Sel ribut bertekanan tinggi yang tahan lama di Zon Sederhana Selatan dengan puncak awan amonia yang sejuk.",
        accentColor: "#F59E0B",
      },
      {
        id: "jovian-core-telemetry",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        hasMission: false,
        name: "Jovian Core Telemetry (Gravity & Deep Atmosphere)",
        nameMs: "Teras Graviti Musytari",
        coordinates: {
          lat: 0.0,
          lon: 0.0,
          radiusDeg: 25.0,
          elevation: "-60,000 km metallic hydrogen core",
        },
        badge: "Capstone Boss: Empirical Scientific Inquiry",
        badgeMs: "Cabaran Unggul: Penerokaan Saintifik Empirikal",
        description: "Capstone boss arena: Synthesize comprehensive scientific observation, hypothesis formulation, and empirical testing.",
        descriptionMs: "Arena bos terakhir: Menggabungkan pemerhatian saintifik mendalam, pembentukan hipotesis dan pembuktian empirikal.",
        geologicalProfile: "Extreme gravitational core enveloped by immense pressures and swirling seas of metallic liquid hydrogen.",
        geologicalProfileMs: "Teras graviti ekstrem yang diselubungi tekanan amat dahsyat dan lautan hidrogen cecair berlogam.",
        accentColor: "#F59E0B",
      },
    ],
  },
  // 7. Saturn: Sejarah (Zuhal) - D-01, D-02, D-03
  {
    id: "saturn-sejarah",
    order: 7,
    celestialBody: "Saturn",
    celestialBodyMs: "Zuhal",
    subjectId: "sejarah",
    subjectTitle: "History & Chronology",
    subjectTitleMs: "Sejarah & Garis Masa",
    themeColor: "#EAB308",
    accentColor: "#FDE047",
    textureType: "shader",
    tagline: "Ancient cosmic rings guiding event timelines, personal history, and family chronicles.",
    taglineMs: "Gelung masa purba membimbing kronologi peristiwa, sejarah diri, dan riwayat keluarga.",
    orbitalPeriodDays: 10759.22,
    diameterKm: 116460,
    radiusKm: 58232,
    primaryFact: "Its icy rings span over 270,000 km across, yet in most places they are barely 10 meters thick.",
    primaryFactMs: "Gelang aisnya menjangkau lebih 270,000 km, namun di kebanyakan tempat ketebalannya hampir tidak melebihi 10 meter.",
    distanceFromSun: {
      big: "1.4 billion km",
      bigMs: "1.4 bilion km",
      small: "from the Sun. 80 light-minutes.",
      smallMs: "dari Matahari. 80 minit perjalanan cahaya.",
    },
    fieldNotes: [
      {
        title: "It would float",
        titleMs: "Boleh terapung",
        note: "Saturn is less dense than water. Given an ocean big enough, it would float.",
        noteMs: "Zuhal kurang tumpat daripada air. Jika terdapat lautan yang cukup besar, Zuhal akan terapung di atasnya!",
      },
      {
        title: "The rings",
        titleMs: "Gelang ais",
        note: "They are almost pure water ice, in pieces from dust grains to chunks the size of a house.",
        noteMs: "Gelang-gelang ini hampir keseluruhannya adalah ais air tulen, daripada zarah debu halus hingga bongkah sebesar rumah.",
      },
    ],
    features: [
      {
        id: "north-polar-hexagon",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        hasMission: true,
        name: "North Polar Hexagon",
        nameMs: "Heksagon Kutub Utara",
        coordinates: {
          lat: 78.0,
          lon: 0.0,
          radiusDeg: 20.0,
          elevation: "+10 km jetstream wave",
        },
        badge: "Personal & Family Chronology",
        badgeMs: "Kronologi Diri & Keluarga",
        description: "Prompts exploring personal timelines, family milestones, and polite interview queries.",
        descriptionMs: "Arahan meneroka garis masa diri, peristiwa keluarga, dan soalan temu bual yang bersopan.",
        geologicalProfile: "Perpetual six-sided hexagonal jet stream pattern circling Saturn's north pole spanning nearly 30,000 km across.",
        geologicalProfileMs: "Corak arus jet heksagon enam sisi berkekalan yang mengelilingi kutub utara Zuhal menjangkau hampir 30,000 km luas.",
        accentColor: "#FDE047",
      },
      {
        id: "cassini-division",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        hasMission: false,
        name: "Cassini Division",
        nameMs: "Bahagian Cassini",
        coordinates: {
          lat: 10.0,
          lon: 60.0,
          radiusDeg: 12.0,
          elevation: "4,800 km ring orbital gap",
        },
        badge: "School & Community Heritage",
        badgeMs: "Warisan Sekolah & Komuniti",
        description: "Prompts documenting school history, local community establishments, and shared traditions.",
        descriptionMs: "Arahan mendokumentasikan sejarah sekolah, penubuhan komuniti setempat, dan tradisi bersama.",
        geologicalProfile: "Broad 4,800-kilometer gap between Saturn's A and B rings cleared by gravitational resonance with the moon Mimas.",
        geologicalProfileMs: "Jurang selebar 4,800 kilometer antara gelang A dan B Zuhal yang terhasil akibat resonans graviti bulan Mimas.",
        accentColor: "#EAB308",
      },
      {
        id: "encke-gap-horizon",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        hasMission: false,
        name: "Encke Gap Horizon",
        nameMs: "Jurang Encke",
        coordinates: {
          lat: -10.0,
          lon: -90.0,
          radiusDeg: 11.0,
          elevation: "325 km moonlet orbital lane",
        },
        badge: "State History & Local Leaders",
        badgeMs: "Sejarah Negeri & Pemimpin Tempatan",
        description: "Prompts structuring historical figures, state origins, cultural symbols, and chronological events.",
        descriptionMs: "Arahan menyusun tokoh sejarah, asal-usul negeri, lambang kebudayaan, dan kronologi peristiwa.",
        geologicalProfile: "Clean 325-kilometer orbital gap within the outer A Ring maintained by the embedded shepherd moon Pan.",
        geologicalProfileMs: "Jurang orbit selebar 325 kilometer di dalam Gelang A yang diselenggara oleh graviti anak bulan Pan.",
        accentColor: "#EAB308",
      },
      {
        id: "great-white-spot",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        hasMission: false,
        name: "Great White Spot",
        nameMs: "Bintik Putih Gergasi",
        coordinates: {
          lat: 40.0,
          lon: 130.0,
          radiusDeg: 16.0,
          elevation: "+12 km convective cloud crest",
        },
        badge: "Early Malay Kingdoms & Sovereignty",
        badgeMs: "Kerajaan Melayu Awal & Kedaulatan",
        description: "Prompts detailing early maritime kingdoms, trade diplomacy, and historical sovereignty.",
        descriptionMs: "Arahan memperincikan kerajaan maritim awal, diplomasi perdagangan, dan kedaulatan sejarah.",
        geologicalProfile: "Periodic planetary-scale convective storm erupting roughly every 20-30 Saturnian years with immense ammonia plumes.",
        geologicalProfileMs: "Ribut perolakan berskala planet yang meletus setiap 20-30 tahun Zuhal dengan kepulan amonia yang mengagumkan.",
        accentColor: "#FDE047",
      },
      {
        id: "dragon-storm-expanse",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        hasMission: false,
        name: "Dragon Storm Expanse",
        nameMs: "Ribut Naga Purba",
        coordinates: {
          lat: -35.0,
          lon: -45.0,
          radiusDeg: 14.0,
          elevation: "-15 km deep convective abyss",
        },
        badge: "National Struggle & Independence",
        badgeMs: "Perjuangan Kemerdekaan Negara",
        description: "Prompts honoring patriot struggles, constitutional milestones, and nation-building narratives.",
        descriptionMs: "Arahan menghayati perjuangan pahlawan kemerdekaan, detik perlembagaan, dan naratif pembinaan negara.",
        geologicalProfile: "Long-lived convective storm in Saturn's southern hemisphere known for producing immense electrical radio discharges.",
        geologicalProfileMs: "Ribut perolakan bertenaga tinggi di hemisfera selatan Zuhal yang menghasilkan pelepasan gelombang radio elektrik kuat.",
        accentColor: "#EAB308",
      },
      {
        id: "equatorial-jet-stream",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        hasMission: false,
        name: "Equatorial Jet Stream",
        nameMs: "Arus Jet Khatulistiwa",
        coordinates: {
          lat: 5.0,
          lon: 160.0,
          radiusDeg: 15.0,
          elevation: "1,800 km/h equatorial windstream",
        },
        badge: "Formation of Malaysia & Unity",
        badgeMs: "Pembentukan Malaysia & Perpaduan",
        description: "Prompts exploring the 1963 formation of Malaysia, cultural unity, and democratic institutions.",
        descriptionMs: "Arahan meneroka pembentukan Malaysia 1963, perpaduan pelbagai budaya, dan institusi demokrasi.",
        geologicalProfile: "Super-fast equatorial atmospheric jet with continuous prograde winds exceeding 1,800 km/h.",
        geologicalProfileMs: "Arus jet atmosfera khatulistiwa pantas dengan angin prograd berterusan melebihi 1,800 km/j.",
        accentColor: "#FDE047",
      },
      {
        id: "chronos-time-vault",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        hasMission: false,
        name: "Chronos Time Vault (Ring Coordinates & Ancient Orbit)",
        nameMs: "Kubah Masa Purba",
        coordinates: {
          lat: -75.0,
          lon: 180.0,
          radiusDeg: 24.0,
          elevation: "Deep cryogenic polar vault",
        },
        badge: "Capstone Boss: Historical Chronology & Heritage",
        badgeMs: "Cabaran Unggul: Kronologi Sejarah & Warisan",
        description: "Capstone boss arena: Reconstruct extensive historical chronologies, verify sources, and evaluate national heritage.",
        descriptionMs: "Arena bos terakhir: Membina semula kronologi sejarah menyeluruh, menilai sumber, dan menghargai warisan negara.",
        geologicalProfile: "Sub-polar cryptographic repository of planetary ring timeline data sealed under deep atmospheric pressure.",
        geologicalProfileMs: "Penyimpanan kriptografi garis masa gelang planet yang tersimpan kukuh di bawah tekanan atmosfera kutub purba.",
        accentColor: "#FACC15",
      },
    ],
  },
  // 8. Uranus: RBT (Uranus) - D-01, D-02, D-03
  {
    id: "uranus-rbt",
    order: 8,
    celestialBody: "Uranus",
    celestialBodyMs: "Uranus",
    subjectId: "rbt",
    subjectTitle: "Design & Technology (RBT)",
    subjectTitleMs: "Reka Bentuk & Teknologi",
    themeColor: "#06B6D4",
    accentColor: "#22D3EE",
    textureType: "shader",
    tagline: "Tilted axis challenging creative basic shapes, 2D/3D blocks, and structural constraints.",
    taglineMs: "Paksi condong menguji kreativiti bentuk asas, blok binaan 2D/3D, dan batas rekaan.",
    orbitalPeriodDays: 30685.4,
    diameterKm: 50724,
    radiusKm: 25362,
    primaryFact: "Probably knocked onto its side by an ancient collision, it rolls around the Sun tipped over by 98 degrees.",
    primaryFactMs: "Kemungkinan besar dilanggar objek gergasi pada zaman purba, Uranus mengorbit Matahari dengan condong terbalik sebanyak 98 darjah.",
    distanceFromSun: {
      big: "2.9 billion km",
      bigMs: "2.9 bilion km",
      small: "from the Sun. 2 hours 40 minutes at light speed.",
      smallMs: "dari Matahari. 2 jam 40 minit pada kelajuan cahaya.",
    },
    fieldNotes: [
      {
        title: "Long seasons",
        titleMs: "Musim yang panjang",
        note: "Because it lies on its side, each pole gets 42 years of sunlight followed by 42 years of darkness.",
        noteMs: "Kerana kedudukannya yang terlentang condong, setiap kutub menerima 42 tahun cahaya matahari diikuti 42 tahun kegelapan.",
      },
      {
        title: "Coldest",
        titleMs: "Paling sejuk",
        note: "It holds the lowest temperature measured on any planet, minus 224 °C. Lower than anything recorded on Neptune, even though Uranus is closer to the Sun.",
        noteMs: "Uranus memegang rekod suhu terendah di planet iaitu -224 °C, lebih sejuk daripada Neptun walaupun Uranus lebih dekat dengan Matahari.",
      },
    ],
    features: [
      {
        id: "miranda-rift-canyon",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        hasMission: true,
        name: "Miranda Rift Canyon",
        nameMs: "Lembah Jurang Titania/Miranda",
        coordinates: {
          lat: -15.0,
          lon: -30.0,
          radiusDeg: 14.0,
          elevation: "-20 km tectonic shear graben",
        },
        badge: "Basic Shapes & 2D/3D Building Blocks",
        badgeMs: "Bentuk Asas & Blok Binaan 2D/3D",
        description: "Prompts identifying geometric shapes, basic 2D and 3D building blocks, and stability principles.",
        descriptionMs: "Arahan mengenal pasti bentuk geometri asas, blok binaan 2D dan 3D, serta kestabilan struktur.",
        geologicalProfile: "Massive fault canyons and extensional grabens revealing deep stratigraphy from extreme gravitational tidal stress.",
        geologicalProfileMs: "Lembah jurang sesar gergasi yang menyingkap stratigrafi dalam akibat tegasan pasang surut graviti melampau.",
        accentColor: "#22D3EE",
      },
      {
        id: "northern-bright-cap",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        hasMission: false,
        name: "Northern Bright Cap",
        nameMs: "Kubah Cahaya Utara",
        coordinates: {
          lat: 65.0,
          lon: 40.0,
          radiusDeg: 18.0,
          elevation: "+5 km seasonal methane veil",
        },
        badge: "Basic Hand Tools & Structural Joining",
        badgeMs: "Alatan Tangan & Sambungan Struktur",
        description: "Prompts identifying basic hand tools, material joinery, and structural reinforcement techniques.",
        descriptionMs: "Arahan mengenal pasti alatan tangan asas, kaedah cantuman bahan, dan teknik pengukuhan struktur.",
        geologicalProfile: "Bright seasonal polar cloud hood composed of methane haze and convective clouds exposed to summer sunlight.",
        geologicalProfileMs: "Tudung awan kutub bermusim yang terang daripada kabus metana dan awan perolakan di bawah pancaran matahari musim panas.",
        accentColor: "#06B6D4",
      },
      {
        id: "retrograde-cloud-belt",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        hasMission: false,
        name: "Retrograde Cloud Belt",
        nameMs: "Jalur Awan Retrograd",
        coordinates: {
          lat: -30.0,
          lon: 110.0,
          radiusDeg: 15.0,
          elevation: "-10 km counter-rotating flow",
        },
        badge: "Basic Electronics & Simple Circuits",
        badgeMs: "Elektronik Asas & Litar Mudah",
        description: "Prompts specifying circuit components, switches, sensors, and basic electronic logic.",
        descriptionMs: "Arahan menetapkan komponen litar elektrik, suis, penderia, dan logik elektronik mudah.",
        geologicalProfile: "Counter-rotating atmospheric stream flowing opposite to planet rotation due to low internal thermal energy.",
        geologicalProfileMs: "Aliran atmosfera berputar songsang yang bergerak berlawanan dengan putaran planet akibat tenaga haba dalaman yang rendah.",
        accentColor: "#06B6D4",
      },
      {
        id: "methane-fog-plains",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        hasMission: false,
        name: "Methane Fog Plains",
        nameMs: "Dataran Kabus Metana",
        coordinates: {
          lat: 10.0,
          lon: -140.0,
          radiusDeg: 16.0,
          elevation: "-2 km haze plateau",
        },
        badge: "Design Constraints & Ergonomic Forms",
        badgeMs: "Kekangan Reka Bentuk & Bentuk Ergonomik",
        description: "Prompts incorporating usability factors, design constraints, and ergonomic considerations.",
        descriptionMs: "Arahan menerapkan faktor kebolehgunaan, kekangan reka bentuk, dan pertimbangan ergonomik.",
        geologicalProfile: "Dense stratospheric photochemical haze plains where sunlight converts atmospheric methane into complex hydrocarbons.",
        geologicalProfileMs: "Dataran kabus fotokimia stratosfera tebal di mana cahaya matahari menukar metana kepada hidrokarbon kompleks.",
        accentColor: "#22D3EE",
      },
      {
        id: "epsilon-ring-shard",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        hasMission: false,
        name: "Epsilon Ring Shard",
        nameMs: "Pecahan Gelung Epsilon",
        coordinates: {
          lat: 20.0,
          lon: 70.0,
          radiusDeg: 12.0,
          elevation: "Dense boulder ring boundary",
        },
        badge: "Microcontroller Logic & Flowcharts",
        badgeMs: "Logik Pengawal Mikro & Carta Alir",
        description: "Prompts designing input-process-output logic, pseudo-code flowcharts, and automated behavior.",
        descriptionMs: "Arahan mereka bentuk logik input-proses-output, carta alir pseudokod, dan tingkah laku automatik.",
        geologicalProfile: "Densest and widest of Uranus's rings composed of ice-boulders shepherded by the moons Cordelia and Ophelia.",
        geologicalProfileMs: "Gelang paling tumpat dan lebar di Uranus yang terdiri daripada bongkah ais yang digembala oleh bulan Cordelia dan Ophelia.",
        accentColor: "#06B6D4",
      },
      {
        id: "south-pole-aurora-trench",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        hasMission: false,
        name: "South Pole Aurora Trench",
        nameMs: "Jurang Aurora Selatan",
        coordinates: {
          lat: -70.0,
          lon: 0.0,
          radiusDeg: 17.0,
          elevation: "+8 km magnetic cusp channel",
        },
        badge: "Robotics & Electro-Mechanical Systems",
        badgeMs: "Sistem Robotik & Elektro-Mekanikal",
        description: "Prompts coordinating motors, servos, programmable robotic systems, and multi-step tasks.",
        descriptionMs: "Arahan menyelaras motor, servo, sistem robotik boleh atur cara, dan tugas pelbagai langkah.",
        geologicalProfile: "Complex auroral cusp formed by Uranus's strongly tilted and offset magnetic field interacting with solar wind.",
        geologicalProfileMs: "Kawasan aurora kompleks yang terhasil akibat medan magnet Uranus yang condong dan beralih daripada pusat planet.",
        accentColor: "#22D3EE",
      },
      {
        id: "diamond-ocean-matrix",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        hasMission: false,
        name: "Diamond Ocean Matrix (Supercritical Mantle & Core)",
        nameMs: "Matriks Lautan Berlian",
        coordinates: {
          lat: 0.0,
          lon: 180.0,
          radiusDeg: 25.0,
          elevation: "High-pressure supercritical mantle",
        },
        badge: "Capstone Boss: Structural Engineering & Invention",
        badgeMs: "Cabaran Unggul: Reka Cipta & Kejuruteraan Struktur",
        description: "Capstone boss arena: Synthesize structural engineering, electronic control, and inventive problem-solving.",
        descriptionMs: "Arena bos terakhir: Menggabungkan kejuruteraan struktur, kawalan elektronik, dan reka cipta penyelesaian masalah.",
        geologicalProfile: "Theoretical high-pressure mantle zone where hydrocarbon oceans crystallize into sinking diamond icebergs.",
        geologicalProfileMs: "Zon mantel bertekanan tinggi di mana lautan hidrokarbon dipercayai menghablur menjadi bongkah berlian pejal.",
        accentColor: "#38BDF8",
      },
    ],
  },
  // 9. Neptune: PSV (Neptun) - D-01, D-02, D-03
  {
    id: "neptune-psv",
    order: 9,
    celestialBody: "Neptune",
    celestialBodyMs: "Neptun",
    subjectId: "psv",
    subjectTitle: "Visual Arts (PSV)",
    subjectTitleMs: "Pendidikan Seni Visual",
    themeColor: "#2563EB",
    accentColor: "#3B82F6",
    textureType: "shader",
    tagline: "Deep azure abyss inspiring primary color harmony, line patterns, and artistic imagination.",
    taglineMs: "Jurang biru kosmik menyemarakkan harmoni warna asas, corak garisan, dan imaginasi seni.",
    orbitalPeriodDays: 60189,
    diameterKm: 49244,
    radiusKm: 24622,
    primaryFact: "Supersonic winds drive clouds of frozen methane at 2,000 km/h here, the fastest winds measured on any planet in the solar system.",
    primaryFactMs: "Angin supersonik menggerakkan awan metana beku selaju 2,000 km/j di sini—angin terpantas yang pernah diukur di mana-mana planet dalam sistem suria.",
    distanceFromSun: {
      big: "4.5 billion km",
      bigMs: "4.5 bilion km",
      small: "from the Sun. Sunlight needs 4 hours to get this far.",
      smallMs: "dari Matahari. Cahaya matahari memerlukan 4 jam untuk tiba sejauh ini.",
    },
    fieldNotes: [
      {
        title: "Found by maths",
        titleMs: "Ditemui melalui matematik",
        note: "Neptune was predicted on paper before anyone saw it. Astronomers noticed Uranus being tugged off course and worked out where to point the telescope.",
        noteMs: "Neptun diramalkan di atas kertas sebelum dilihat. Ahli astronomi mendapati orbit Uranus tertarik dan mengira tepat arah teleskop perlu dihalakan.",
      },
      {
        title: "One lap",
        titleMs: "Satu pusingan lengkap",
        note: "Its year lasts 165 Earth years. Since it was discovered in 1846 it has gone around the Sun just once.",
        noteMs: "Satu tahunnya bersamaan 165 tahun Bumi. Sejak ditemui pada tahun 1846, Neptun baru sahaja melengkapkan satu orbit mengelilingi Matahari.",
      },
    ],
    features: [
      {
        id: "great-dark-spot",
        featureNumber: 1,
        year: 1,
        isFinalBoss: false,
        hasMission: true,
        name: "Great Dark Spot",
        nameMs: "Bintik Gelap Gergasi",
        coordinates: {
          lat: -20.0,
          lon: -80.0,
          radiusDeg: 16.0,
          elevation: "-10 km anticyclonic cloud hole",
        },
        badge: "Primary Colors & Line Imagination",
        badgeMs: "Warna Asas & Imaginasi Garisan",
        description: "Prompts exploring primary color harmony, line varieties (wavy, zigzag, straight), and visual imagination.",
        descriptionMs: "Arahan meneroka harmoni warna asas, pelbagai jenis garisan (beralun, zikzak, lurus), dan imaginasi visual.",
        geologicalProfile: "Massive Earth-sized anticyclonic storm hole in the southern atmosphere discovered by Voyager 2 in 1989.",
        geologicalProfileMs: "Lubang ribut antisiklon gergasi sebesar saiz Bumi di atmosfera selatan yang ditemui oleh Voyager 2 pada tahun 1989.",
        accentColor: "#3B82F6",
      },
      {
        id: "small-dark-spot",
        featureNumber: 2,
        year: 2,
        isFinalBoss: false,
        hasMission: false,
        name: "Small Dark Spot (Wizard's Eye)",
        nameMs: "Mata Penyihir (Bintik Gelap Kecil)",
        coordinates: {
          lat: -54.0,
          lon: 35.0,
          radiusDeg: 11.0,
          elevation: "-6 km cyclonic eye",
        },
        badge: "Secondary Colors & Surface Textures",
        badgeMs: "Warna Sekunder & Jalinan Permukaan",
        description: "Prompts describing secondary color mixing, tactile surface textures, and repeating geometric shapes.",
        descriptionMs: "Arahan memerihalkan campuran warna sekunder, jalinan sentuh permukaan, dan bentuk geometri berulang.",
        geologicalProfile: "Rapidly rotating southern cyclonic vortex surrounded by bright white convective cloud streamers.",
        geologicalProfileMs: "Pusaran siklon selatan yang berputar pantas dikelilingi oleh jalur awan perolakan putih yang berkilauan.",
        accentColor: "#2563EB",
      },
      {
        id: "scooter-cirrus-clouds",
        featureNumber: 3,
        year: 3,
        isFinalBoss: false,
        hasMission: false,
        name: "Scooter Cirrus Clouds",
        nameMs: "Awan Sirus Pantas",
        coordinates: {
          lat: -42.0,
          lon: 120.0,
          radiusDeg: 13.0,
          elevation: "+15 km supersonic methane cirrus",
        },
        badge: "Visual Balance, Rhythm & Movement",
        badgeMs: "Imbangan Visual, Irama & Pergerakan",
        description: "Prompts analyzing visual balance, rhythmic patterns, diagonal action lines, and optical illusions.",
        descriptionMs: "Arahan menganalisis imbangan visual, irama corak, garisan aksi pepenjuru, dan ilusi pergerakan.",
        geologicalProfile: "Fast-moving high-altitude white methane cloud plume orbiting Neptune faster than other atmospheric features.",
        geologicalProfileMs: "Kepulan awan metana putih aras tinggi yang bergerak pantas mengelilingi Neptun lebih laju daripada kawasan lain.",
        accentColor: "#3B82F6",
      },
      {
        id: "adams-ring-arcs",
        featureNumber: 4,
        year: 4,
        isFinalBoss: false,
        hasMission: false,
        name: "Adams Ring Arcs",
        nameMs: "Arka Gelung Adams",
        coordinates: {
          lat: 15.0,
          lon: -160.0,
          radiusDeg: 14.0,
          elevation: "Gravitationally clumped ring arcs",
        },
        badge: "Tone, Contrast & Perspective",
        badgeMs: "Ton Warna, Kontra & Perspektif",
        description: "Prompts mastering tonal gradients, dramatic contrast, foreground-background depth, and atmospheric perspective.",
        descriptionMs: "Arahan menguasai ton warna berlapis, kontra pencahayaan, kedalaman ruang, dan perspektif suasana.",
        geologicalProfile: "Unique incomplete bright ring arcs (Courage, Liberté, Egalité, Fraternité) maintained by Galatea's resonant gravity.",
        geologicalProfileMs: "Arka gelang terang yang tidak lengkap (Courage, Liberté, Egalité, Fraternité) hasil resonans graviti bulan Galatea.",
        accentColor: "#2563EB",
      },
      {
        id: "south-polar-vortex",
        featureNumber: 5,
        year: 5,
        isFinalBoss: false,
        hasMission: false,
        name: "South Polar Vortex",
        nameMs: "Pusaran Kutub Selatan",
        coordinates: {
          lat: -75.0,
          lon: -45.0,
          radiusDeg: 15.0,
          elevation: "Thermal polar cyclone (+4 km)",
        },
        badge: "Traditional Craft & Pattern Symmetry",
        badgeMs: "Kraf Tradisional & Simetri Corak",
        description: "Prompts appreciating Malaysian traditional craft motifs, batik patterns, songket geometries, and symmetrical layouts.",
        descriptionMs: "Arahan menghayati motif seni kraf tradisional Malaysia, reka corak batik, geometri songket, dan susun atur simetri.",
        geologicalProfile: "Warm polar vortex characterized by thermal upwelling and high-speed circumpolar jet streams.",
        geologicalProfileMs: "Pusaran kutub bersuhu lebih panas dengan perolakan haba ke atas dan arus jet sirkumpolar berkelajuan tinggi.",
        accentColor: "#3B82F6",
      },
      {
        id: "azure-jet-stream",
        featureNumber: 6,
        year: 6,
        isFinalBoss: false,
        hasMission: false,
        name: "Azure Jet Stream",
        nameMs: "Arus Jet Azure",
        coordinates: {
          lat: 30.0,
          lon: 95.0,
          radiusDeg: 15.0,
          elevation: "2,000 km/h supersonic jet stream",
        },
        badge: "Composition & Visual Storytelling",
        badgeMs: "Komposisi & Penceritaan Visual",
        description: "Prompts weaving multi-character scenes, cinematic camera angles, emotional mood lighting, and narrative composition.",
        descriptionMs: "Arahan menggabungkan watak berlapis, sudut kamera sinematik, pencahayaan beremosi, dan komposisi penceritaan.",
        geologicalProfile: "Supersonic retrograde atmospheric current clocking the highest wind speeds recorded in the solar system.",
        geologicalProfileMs: "Arus atmosfera supersonik songsang yang mencatat rekod kelajuan angin tertinggi dalam sistem suria.",
        accentColor: "#3B82F6",
      },
      {
        id: "triton-azure-prism",
        featureNumber: 7,
        year: 6,
        isFinalBoss: true,
        hasMission: false,
        name: "Triton Azure Prism (Cryogenic Plumes & Ring Optics)",
        nameMs: "Prisma Azure Triton",
        coordinates: {
          lat: 0.0,
          lon: 0.0,
          radiusDeg: 25.0,
          elevation: "Nitrogen cryovolcanic reflection prism",
        },
        badge: "Capstone Boss: Visual Harmony & Masterpiece",
        badgeMs: "Cabaran Unggul: Harmoni Visual & Karya Agung",
        description: "Capstone boss arena: Synthesize holistic artistic direction, aesthetic balance, color theory, and imaginative masterpiece prompts.",
        descriptionMs: "Arena bos terakhir: Menggabungkan bimbingan artistik holistik, imbangan estetik, teori warna, dan penghasilan karya seni agung.",
        geologicalProfile: "Sub-polar vantage alignment capturing nitrogen geyser eruptions and specular reflections through planetary rings.",
        geologicalProfileMs: "Penjajaran cerapan kutub merakam letusan geiser nitrogen dan biasan prisma optik melalui gelang planet.",
        accentColor: "#60A5FA",
      },
    ],
  }
];

/**
 * Helper to retrieve a Planet by its PlanetId.
 * Supports both CanonicalPlanetId and LegacyPlanetId.
 */
export function getPlanetWorld(id: PlanetId | string): Planet | undefined {
  const normalizedId = normalizePlanetId(id);
  return PLANET_WORLDS.find((planet) => planet.id === normalizedId);
}

/**
 * Returns a flat array of all 63 geological features across all planets.
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
export function resolveMissionRoute(planetId: PlanetId | string, feature?: PlanetFeature): string {
  // feature parameter preserved for future per-feature custom routes
  void feature;
  switch (planetId) {
    case 'earth-prompting':
      return '/map';
    case 'moon-bm':
      return '/level/6-1-bm-kucing-peromfu';
    case 'venus-matematik':
      return '/level/8-1-matematik-tambah-bintang';
    case 'mars-english':
      return '/level/7-1-english-colorful-toys';
    case 'mercury-moral':
      return '/level/9-1-moral-sahabat-prihatin';
    default:
      return '/map';
  }
}
