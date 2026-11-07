# Planetary Subject Worlds & Cartographic Architecture

## 1. System Overview

In Sekolah Prompt-Fu, academic subjects are embodied as **Planets** in a celestial educational solar system:
- 🌕 **Moon (Bulan):** Bahasa Melayu
- 🌍 **Earth (Bumi):** Sains (Science)
- 🔴 **Mars (Marikh):** Matematik (Mathematics)
- 🟡 **Venus (Zuhrah):** English Language
- 🟣 **Mercury (Utarid):** Pendidikan Moral

Each planet contains 6 distinct geological/topographical continents or regions corresponding directly to **Tahun 1 through Tahun 6 (Standards 1 to 6)**. The most formidable geological feature on each planet is designated as the **Final Boss Landmark** (e.g. Olympus Mons on Mars, South Pole-Aitken on the Moon, Maxwell Montes on Venus, Caloris Basin on Mercury).

---

## 2. Standard 1 Pilot Level Blueprints (For Phase 08 Execution)

Below are the 5 pilot level blueprints to be authored, localized, and tested in Phase 08:

### 1. BM Pilot: `bm-1-kucing-peromfu` (Moon / Oceanus Procellarum)
- **Title (BM):** *Kucing Comel Peromfu* | **Title (EN):** *Peromfu's Cute Cat*
- **Syllabus Focus:** DSKP 5.1.1 (Kata Nama Am & Kata Kerja Asas)
- **Prompt Mechanics:** `WordPredictor` & `DragDropPrompt`
- **Scenario:** Peromfu wants an AI artist to draw his playful kitten doing something active. The pupil selects the right action verb (`melompat`, `berlari`) instead of static adjectives to help the AI draw the scene.

### 2. Sains Pilot: `sains-1-benda-hidup` (Earth / Biosphere Sanctuary)
- **Title (BM):** *Penyiasat Benda Hidup* | **Title (EN):** *Living Things Detective*
- **Syllabus Focus:** DSKP 3.1.1 (Ciri-ciri Benda Hidup vs Bukan Hidup)
- **Prompt Mechanics:** `PromptDoctor` & `ExampleMatcher`
- **Scenario:** Peromfu asked the AI to find 3 living things in a garden, but the AI included a stone! The pupil diagnoses the prompt flaw and adds the explicit constraint: *"Pilih benda yang bernafas dan memerlukan makanan sahaja."*

### 3. Matematik Pilot: `matematik-1-tambah-bintang` (Mars / Elysium Planitia)
- **Title (BM):** *Kira Bintang di Marikh* | **Title (EN):** *Counting Stars on Mars*
- **Syllabus Focus:** DSKP 2.1.1 (Operasi Tambah dalam lingkungan 20)
- **Prompt Mechanics:** `StepByStep` & `PromptVsMistake`
- **Scenario:** Helping Peromfu prompt a math bot with strict format constraints to display the arithmetic equation (e.g., `4 + 5 = 9`) rather than rambling text.

### 4. English Pilot: `english-1-colorful-toys` (Venus / Ishtar Terra)
- **Title (BM):** *Mainan Berwarna-warni* | **Title (EN):** *Colorful Toys*
- **Syllabus Focus:** DSKP 2.1.2 (Communicating colors and simple classroom objects)
- **Prompt Mechanics:** `DragDropPrompt` (Role + Target + Color constraint)
- **Scenario:** Role-playing with a toy-shop assistant AI bot to ask politely for a specific toy with color specifications: *"Please show me two blue crayons."*

### 5. Moral Pilot: `moral-1-tolong-kawan` (Mercury / Borealis Planitia)
- **Title (BM):** *Sahabat Prihatin* | **Title (EN):** *A Caring Friend*
- **Syllabus Focus:** DSKP 2.1.1 (Memberi bantuan kepada rakan yang memerlukan)
- **Prompt Mechanics:** `PromptDoctor` & `PromptVsMistake`
- **Scenario:** A classmate drops their colored pencils in class. Peromfu prompts an advice bot to suggest the kindest, most respectful response.

---

## 3. Integration with Existing Game Engine
- The existing `/map` remains as the foundational **Prompt Academy (Pusat Latihan Asas)**.
- Planetary worlds are registered via `src/lib/kids/planets.ts` with clean TypeScript typings.
- All new pilot level MDX files will sit under `src/content/kids/ms/` and `src/content/kids/en/` using the established zero-fallback loader pattern.
EOF
