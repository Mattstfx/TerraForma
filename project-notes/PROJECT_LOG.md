# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:** Individual project
**Startup name:** TerraForma
**Live site link:** Pending GitHub Pages setup

---

## Work sessions

### Session — 2026-11-06 — driver: student

- **Goal for this session:** Narrow TerraForma to a course-sized MVP and replace the generic starter experience with a working sample-property planning demo.
- **Key prompts we gave Copilot** (paste the important ones):
  1. “Ok lets work on the MVP and lets summarize and update the project files.”
  2. The product direction discussed: a useful basic experience without sign-in; treat persistent/higher-value services as a possible paid tier, not as real checkout in the course prototype.
- **What worked:** Built a responsive, no-library prototype around one fictional Atlantic Canada property. Visitors can select sample observations on an illustrative map, add/remove proposed features, and keep the sample plan in this browser. The dashboard makes sample data visible and labels unverified content.
- **What broke, and how we fixed it:** No breakages found in the initial checks. JavaScript syntax and whitespace checks passed; browser checks confirmed location selection, adding/removing a plan item, and persistence across reloads.
- **Committed?** no — not committed yet.

### MVP scope agreed for the class prototype

- **Core demo:** Explore one fictional property, inspect three sample site observations, and add or remove a few proposed homestead features at sample locations.
- **Course concept shown in the site:** Property information is organized into a sample data dashboard. These numbers and notes are fictional and do not claim to be real measurements.
- **Free/no-sign-in experience:** The demo requires no account. Plan edits are stored in browser local storage on the current device only; there is no cloud sync or account recovery.
- **Not in this MVP:** Real property registration or boundary measurement, uploaded/geotagged photos, live geographic or environmental datasets, AI advice, accounts, cross-device saving, and payment processing.
- **Guardrails:** Use only fictional property details; label observations, estimates, and illustrative map content; keep the student-project footer; do not make real login or payment forms.
- **Business case:** The student will write the argument, examples, and final wording. The current worksheet remains a prompt, not an AI-written submission.

Use the block below for each future work session:

### Session — [date] — driver: [first name]

- **Goal for this session:**
- **Key prompts we gave Copilot** (paste the important ones):
  1.
  2.
- **What worked:**
- **What broke, and how we fixed it:**
- **Committed?** yes / no — commit message:

---

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| | | | |

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| | | |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?
2. Which parts were easy, and which were hard? Why do you think that is?
3. If a competitor had the same AI tool, how long would it take them to copy your site?
