# Translation Strategy Patterns

Use this file to pick and explain strategies during the "Propose 2-3 approaches" step.

---

## The Three Core Axes

Every translation strategy sits somewhere on three axes. Be explicit about where you land on each.

### 1. Fidelity ↔ Fluency

| Pole | What it means | Best for |
|------|--------------|----------|
| **Fidelity (formal equivalence)** | Stay close to source structure and word order | Legal documents, sacred texts, academic citations |
| **Fluency (dynamic equivalence)** | Prioritise natural target-language expression | Marketing copy, UI text, fiction, speeches |
| **Balanced** | Match meaning and tone without distorting either | Most professional and editorial translation |

### 2. Foreignisation ↔ Domestication

| Pole | What it means | Best for |
|------|--------------|----------|
| **Foreignisation** | Preserve source-culture references, transliterate names | Literary translation, cultural education, global brand names |
| **Domestication** | Replace source-culture items with target-culture equivalents | Children's books, advertising, casual content |
| **Hybrid** | Foreignise proper nouns, domesticate idioms | General publishing, subtitles |

### 3. Literal ↔ Adaptive

| Pole | What it means | Best for |
|------|--------------|----------|
| **Literal** | Word-for-word where possible | Interlinear glosses, technical specs, controlled language |
| **Adaptive** | Rewrite as needed to achieve same effect | Slogans, poetry, humour, UX microcopy |
| **Sense-for-sense** | Translate meaning, not words | Standard professional default |

---

## Named Strategy Presets

Use these as shorthand when proposing approaches.

### Strategy A — Documentary
> Preserve source structure, terminology, and cultural markers. Reader is expected to encounter "foreignness".
- **Pros:** Maximal fidelity, traceable to source
- **Cons:** Can feel stiff or alien; requires reader effort
- **Trigger:** Academic, legal, archival, interlinear

### Strategy B — Communicative
> Translate for equivalent effect in target language and culture. Structure and idioms adapted.
- **Pros:** Natural, reader-friendly
- **Cons:** Some source nuance lost; harder to back-trace
- **Trigger:** Marketing, product copy, journalism, speeches

### Strategy C — Localisation
> Full cultural adaptation — references, units, dates, humour, metaphors all swapped for target-culture equivalents.
- **Pros:** Maximally natural for target audience
- **Cons:** May diverge significantly from source; requires cultural expertise
- **Trigger:** Apps, games, children's content, advertising campaigns

### Strategy D — Transcreation
> Source is treated as a brief, not a script. Output can differ substantially in form while matching intent.
- **Pros:** Best emotional impact in target language
- **Cons:** High creativity required; output is least traceable to source
- **Trigger:** Slogans, brand taglines, poetic UI copy, creative fiction

---

## Recommending a Strategy

When proposing approaches, lead with your recommendation:

> "For this text I'd recommend **Strategy B (Communicative)** because the source is conversational and your target audience expects natural Chinese. Here are the three options with their trade-offs…"

Then present all three. Let the user choose or refine.

---

## Strategy Mismatch Warnings

Flag these before translating:

| Mismatch | Signal | Ask |
|----------|--------|-----|
| Legal text requested in casual register | "Plain language rewrite" of contract | "Should I preserve legal precision or prioritise readability?" |
| Marketing copy requested as literal | Client says "translate exactly" | "A literal translation of this slogan won't land. Want me to adapt for effect?" |
| Poetry requested word-for-word | "Keep the rhyme scheme" in a non-rhyming target language | "Strict meter may break meaning. Prioritise form or meaning?" |
| Technical manual requested as literary | "Make it sound nice" | "I can improve readability while keeping technical accuracy — confirm scope?" |
