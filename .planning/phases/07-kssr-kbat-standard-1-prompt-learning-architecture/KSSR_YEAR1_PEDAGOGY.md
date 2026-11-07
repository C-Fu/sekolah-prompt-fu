# KSSR Semakan Standard 1 (Tahun 1) Prompt-Engineering & KBAT Pedagogy

## 1. Executive Summary & Educational Vision

Sekolah Prompt-Fu introduces a pioneering educational model: **teaching foundational AI prompting literacy through the lens of national primary curriculum standards (KSSR Semakan)**. 

Rather than viewing AI as an external answer engine, primary school pupils (aged 7 / Standard 1) collaborate with **Peromfu**—a friendly school robot classmate—to solve curriculum challenges. By helping Peromfu prompt simulated AI models, pupils internalize:
1. How to ask clear, unambiguous questions.
2. How to specify constraints (format, length, role, tone).
3. How to critically evaluate and verify AI outputs (KBAT / Higher Order Thinking Skills).

---

## 2. Subject DSKP Standards & Prompt Competency Mapping

| Subject & Planet | MOE KSSR Semakan DSKP (Tahun 1) | Prompt Engineering Competency | Target KBAT Cognitive Skill | Interactive Widget Application |
| :--- | :--- | :--- | :--- | :--- |
| **Bahasa Melayu**<br>*(Bulan / Moon)* | **DSKP 5.1:** Memahami & menggunakan golongan kata (Kata Nama Am/Khas, Kata Kerja asas).<br>**DSKP 3.2:** Membina & menulis ayat mudah. | **Specificity & Keyword Guidance:** Instructing AI with clear nouns and action verbs to produce distinct narrative scenes. | **Menganalisis & Mengaplikasi:** Dissecting sentence components and guiding AI to complete the story accurately. | `WordPredictor`<br>`DragDropPrompt` |
| **Sains**<br>*(Bumi / Earth)* | **DSKP 3.1:** Benda Hidup & Benda Bukan Hidup (Ciri-ciri: bernafas, perlu makanan/air, bergerak, membesar, membiak).<br>**DSKP 4.1:** Deria Manusia. | **Classification & Rule Constraints:** Formulating negative constraints and explicit rules (e.g. *"Only classify things that breathe as living"*). | **Menilai & Mengelaskan:** Detecting when an AI mixes up classification criteria and correcting the rule prompt. | `PromptDoctor`<br>`ExampleMatcher` |
| **Matematik**<br>*(Marikh / Mars)* | **DSKP 1.2:** Nilai nombor hingga 100.<br>**DSKP 2.1:** Operasi asas tambah & tolak.<br>**DSKP 7.1:** Bentuk dua dimensi (segi empat, segi tiga, bulatan). | **Format Constraints & Exact Output:** Directing AI to give concise numerical answers, step-by-step counting, or strict mathematical number sentences. | **Mengaplikasi & Menilai:** Formulating math prompts that enforce step-by-step reasoning rather than guessing. | `StepByStep`<br>`PromptVsMistake` |
| **Bahasa Inggeris**<br>*(Zuhrah / Venus)* | **DSKP 1.2:** Understand meaning in simple familiar contexts.<br>**DSKP 2.1:** Communicate simple information (classroom objects, colors, greetings). | **Role-Playing & Persona:** Prompting AI to adopt a polite persona (e.g. friendly teacher, classroom buddy) with simple vocabulary limits. | **Mencipta:** Building multi-part prompts (Role + Context + Action) for interactive role-play. | `DragDropPrompt`<br>`PromptParts` |
| **Pendidikan Moral**<br>*(Utarid / Mercury)* | **DSKP 2.1:** Memberi bantuan & tolong-menolong.<br>**DSKP 5.1:** Beradab sopan & berbudi pekerti dalam pergaulan. | **Tone, Courtesy & Ethical Boundaries:** Instructing AI with kindness and empathy to suggest ethical, helpful solutions to daily social dilemmas. | **Menilai & Membuat Keputusan:** Evaluating whether an AI recommendation is respectful, inclusive, and polite. | `PromptDoctor`<br>`PromptVsMistake` |

---

## 3. The 3-Tier KBAT Prompt Progression for Standard 1

### Level 1: Mengingat & Memahami (Pattern Recognition & Word Choice)
- **Pupil's Task:** Identify which keywords trigger the right AI response.
- **Example Scenario (BM - Kata Kerja):**
  - *Peromfu says:* "Saya mahu AI melukis arnab yang sedang bergerak pantas! Perkataan apa yang patut saya gunakan dalam arahan?"
  - *Options:* `melompat` (correct), `tidur`, `kerusi`, `biru`.
  - *Pedagogical Value:* Connects the concept of action verbs directly to algorithmic instruction.

### Level 2: Mengaplikasi & Menganalisis (Error Diagnosis / Prompt Doctor)
- **Pupil's Task:** Read an ambiguous prompt that failed, analyze *why* the AI got confused, and pick or drag the missing constraint.
- **Example Scenario (Sains - Benda Hidup):**
  - *Flawed Prompt:* "Senaraikan benda di dalam bilik darjah."
  - *AI Output:* "Meja, papan putih, kipas, lampu." (Peromfu's homework asks for living things!).
  - *Doctor Fix:* Add constraint: *"Senaraikan benda HIDUP sahaja (contohnya: murid, cikgu, pokok bunga)."*
  - *Pedagogical Value:* Teaches that AI outputs mirror prompt specificity.

### Level 3: Menilai & Mencipta (Structured Multi-Part Assembly)
- **Pupil's Task:** Assemble a full prompt containing **[Siapa/Role] + [Buat Apa/Task] + [Syarat/Constraint]**.
- **Example Scenario (Matematik - Operasi Tambah):**
  - *Block 1 (Role):* "Bertindak sebagai pembantu matematik"
  - *Block 2 (Task):* "Kira jumlah 5 biji epal merah dan 3 biji epal hijau"
  - *Block 3 (Constraint):* "Tulis ayat matematik dan jawapan sahaja (5 + 3 = 8)"
  - *Pedagogical Value:* Introduces professional prompt structuring in an intuitive visual blocks format.

---

## 4. Assessment & Success Criteria
1. **Zero Hallucination Tolerance in Core Knowledge:** The simulated AI responses reflect 100% verified KSSR curriculum facts.
2. **Immediate Formative Feedback:** When an incomplete or vague prompt is submitted, Peromfu provides helpful reflection (e.g. *"AI bingung kerana kita tidak beritahu sama ada kita mahu nombor atau perkataan!"*).
3. **Bilingual Parity:** All prompts, feedback, and simulated outputs have exact semantic parity between Bahasa Melayu (`ms`) and English (`en`).
EOF
