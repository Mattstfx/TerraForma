# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:** Individual project
**Startup name:** TerraForma
**Live site link:** Pending GitHub Pages setup

---

## Work sessions

### Session — 2026-11-07 — driver: student

- **Goal for this session:** Advance the non-AI MVP with a useful property brief, pre-planning checks, and an accurate seven-layer / cross-cutting-role model.
- **What worked:** Added a locally saved property brief for region, household goals, available time, rough budget comfort, water access, and soil information. Added seven review prompts covering property rights/setbacks, utilities, well/septic, water and drainage, soil, rules, and access/maintenance, with notes, progress, clear limits, and an explicit recovery action for unreadable saved data. Kept the checklist advisory; it does not block concept drawings or certify a site. Clarified layer descriptions including layer 6 (root/rhizosphere), made the optional nitrogen-fixer role explicitly cross-cutting, and made example candidates selectable in both their physical layer and functional-role selector. AI remains outside the MVP.
- **Accuracy, privacy, and migration notes:** Brief/check data uses a separate localStorage key from plans, asks for no exact address, and does not alter saved plan records. Checklist status means user-reviewed only, not verified or approved. Utility-locate and conservation-planning links include jurisdiction caveats.
- **What we checked:** JavaScript syntax, diff formatting, layer/profile/source references, and editor diagnostics. Browser stress checks covered blank and saved briefs, reload persistence, preservation of existing plan storage, malformed-data error/recovery, progress accounting, root-layer guidance, overlapping Alder layer/function labels, saved/reloaded guild plans, and narrow-screen overflow.
- **Committed?** no — not committed yet.

### Session — 2026-11-07 — driver: student

- **Goal for this session:** Give the permaculture, landscape, and homestead perspectives a more substantive design foundation rather than presenting loosely related tips as expert recommendations.
- **What worked:** Reframed the perspectives around distinct goals and practical sequences: permaculture ethics, observation, system relationships, small trials and feedback; landscape user needs, site inventory, circulation, views, scale, accessibility and maintenance; homestead household goals, capacity, infrastructure, seasonal work, storage and record-keeping. Expanded idea-specific cautions and added relevant links to David Holmgren, USDA NRCS, the Royal Horticultural Society, and University of Maine Cooperative Extension.
- **Accuracy and scope notes:** The lenses are educational planning approaches, not advice from real professionals. NRCS is U.S.-specific, RHS guidance is UK context, and Maine gardening information does not supply an Atlantic Canada calendar. Recommendations do not assume the fictional property's unknown measurements, soil, plant identity, drainage, yields, cost, or safety conditions.
- **What we checked:** JavaScript syntax, diff formatting, that every lens has four process steps and valid references, and that every suggested idea maps to an existing feature. Browser checks confirmed each perspective renders its process, links, and ideas.
- **Committed?** no — not committed yet.

### Session — 2026-11-07 — driver: student

- **Goal for this session:** Deepen the plant catalog without filling evidence gaps with guesses, and make the scope of each source visible.
- **What worked:** Added 48 profile records with source links, grouped facts, explicit unknowns, and regional caveats. Connected every selectable species entry—including fruit-tree types—to a profile, narrowed several choices to identified taxa, and kept forest-garden examples clearly distinct from care recommendations. Removed tansy and broom from the selectable guild list; added species-specific comfrey safety/spread cautions. Updated the source-coverage note and removed the unused legacy auto-selection routine and duplicate pea/tomato facts.
- **Accuracy and migration notes:** New England and Minnesota facts remain labeled by jurisdiction; a forest-garden layer citation is not evidence of local suitability, companion benefits, or nitrogen transfer. Existing saved plan data was not altered.
- **What we checked:** JavaScript syntax and diff whitespace; a data audit found no missing source IDs or profile IDs among selectable species. Browser checks covered keyboard-focus and click cards, source links, apple/pear/plum tree cards, comfrey cautions, all seven guild layers, and removal of tansy/broom from choices.
- **Committed?** no — not committed yet.

### Session — 2026-11-07 — driver: student

- **Goal for this session:** Add transparent plant-information cards, make bed settings easier to configure, and avoid presenting unsupported guild or crop-fit claims as facts.
- **What worked:** Added hover-, keyboard-, and tap-accessible plant cards that display cited notes and clearly identify missing profiles. Added one sun-exposure and one watering-method setting per bed, with auto-selection limited to cited crop profiles matching both settings. Added an at-a-glance guild layer/role summary and explicitly stated that selected layers do not establish companion compatibility or benefits.
- **Accuracy and migration notes:** Tomato, pea, and apple cultivar details cite University of Minnesota Extension and are labeled Minnesota-specific, not Atlantic Canada recommendations. Other candidate menu entries are not assigned invented care stats. Pear and plum cultivar names can be entered from a local source and are labeled user-provided rather than app-verified. Existing saved plans remain supported, including older companion selections, which are now labeled unverified.
- **What we checked:** JavaScript syntax, diff whitespace, browser checks for verified-fit crop selection, no-selection behavior for unsupported conditions, cited tomato and apple cards, guild layer choices and summary, user-entered pear cultivar, saved bed settings, no browser errors, and a narrow mobile viewport.
- **Committed?** no — not committed yet.

### Session — 2026-11-07 — driver: student

