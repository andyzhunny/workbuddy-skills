# Cultural Adaptation Guide

How to calibrate cultural adaptation during the clarifying-questions phase and the brief.

---

## The Adaptation Spectrum

```
Preserve ←————————————————————————————→ Replace
  |                                          |
Foreign references kept             Target-culture equivalents
Source idioms transliterated        Source idioms replaced
Names unchanged                     Names adapted or translated
Units/dates in source format        Units/dates converted
Humour explained or kept            Humour swapped for local equivalent
```

Agree with the user on where this project sits **before** translating.

---

## Clarifying Questions for Cultural Adaptation

Ask ONE of these per message as needed:

- "Should I keep the original cultural references (e.g., place names, holidays) or replace them with [target-culture] equivalents?"
- "The source uses imperial measurements. Should I convert to metric?"
- "There's an idiom here that doesn't exist in [target language]. Should I find a local equivalent, explain it, or preserve it with a footnote?"
- "The humour relies on a [source language] pun. Would you like a replacement joke, a literal note, or to drop it?"
- "Should names be transliterated, translated by meaning, or left as-is?"

---

## Common Cultural Traps by Domain

### Legal / Contractual
- **Trap:** Legal concepts may not map 1-to-1 (e.g., "consideration" in common law has no exact civil-law counterpart)
- **Rule:** Flag non-equivalent concepts explicitly; never silently substitute
- **Ask:** "There's no direct equivalent of [term] in [target legal system]. Should I use the nearest term + a note, or keep the source term?"

### Marketing / Advertising
- **Trap:** Colour symbolism, number associations, cultural taboos vary widely
- **Rule:** Always ask about cultural sensitivity review before finalising
- **Common checks:** 
  - Colour: red = luck (China) vs. danger (West)
  - Numbers: 4 (death in East Asia), 13 (West)
  - Gestures, body language in imagery descriptions

### Technical / Software (i18n/l10n)
- **Trap:** String length expansion (German +30%, Arabic RTL layout)
- **Trap:** Date/time formats (MM/DD/YYYY vs DD/MM/YYYY vs YYYY-MM-DD)
- **Trap:** Currency, number separators (1,000.00 vs 1.000,00)
- **Rule:** Always confirm locale, not just language (zh-CN ≠ zh-TW)

### Literary / Creative
- **Trap:** Meter, rhyme, alliteration rarely survive literal translation
- **Rule:** Agree upfront on what the translation must preserve (rhythm? imagery? tone? all of the above?)
- **Ask:** "This poem's effect comes from its rhyme scheme. Should I prioritise sound or meaning in the translation?"

### Academic
- **Trap:** Citation styles, discipline-specific terminology, hedging conventions vary by language and field
- **Rule:** Preserve academic register; do not simplify
- **Ask:** "Should I keep the source's citation format or convert to [target style]?"

---

## Adaptation Flags: What to Surface to the User

Before translating, explicitly flag:

1. **Culturally bound idioms** — and your proposed treatment
2. **Untranslatable terms** — and your proposed workaround (loan word / explanation / equivalent)
3. **Cultural sensitivities** — anything that could be offensive or misleading in the target culture
4. **Format discrepancies** — dates, units, currency, names

Format your flag as:
> ⚠️ **Cultural flag:** [source expression] — [why it's an issue] — [proposed treatment]. Confirm?

---

## Locale Shortlist

When a language is specified without a locale, confirm:

| Language | Common locales to clarify |
|----------|--------------------------|
| Chinese | zh-CN (Simplified) vs zh-TW (Traditional) vs zh-HK |
| Spanish | es-ES vs es-MX vs es-AR |
| Portuguese | pt-BR vs pt-PT |
| Arabic | ar (Modern Standard) vs dialect (eg. ar-EG, ar-SA) |
| French | fr-FR vs fr-CA |
| English | en-US vs en-GB vs en-AU |

Never assume zh = zh-CN without asking.
