/**
 * Localized Section Title Registry for Kids Lessons
 * Provides explicit, ordered BM and EN titles for each Section within lesson MDX.
 *
 * Rules:
 * - Specific, natural titles derived from lesson headings, activities, and pedagogical flow.
 * - Indexed in exact source Section order (0-based) for both locales.
 * - Missing/unknown locale, slug, or index returns undefined (no silent fallback).
 */

export interface SectionTitleLookup {
  en: string[];
  ms: string[];
}

export const WORLD_1_TO_3_SECTION_TITLES: Record<string, SectionTitleLookup> = {
  // --- WORLD 1 ---
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

  // --- WORLD 2 ---
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

  // --- WORLD 3 ---
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
};

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
  const lesson = WORLD_1_TO_3_SECTION_TITLES[slug];
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
  const lesson = WORLD_1_TO_3_SECTION_TITLES[slug];
  if (!lesson) {
    return undefined;
  }
  return lesson[locale as "en" | "ms"];
}
