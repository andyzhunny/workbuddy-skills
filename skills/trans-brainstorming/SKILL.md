---
name: trans-brainstorming
slug: trans-brainstorming
version: 1.0.0
description: "Guide translation projects through structured dialogue — clarify source intent, target audience, tone, and constraints before producing any translated output."
---

# Trans-Brainstorming: Translation Intent Before Output

Help translate content accurately and purposefully through collaborative dialogue — understand the source, the audience, and the constraints BEFORE producing any translation.

Start by reading the source material and asking targeted questions one at a time. Once the translation brief is clear, present the approach and get user approval.

<HARD-GATE>
Do NOT produce any translation output, parallel text, or localized content until you have presented a translation brief and the user has approved it. This applies to EVERY translation task regardless of perceived simplicity.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Brief"

Every translation goes through this process. A button label, a legal clause, a poem — all of them. "Simple" translations are where register mismatches and cultural blind spots cause the most damage. The brief can be short, but you MUST present it and get approval.

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Read source material** — understand domain, genre, register, and key terms
2. **Ask clarifying questions** — one at a time, understand purpose / audience / constraints
3. **Propose 2-3 translation strategies** — with trade-offs and your recommendation
4. **Present translation brief** — target language, register, terminology conventions, cultural adaptation notes; get user approval
5. **Produce translation** — deliver the translation aligned with the approved brief
6. **Post-translation review** — self-check for consistency, omissions, terminology drift
7. **User review gate** — ask user to confirm or request revisions
8. **Finalize & document** — save glossary / brief to `docs/translation/YYYY-MM-DD-<topic>-brief.md` if useful long-term

## Process Flow

```
Source Reading
     ↓
Clarifying Questions (one at a time)
     ↓
Propose 2-3 Strategies → User selects
     ↓
Present Translation Brief → User approves?
     ├─ No → Revise Brief
     └─ Yes
          ↓
     Produce Translation
          ↓
     Post-translation Self-Review
          ↓
     User Review Gate
          ├─ Changes requested → Revise & re-review
          └─ Approved → Finalize & Document
```

**The terminal state is a finalized translation with an approved brief.** Do NOT skip the brief-approval gate.

## The Process

**Reading the source:**

- Note the domain (legal, literary, technical, marketing, UI/UX, academic, casual…)
- Identify register: formal / neutral / colloquial / poetic
- Flag culturally bound expressions, idioms, proper nouns, and domain-specific terms
- Note any ambiguities in the source that must be resolved before translating

**Asking clarifying questions:**

- One question per message — never a batch
- Cover: target audience, intended use, register in the target language, terminology preferences, length constraints, cultural adaptation level
- Prefer multiple-choice when options are bounded (e.g., "Formal or colloquial?")
- Stop when the brief is clear enough to translate with confidence

**Exploring strategies:**

- Propose 2-3 distinct translation strategies (e.g., literal fidelity vs. natural fluency vs. localised adaptation)
- State trade-offs: what each approach preserves vs. sacrifices
- Lead with your recommendation and explain why for this specific text

**Presenting the translation brief:**

- Target language & locale (e.g., zh-CN vs. zh-TW, es-MX vs. es-ES)
- Register & tone
- Terminology decisions (key term mappings)
- Cultural adaptation level: preserve foreign references / partially adapt / fully localise
- Format & length constraints

## After the Brief

**Producing the translation:**

- Translate aligned with the approved brief
- Preserve source structure unless the brief specifies otherwise
- Flag in-line any terms or passages where you made a judgment call

**Post-translation Self-Review:**

1. **Terminology drift:** Are key terms consistent throughout?
2. **Register consistency:** Does the tone hold from start to finish?
3. **Omissions/additions:** Does every source idea have a target-language counterpart?
4. **Cultural appropriateness:** Any expressions that land wrong in the target culture?

Fix issues inline before presenting to the user.

**User Review Gate:**

> "Here's the translation aligned with our agreed brief. Please check it and let me know if you'd like any adjustments."

Wait for confirmation. If changes are requested, update and re-run the self-review loop.

**Documentation (when warranted):**

- Save the brief and any glossary to `docs/translation/YYYY-MM-DD-<topic>-brief.md`
- For recurring projects, maintain a running glossary file

## Key Principles

- **One question at a time** — don't stack interrogation
- **Brief before output** — never translate blind
- **Terminology first** — agree on key terms before full translation
- **Register is meaning** — a tone mismatch can be as wrong as a word error
- **Flag judgment calls** — transparency beats silent decisions
- **Cultural adaptation is a spectrum** — always clarify where on it the user wants to be

## Quick Reference

| Topic | File |
|-------|------|
| Translation strategy patterns | `strategies.md` |
| Common domain glossaries | `glossaries.md` |
| Cultural adaptation guide | `cultural-adaptation.md` |
