/**
 * Localized Section Title Registry for Kids Lessons
 * Provides explicit, ordered BM and EN titles for each Section within lesson MDX.
 *
 * Rules:
 * - Specific, natural titles derived from lesson headings, activities, and pedagogical flow.
 * - Indexed in exact source Section order (0-based) for both locales.
 * - Covers all 23 registered lesson slugs across Earth (Worlds 1-5) and Planets (Worlds 6-9).
 * - Missing/unknown locale, slug, or index returns undefined (no silent fallback).
 */

export interface SectionTitleLookup {
  en: string[];
  ms: string[];
}

export const ALL_LESSON_SECTION_TITLES: Record<string, SectionTitleLookup> = {
  // ==========================================
  // WORLD 1 — Meet Peromfu & Prompting Basics
  // ==========================================
  "1-1-meet-peromfu": {
    en: [
      "Meet Peromfu",
      "What is AI?",
      "How Peromfu Learns",
      "How Do I Think?",
      "Predicting Next Words",
      "What is a Prompt?",
      "Power of Good Prompts",
      "Let's Try It",
      "Quick Quiz",
      "Lesson Complete",
    ],
    ms: [
      "Kenali Peromfu",
      "Apa Itu AI?",
      "Bagaimana Peromfu Belajar",
      "Bagaimana Saya Berfikir?",
      "Meneka Perkataan Seterusnya",
      "Apa Itu Prompt?",
      "Kuasa Prompt yang Bagus",
      "Mari Cuba",
      "Kuiz Pantas",
      "Pelajaran Selesai",
    ],
  },
  "1-2-first-words": {
    en: [
      "Welcome Back",
      "The Magic of Words",
      "Building Better Prompts",
      "Drag the Pieces",
      "Fill in the Blanks",
      "Your Turn to Choose",
      "Great Job",
    ],
    ms: [
      "Selamat Kembali",
      "Keajaiban Perkataan",
      "Membina Prompt yang Lebih Bagus",
      "Seret Bahagian",
      "Isi Tempat Kosong",
      "Giliran Anda Memilih",
      "Kerja Bagus",
    ],
  },
  "1-3-being-clear": {
    en: [
      "Superstar Welcome",
      "Why Being Clear Matters",
      "Clear vs Unclear",
      "Spot the Clear Request",
      "The Clarity Challenge",
      "Fill in Clear Details",
      "Golden Rules of Clarity",
      "Final Clarity Quiz",
      "World 1 Complete",
    ],
    ms: [
      "Selamat Datang Bintang",
      "Kenapa Menjadi Jelas Itu Penting",
      "Jelas Lawan Tidak Jelas",
      "Cari Permintaan yang Jelas",
      "Cabaran Kejelasan",
      "Isi Butiran yang Jelas",
      "Peraturan Emas Kejelasan",
      "Kuiz Kejelasan Akhir",
      "Dunia 1 Selesai",
    ],
  },

  // ==========================================
  // WORLD 2 — Clarity Castle & Details
  // ==========================================
  "2-1-missing-details": {
    en: [
      "Welcome to Clarity Castle",
      "The Mystery of Missing Details",
      "The Problem with Vague Prompts",
      "Why Specifics Help",
      "Practice Spotting Details",
      "Fix the Vague Prompt",
      "Complete the Details",
      "Castle Explorer Complete",
    ],
    ms: [
      "Selamat Datang ke Istana Kejelasan",
      "Misteri Butiran yang Hilang",
      "Masalah dengan Prompt yang Kabur",
      "Kenapa Butiran Khusus Membantu",
      "Latihan Mengesan Butiran",
      "Baiki Prompt yang Kabur",
      "Lengkapkan Butiran",
      "Penerokaan Istana Selesai",
    ],
  },
  "2-2-who-and-what": {
    en: [
      "Mastering Who and What",
      "Meet the Duo: Who and What",
      "The Power of Who and What",
      "Find the Missing Piece",
      "Build a Who and What Prompt",
      "Combine Who and What",
      "The Who and What Formula",
      "Who and What Challenge",
      "Great Work",
    ],
    ms: [
      "Menguasai Siapa dan Apa",
      "Kenali Pasangan: Siapa dan Apa",
      "Kuasa Siapa dan Apa",
      "Cari Bahagian yang Hilang",
      "Bina Prompt Siapa dan Apa",
      "Gabungkan Siapa dan Apa",
      "Formula Siapa dan Apa",
      "Cabaran Siapa dan Apa",
      "Kerja Cemerlang",
    ],
  },
  "2-3-when-and-where": {
    en: [
      "Adding Time and Place",
      "Meet the Next Duo: When and Where",
      "Why When and Where Matter",
      "Where Does It Belong?",
      "Practice When and Where",
      "Build the Setting",
      "The 4-Part Prompt Formula",
      "The 4-Part Challenge",
      "Awesome Job",
    ],
    ms: [
      "Menambah Masa dan Tempat",
      "Kenali Pasangan: Bila dan Di Mana",
      "Kenapa Bila dan Di Mana Penting",
      "Di Mana Tempatnya?",
      "Latihan Bila dan Di Mana",
      "Bina Suasana Tempat",
      "Formula Prompt 4 Bahagian",
      "Cabaran 4 Bahagian",
      "Hebat Sekali",
    ],
  },
  "2-4-detail-detective": {
    en: [
      "Detective Badge Ready",
      "The 4 Clues of Great Prompts",
      "Become a Detail Detective",
      "Spot the Missing Clue",
      "The Ultimate Prompt Mystery",
      "Fill in All 4 Clues",
      "Write Like a Detective",
      "Final Detective Case",
      "World 2 Complete",
    ],
    ms: [
      "Lencana Detektif Sedia",
      "4 Petunjuk Prompt Hebat",
      "Menjadi Detektif Butiran",
      "Kesan Petunjuk yang Hilang",
      "Misteri Prompt Terhebat",
      "Isi Semua 4 Petunjuk",
      "Tulis Seperti Detektif",
      "Kes Detektif Terakhir",
      "Dunia 2 Selesai",
    ],
  },

  // ==========================================
  // WORLD 3 — Context Caves
  // ==========================================
  "3-1-setting-the-scene": {
    en: [
      "Welcome to Context Caves",
      "Why Context Changes Everything",
      "What is Context?",
      "See the Difference",
      "Setting the Scene",
      "Practice Setting Context",
      "Excellent Start",
    ],
    ms: [
      "Selamat Datang ke Gua Konteks",
      "Kenapa Konteks Mengubah Segalanya",
      "Apa Itu Konteks?",
      "Lihat Perbezaannya",
      "Menetapkan Adegan",
      "Berlatih Menetapkan Konteks",
      "Permulaan yang Cemerlang",
    ],
  },
  "3-2-show-dont-tell": {
    en: [
      "The Secret of Good Examples",
      "The Power of Examples",
      "Learn the Pattern",
      "Why Examples Help",
      "See the Difference",
      "Show Your Style",
      "Give Examples",
      "Create Your Example-Prompt",
      "Examples Are Powerful",
    ],
    ms: [
      "Rahsia Contoh yang Baik",
      "Kuasa Contoh",
      "Pelajari Coraknya",
      "Kenapa Contoh Membantu",
      "Lihat Perbezaannya",
      "Tunjukkan Gaya Anda",
      "Berikan Contoh",
      "Cipta Prompt-Contoh Anda",
      "Contoh Itu Berkuasa",
    ],
  },
  "3-3-format-finder": {
    en: [
      "Welcome to Formats",
      "What is a Format?",
      "Why Format Matters",
      "Format Makes a Difference",
      "Choose Your Format",
      "Format Practice",
      "Pick Your Format",
      "Format Master",
    ],
    ms: [
      "Selamat Datang ke Dunia Format",
      "Apa Itu Format?",
      "Kenapa Format Penting",
      "Format Membuat Perbezaan",
      "Pilih Format Anda",
      "Latihan Format",
      "Tentukan Format Anda",
      "Pakar Format",
    ],
  },
  "3-4-context-champion": {
    en: [
      "Final Challenge of Context Caves",
      "The Context Champion Checklist",
      "Putting It All Together",
      "Champion Challenge 1",
      "Champion Challenge 2",
      "Build a Champion Prompt",
      "Create Your Champion Prompt",
      "Congratulations Champion",
    ],
    ms: [
      "Cabaran Akhir Gua Konteks",
      "Senarai Semak Jaguh Konteks",
      "Menggabungkan Segalanya",
      "Cabaran Jaguh 1",
      "Cabaran Jaguh 2",
      "Bina Prompt Jaguh",
      "Cipta Prompt Jaguh Anda",
      "Tahniah Jaguh",
    ],
  },

  // ==========================================
  // WORLD 4 — Creation Canyon
  // ==========================================
  "4-1-pretend-time": {
    en: [
      "Welcome to Creation Canyon",
      "What is Role-Play?",
      "Why Role-Play Sparks Imagination",
      "See Role-Play in Action",
      "Choose Your Character",
      "Create a Role-Play Prompt",
      "Build Your Own Role-Play",
      "Role-Play Master",
    ],
    ms: [
      "Selamat Datang ke Gaung Penciptaan",
      "Apa Itu Main Peranan?",
      "Kenapa Main Peranan Mencetus Imaginasi",
      "Lihat Main Peranan Beraksi",
      "Pilih Watak Anda",
      "Cipta Prompt Main Peranan",
      "Bina Main Peranan Anda Sendiri",
      "Pakar Main Peranan",
    ],
  },
  "4-2-story-starters": {
    en: [
      "Welcome Back to Creation Canyon",
      "AI as Your Co-Author",
      "The Formula for Story Starters",
      "Story Starters That Work",
      "Continue the Adventure",
      "Start Your Story",
      "Create Your Story Prompt",
      "Story Creator",
    ],
    ms: [
      "Selamat Kembali ke Gaung Penciptaan",
      "AI Sebagai Penulis Bersama",
      "Formula Pembuka Cerita",
      "Pembuka Cerita Yang Berkesan",
      "Teruskan Pengembaraan",
      "Mulakan Cerita Anda",
      "Cipta Prompt Cerita Anda",
      "Pencipta Cerita",
    ],
  },
  "4-3-character-creator": {
    en: [
      "Personality Powers",
      "Give AI a Personality",
      "Why Personality Matters",
      "Personality Makes a Difference",
      "Match the Mood",
      "Create a Character",
      "Design Your AI Personality",
      "Personality Master",
    ],
    ms: [
      "Kuasa Personaliti",
      "Beri AI Personaliti",
      "Kenapa Personaliti Penting",
      "Personaliti Membuat Perbezaan",
      "Padankan Mood",
      "Cipta Satu Watak",
      "Reka Personaliti AI Anda",
      "Pakar Personaliti",
    ],
  },
  "4-4-world-builder": {
    en: [
      "Welcome to World Building",
      "Building Imaginary Worlds",
      "Rules of Your World",
      "World Building in Action",
      "Expand Your World",
      "Create Your World Prompt",
      "Design Your World",
      "Master World Builder",
    ],
    ms: [
      "Selamat Datang ke Pembinaan Dunia",
      "Membina Dunia Imaginasi",
      "Peraturan Dunia Anda",
      "Pembinaan Dunia Beraksi",
      "Kembangkan Dunia Anda",
      "Cipta Prompt Dunia Anda",
      "Reka Dunia Anda",
      "Pakar Pembina Dunia",
    ],
  },

  // ==========================================
  // WORLD 5 — Master Mountain & Graduation
  // ==========================================
  "5-1-perfect-prompt": {
    en: [
      "Welcome to Master Mountain",
      "The Master Checklist",
      "Think Step by Step",
      "Master Formula Tips",
      "Master Challenge 1",
      "Master Challenge 2",
      "Build a Master Prompt",
      "Create Your Master Prompt",
      "Master Skills Unlocked",
    ],
    ms: [
      "Selamat Datang ke Gunung Pakar",
      "Senarai Semak Master",
      "Fikir Langkah Demi Langkah",
      "Tip Formula Master",
      "Cabaran Master 1",
      "Cabaran Master 2",
      "Bina Prompt Master",
      "Cipta Prompt Master Anda",
      "Kemahiran Master Terbuka",
    ],
  },
  "5-2-fix-it-up": {
    en: [
      "Welcome to Prompt Clinic",
      "Spot the Problems",
      "Be the Prompt Doctor",
      "Why Spotting Weakness Helps",
      "Find the Fix",
      "Improve This Prompt",
      "Fix the Prompt",
      "Upgrade Challenge",
      "Prompt Fixer",
    ],
    ms: [
      "Selamat Datang ke Klinik Prompt",
      "Kenal Pasti Masalah",
      "Jadilah Doktor Prompt",
      "Kenapa Membaiki Prompt Penting",
      "Cari Pembaikan",
      "Baiki Prompt Ini",
      "Baiki Prompt Itu",
      "Cabaran Penambahbaikan",
      "Pembaiki Prompt",
    ],
  },
  "5-3-prompt-remix": {
    en: [
      "Ready to Remix",
      "Same Topic Different Results",
      "Try the Prompt Lab",
      "The Power of Remixing",
      "See the Remix",
      "Remix for Different Goals",
      "Try Different Remixes",
      "Create Your Remix",
      "Remix Master",
    ],
    ms: [
      "Sedia untuk Remix",
      "Topik Sama Hasil Berbeza",
      "Cuba Makmal Prompt",
      "Kuasa Mengadun Semula",
      "Lihat Adunan Semula",
      "Adun Semula untuk Matlamat Berbeza",
      "Cuba Adunan Semula Berbeza",
      "Cipta Adunan Semula Anda",
      "Pakar Adunan Semula",
    ],
  },
  "5-4-graduation-day": {
    en: [
      "Welcome to Graduation Day",
      "Look How Far You Have Come",
      "Proud of Your Journey",
      "Final Challenge 1",
      "Final Challenge 2",
      "The Ultimate Prompt Challenge",
      "Create Your Graduation Masterpiece",
      "You Did It",
    ],
    ms: [
      "Selamat Datang ke Hari Graduasi",
      "Lihat Betapa Jauhnya Anda Datang",
      "Bangga dengan Perjalanan Anda",
      "Cabaran Akhir 1",
      "Cabaran Akhir 2",
      "Cabaran Prompt Terunggul",
      "Cipta Karya Graduasi Anda",
      "Anda Berjaya",
    ],
  },

  // ==========================================
  // WORLDS 6-9 — Planetary Subject Missions
  // ==========================================
  "6-1-bm-kucing-peromfu": {
    en: [
      "Welcome to Mars: Malay Language Mission",
      "The Tale of Peromfu's Cat",
      "Challenge 1: Rhyme Words & Adjectives",
      "Challenge 2: Action Verbs & Dialogue",
      "Challenge 3: Magic Words of Politeness",
      "Challenge 4: Prompt Doctor Fix",
      "Mastery Boss: Malay Champion",
    ],
    ms: [
      "Selamat Datang ke Marikh: Misi Bahasa Melayu",
      "Kisah Kucing Peromfu",
      "Cabaran 1: Rima Kata & Kata Sifat",
      "Cabaran 2: Kata Kerja & Dialog Pantas",
      "Cabaran 3: Kata Ajaib Kesantunan",
      "Cabaran 4: Doktor Prompt Baiki Arahan",
      "Cabaran Unggul: Jaguh Bahasa Melayu",
    ],
  },
  "7-1-english-colorful-toys": {
    en: [
      "Welcome to Jupiter: English Language Mission",
      "The Toy Shop Explorer",
      "Challenge 1: Color & Object Keywords",
      "Challenge 2: Toy Shop Role-Play Prompt",
      "Challenge 3: Magic Words Dialogue",
      "Challenge 4: Fix the Toy Request",
      "Mastery Boss: English Dialogue Master",
    ],
    ms: [
      "Selamat Datang ke Musytari: Misi Bahasa Inggeris",
      "Peneroka Kedai Mainan",
      "Cabaran 1: Kata Kunci Warna & Objek",
      "Cabaran 2: Prompt Peranan Pembantu Kedai",
      "Cabaran 3: Kata Ajaib Perbualan Santun",
      "Cabaran 4: Doktor Prompt Baiki Arahan Mainan",
      "Cabaran Unggul: Jaguh Dialog English",
    ],
  },
  "8-1-matematik-tambah-bintang": {
    en: [
      "Welcome to Venus: Mathematics Mission",
      "Why Math Needs Clear Steps",
      "Challenge 1: Count Stars Step by Step",
      "Challenge 2: Constrain Output Format",
      "Challenge 3: Assemble Math Instructions",
      "Challenge 4: Fix the Vague Math Prompt",
      "Mastery Boss: Cosmic Math Champion",
    ],
    ms: [
      "Selamat Datang ke Zuhrah: Misi Matematik",
      "Kenapa Matematik Perlu Langkah Jelas",
      "Cabaran 1: Kira Bintang Langkah Demi Langkah",
      "Cabaran 2: Tetapkan Format Jawapan",
      "Cabaran 3: Susun Formula Prompt Matematik",
      "Cabaran 4: Rawat Prompt Matematik Kabur",
      "Cabaran Unggul: Jaguh Matematik Angkasa",
    ],
  },
  "9-1-moral-sahabat-prihatin": {
    en: [
      "Welcome to Mercury: Moral Education Mission",
      "Supporting Our Classmates",
      "Challenge 1: Empathetic Advice Doctor",
      "Challenge 2: Sincere Encouragement Choice",
      "Challenge 3: Assemble Caring Support Prompt",
      "Challenge 4: Words of Encouragement",
      "Mastery Boss: Ambassador of Caring Values",
    ],
    ms: [
      "Selamat Datang ke Utarid: Misi Pendidikan Moral",
      "Membantu Rakan Sekelas",
      "Cabaran 1: Nasihat Moral Yang Prihatin",
      "Cabaran 2: Bantuan Ikhlas vs Kesilapan",
      "Cabaran 3: Susun Prompt Tindakan Prihatin",
      "Cabaran 4: Kata Ajaib Nilai Murni",
      "Cabaran Unggul: Duta Sahabat Prihatin",
    ],
  },
  "10-1-sains-benda-hidup": {
    en: [
      "Welcome to Jupiter: Science Mission",
      "Living vs Non-Living Traits",
      "Challenge 1: Identify Living Characteristics",
      "Challenge 2: Observation Prompt vs Mistake",
      "Challenge 3: Heal the Science Prompt",
      "Challenge 4: Assemble Science Prompt Formula",
      "Challenge 5: Exploring the Natural World",
      "Mastery Boss: Jupiter Science Champion",
    ],
    ms: [
      "Selamat Datang ke Musytari: Misi Sains",
      "Ciri Benda Hidup & Bukan Hidup",
      "Cabaran 1: Kenal Pasti Ciri Benda Hidup",
      "Cabaran 2: Prompt Pemerhatian vs Kesilapan",
      "Cabaran 3: Rawat Arahan Sains",
      "Cabaran 4: Susun Formula Prompt Sains",
      "Cabaran 5: Kata Ajaib Penerokaan Alam",
      "Cabaran Unggul: Jaguh Sains Musytari",
    ],
  },
  "11-1-sejarah-garis-masa": {
    en: [
      "Welcome to Saturn: History Mission",
      "Chronological Sequence & Respect",
      "Challenge 1: Chronological Time Keywords",
      "Challenge 2: Courteous Interview vs Rude Request",
      "Challenge 3: Heal the Timeline Prompt",
      "Challenge 4: Assemble Chronological Prompt Formula",
      "Challenge 5: Meaningful Milestones",
      "Mastery Boss: Saturn History Champion",
    ],
    ms: [
      "Selamat Datang ke Zuhal: Misi Sejarah",
      "Urutan Kronologi & Adab Bertanya",
      "Cabaran 1: Kata Penanda Masa Kronologi",
      "Cabaran 2: Prompt Temu Bual Santun vs Kasar",
      "Cabaran 3: Rawat Arahan Garis Masa",
      "Cabaran 4: Susun Formula Prompt Kronologi",
      "Cabaran 5: Kata Ajaib Garis Masa Bermakna",
      "Cabaran Unggul: Jaguh Sejarah Zuhal",
    ],
  },
  "12-1-rbt-bentuk-asas": {
    en: [
      "Welcome to Uranus: Design & Tech Mission",
      "3D Building Blocks & Stability",
      "Challenge 1: Choose a Sturdy Structural Base",
      "Challenge 2: Geometric Prompt vs Design Mistake",
      "Challenge 3: Heal the Builder Prompt",
      "Challenge 4: Arrange Design Prompt Formula",
      "Challenge 5: Planetary Rover Vehicle",
      "Ultimate Challenge: Uranus Design Champion",
    ],
    ms: [
      "Selamat Datang ke Uranus: Misi RBT",
      "Blok Geometri & Kestabilan Struktur",
      "Cabaran 1: Pilih Tapak Struktur yang Kukuh",
      "Cabaran 2: Prompt Geometri vs Kesilapan Reka Bentuk",
      "Cabaran 3: Rawat Arahan Jurubina",
      "Cabaran 4: Susun Formula Prompt Reka Bentuk",
      "Cabaran 5: Kata Ajaib Kenderaan Penjelajah Angkasa",
      "Cabaran Unggul: Jaguh Reka Bentuk Uranus",
    ],
  },
  "13-1-psv-warna-imaginasi": {
    en: [
      "Welcome to Neptune: Visual Arts Mission",
      "Primary Colors & Expressive Lines",
      "Challenge 1: Choose Primary Colors & Expressive Lines",
      "Challenge 2: Visual Art Prompt vs Sketch Mistake",
      "Challenge 3: Heal the Young Artist Prompt",
      "Challenge 4: Arrange Visual Art Prompt Formula",
      "Challenge 5: Neptune Tempest Canvas",
      "Ultimate Challenge: Neptune Art Champion",
    ],
    ms: [
      "Selamat Datang ke Neptun: Misi Seni Visual",
      "Warna Primer & Corak Garisan Seni",
      "Cabaran 1: Pilih Warna Asas dan Garisan Seni",
      "Cabaran 2: Prompt Seni Visual vs Kesilapan Lakaran",
      "Cabaran 3: Rawat Arahan Pelukis Cilik",
      "Cabaran 4: Susun Formula Prompt Seni Visual",
      "Cabaran 5: Kata Ajaib Kanvas Ribut Neptun",
      "Cabaran Unggul: Jaguh Seni Neptun",
    ],
  },
};

// Backwards-compatibility alias for Plan 06 consumer
export const WORLD_1_TO_3_SECTION_TITLES = ALL_LESSON_SECTION_TITLES;

/**
 * Returns the localized section title for a given locale, slug, and 0-based section index.
 * Returns undefined if the slug or index is not found in that locale.
 */
export function getSectionTitle(
  locale: string,
  slug: string,
  index: number
): string | undefined {
  if (locale !== "en" && locale !== "ms") {
    return undefined;
  }
  const lesson = ALL_LESSON_SECTION_TITLES[slug];
  if (!lesson) {
    return undefined;
  }
  const titles = lesson[locale as "en" | "ms"];
  if (!titles || index < 0 || index >= titles.length) {
    return undefined;
  }
  return titles[index];
}

/**
 * Returns all section titles for a given locale and slug.
 */
export function getAllSectionTitles(
  locale: string,
  slug: string
): string[] | undefined {
  if (locale !== "en" && locale !== "ms") {
    return undefined;
  }
  const lesson = ALL_LESSON_SECTION_TITLES[slug];
  if (!lesson) {
    return undefined;
  }
  return lesson[locale as "en" | "ms"];
}
