# Phase 07 Context: KSSR & KBAT Standard 1 Prompt-Learning Architecture

## 1. Vision & Core Decisions

### Core Objective
Design the educational and planetary architecture where primary school students (Standard 1 / Tahun 1) learn **prompt engineering and AI literacy** through Malaysian **KSSR Semakan (Kurikulum Standard Sekolah Rendah)** syllabus subjects, infused with **KBAT (Kemahiran Berfikir Aras Tinggi / Higher Order Thinking Skills)**.

### Planetary & Cartographic Architecture (World Structure)
- **Separate Training Grounds:** The existing 19-level Prompt Land island (`/map`) remains as the foundational **Training Ground (Pusat Latihan Asas AI)**, teaching raw prompt mechanics (clarity, detail, context, role-play).
- **Subjects = Celestial Bodies / Planets:**
  - **Bahasa Melayu (BM):** Moon (Bulan)
  - **Sains:** Earth (Bumi)
  - **Matematik:** Mars (Marikh)
  - **Bahasa Inggeris (English):** Venus (Zuhrah)
  - **Pendidikan Moral:** Mercury (Utarid)
- **Tahun 1–6 = Continents & Geological Features:**
  - Each planet contains geological provinces / major features (basins, seas, volcanoes, rifts) that map to **Tahun 1 through Tahun 6**.
  - **Tahun 1 Scope:** Initial accessible entry continent / region on each planet.
  - **Final Boss / Milestone Lock:** The most prominent planetary landmark (e.g. Olympus Mons on Mars, South Pole-Aitken on Moon, Maxwell Montes on Venus, Caloris Basin on Mercury) serves as the advanced milestone "Final Boss" arena.

### Character & Story Dynamics
- **Peromfu as a Student / Classmate:** Peromfu is not a lecturing teacher. Peromfu is a cute school robot attending Standard 1 alongside the player!
- **Collaborative Problem-Solving:** The player and Peromfu team up to tackle classroom challenges, school assignments, and science experiments. The child helps Peromfu construct and refine prompts so Peromfu's AI brain produces the accurate, creative answers needed for their homework and quests.

### Prompt Simulation & Pedagogy (KSSR & KBAT Integration)
- **Prompt-First Pedagogy:** The central skill being evaluated is always how well the child prompts (specifying roles, giving clear constraints, formatting requests, checking AI responses). Subject content from KSSR DSKP provides authentic, relatable scenarios.
- **KBAT Integration:**
  - *Menganalisis (Analyzing):* Spotting what's wrong with a vague prompt or finding hallucinations in Peromfu's output (PromptDoctor).
  - *Menilai (Evaluating):* Comparing two prompt outputs to judge which fulfills the textbook assignment better (ExampleMatcher, PromptVsMistake).
  - *Mencipta (Creating):* Assembling multi-part prompts (Role + Task + Constraint) to write a poem or solve a math story problem (DragDropPrompt, WordPredictor).
- **Gamified Simulation Engine:** Deterministic, interactive widgets with rich feedback and instant reaction from Peromfu (happy/excited/thinking pixel art expressions).

## 2. Subject Breakdown for Standard 1 (Tahun 1)

### 1. Bahasa Melayu (Moon / Bulan)
- **Region:** Oceanus Procellarum / Mare Tranquillitatis
- **KSSR Topics:**
  - Kemahiran Mendengar & Bertutur: Ucapan selamat, memberi respons.
  - Tatabahasa Asas: Kata nama am & khas (manusia, haiwan, benda), Kata kerja.
  - Bina Ayat Mudah: Subjek + Kata Kerja + Objek.
- **Prompt-Learning Challenge:**
  - Helping Peromfu prompt an AI storyteller to write a 3-sentence animal story with specific kata nama and kata kerja.

### 2. Sains (Earth / Bumi)
- **Region:** Geo-terranes (Biosphere & Living Zones)
- **KSSR Topics:**
  - Benda Hidup dan Benda Bukan Hidup (Ciri-ciri: bernafas, membiak, membesar).
  - Deria Manusia (Mata, telinga, lidah, hidung, kulit).
  - Bahagian Tubuh Haiwan & Tumbuhan.
- **Prompt-Learning Challenge:**
  - Instructing Peromfu to prompt an AI scientist with clear classification rules to categorize living vs non-living things without mixing them up.

### 3. Matematik (Mars / Marikh)
- **Region:** Elysium Planitia / Valles Marineris
- **KSSR Topics:**
  - Nombor Bulat hingga 100 (Nilai tempat: puluh & sa, membilang).
  - Tambah & Tolak asas dalam lingkungan 100.
  - Bentuk 2D (segi empat sama, segi empat tepat, segi tiga, bulatan).
- **Prompt-Learning Challenge:**
  - Giving AI strict numeric constraints: *"Kira bilangan buah epal dalam bakul dan tunjukkan jawapan dalam bentuk ayat matematik (bukan perkataan panjang)"*.

### 4. English Language (Venus / Zuhrah)
- **Region:** Ishtar Terra / Sedna Planitia
- **KSSR Topics:**
  - Phonics, greetings, family & classroom objects.
  - Action verbs and simple adjectives (colors, sizes).
- **Prompt-Learning Challenge:**
  - Crafting a polite role-play prompt: *"Act as a friendly shopkeeper. Ask me what color crayon I want in one simple sentence."*

### 5. Pendidikan Moral (Mercury / Utarid)
- **Region:** Borealis Planitia
- **KSSR Topics:**
  - Nilai Kerjasama, Hormat-menghormati, Kejujuran di sekolah & rumah.
- **Prompt-Learning Challenge:**
  - Moral dilemmas: Prompting AI to suggest kind, respectful actions when a classmate drops their pencils or feels left out.

## 3. Technical & Implementation Boundaries
- Preserves 100% static export (`output: 'export'`) with GitHub Pages compatibility.
- Fully localized in Bahasa Melayu (`ms`) and English (`en`) with zero silent fallback.
- Re-uses existing robust MDX component registry (`src/components/kids/elements/`) with extensible props.
- Level progression and stars stored in existing client-side `localStorage` progress store.
EOF