- **Goal for this session:** Make plant choices clearer and more configurable, and distinguish real layer/species examples from verified guild compatibility.
- **Key prompts we gave Copilot** (paste the important ones):
  1. “Are the options for each guild and combination for the drop down menus all based on factual info and real guild companions?”
  2. “You should be able to choose a piece of infrastructure and be able to select what goes into it ... rotation schedule using the amount of days ... select strains to the grafted trees or what kind of plants can fit in the vegetable beds.”
  3. “Auto select which plants go in each bed or guild based on common traits such as watering levels and fertilizer amounts ... guilds should offer various options for each level ... six or seven levels.”
- **What worked:** Replaced confusing gray, non-selectable category headers with high-contrast feature choices. Added configurable crop beds and greenhouses, cultivar/scion selection for single and multi-grafted fruit-tree plans, seven forest-garden layers, compost/habitat infrastructure choices, editable crop maturity-day estimates, and a date-based succession/rotation review reminder. Added a rough tag-matching auto-select and source links with clear limits.
- **What broke, and how we fixed it:** Initial browser assertions counted optional maturity inputs as extra crop checkboxes and expected an empty guild after auto-selection. Refined the checks to distinguish input types and reset auto-selected values before testing the empty state; no application defect was found.
- **Research and accuracy note:** Earlier companion options were illustrative, not validated combinations. The updated layer framework and some species examples reference the Agroforestry Research Trust; Maine vegetable cultivar examples and gradual apple-pruning context link to University of Maine Cooperative Extension. Compatibility, the sample water/fertility tags, and regional suitability remain unverified; auto-select is not a planting recommendation.
- **What we checked:** JavaScript syntax and diff formatting; browser checks for selectable menus, source links, rough-tag auto-selection, user-entered maturity schedules, rotation reminders, multi-grafted scions, all seven guild layers, configurable infrastructure, perspective-idea customization, and mobile layout.
- **Committed?** no — not committed yet.

### Session — 2026-11-07 — driver: student

- **Goal for this session:** Let visitors draw proposed feature areas on the sample map, keep the total within the sample parcel, and explore plant guilds, varieties, habitat, and pest-prevention concepts.
- **Key prompts we gave Copilot** (paste the important ones):
  1. “Add into the map where the new things are going to be added in the plan. The map should be interactive and anything in the plans should only be able to use the amount of property.”
  2. “Guilds should be implemented and the option to choose varieties and specific plants and trees … add ways to attract beneficial bugs and animals while repelling the non-beneficial ones.”
  3. “I also have a multigrafted apple tree and want obscure ideas like dwarf fruit trees planted close at 45-degree angles along a fence, and keep them aggressively pruned.”
- **What worked:** Added interactive, drawn map footprints; parcel-boundary and overlap checks; approximate land-use totals; keyboard and pointer placement; local saving and migration of earlier saved ideas; selectable fruit examples and apple-guild companions; habitat and physical pest-exclusion concepts. Added the angled dwarf-apple fence concept as an experiment to research, with rootstock, spacing, support, and pruning cautions.
- **What broke, and how we fixed it:** The observation-marker overlay initially intercepted map clicks. Routed drawing through the map frame and excluded marker/feature clicks. Made the form jump to the map without a smooth-scroll race.
- **What we checked:** JavaScript syntax and diff whitespace; browser checks for saved-plan migration, guild and variety choices, drawn and keyboard footprints, persistence after reload, outside-boundary and overlap rejection, perspective placement, and a 390px mobile layout.
- **Committed?** no — not committed yet.

### Session — 2026-11-07 — driver: student

- **Goal for this session:** Add switchable design viewpoints so visitors can compare how different priorities shape ideas for the same sample property.
- **Key prompts we gave Copilot** (paste the important ones):
  1. “Add a few options or viewpoints from an expert to the user ... allow it to flip between types and give multiple views on it from different perspectives.”
  2. “Permaculture could be focused on that view and the landscaping viewpoint could focus on the aesthetics.”
- **What worked:** Added interactive Permaculture Designer, Landscape Designer, and Homestead Grower perspectives, each with distinct priorities, a planning question, and sample ideas visitors can add to their local plan. Verified all three switches, adding a perspective idea to the plan, saving it across reloads, removing it, and mobile layout without horizontal page overflow.
- **What broke, and how we fixed it:** An initial browser check matched both the perspective idea and the same feature already in the plan; refined the check to target plan entries specifically. The feature itself worked as expected.
- **Committed?** no — not committed yet.

### Session — 2026-11-06 — driver: student

- **Goal for this session:** Narrow TerraForma to a course-sized MVP and replace the generic starter experience with a working sample-property planning demo.
- **Key prompts we gave Copilot** (paste the important ones):
  1. “Ok lets work on the MVP and lets summarize and update the project files.”
  2. The product direction discussed: a useful basic experience without sign-in; treat persistent/higher-value services as a possible paid tier, not as real checkout in the course prototype.
- **What worked:** Built a responsive, no-library prototype around one fictional Atlantic Canada property. Visitors can select sample observations on an illustrative map, add/remove proposed features, and keep the sample plan in this browser. The dashboard makes sample data visible and labels unverified content.
- **What broke, and how we fixed it:** No breakages found in the initial checks. JavaScript syntax and whitespace checks passed; browser checks confirmed location selection, adding/removing a plan item, and persistence across reloads.
- **Committed?** yes — initial MVP committed and pushed as `f8e36cd`.

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
