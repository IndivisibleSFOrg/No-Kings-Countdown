# DR-0002 — Release Notes Policy

Canonical rules for writing and updating `public/releases/<major>.<minor>.md` files — the summaries shown in the in-app ReleaseModal.

---

## Selection criteria

Include a change if and only if it is **directly perceptible to an ordinary user** during normal use.

**Include:**
- New UI features or controls
- Changes to existing UI behaviour
- Meaningful layout or visual redesigns
- New pages or navigation destinations

**Exclude:**
- Internal refactors (storage migrations, composable reorganisation)
- Design token or CSS variable changes
- Analytics instrumentation
- Build info, CI, or deployment changes
- Dev tooling (ESLint, Stylelint, Husky, etc.)
- Bug fixes unless the bug was user-visible and the fix is noticeable

---

## Ordering

Order bullets from **highest to lowest reach and impact**:

1. Changes that affect every user on every visit (e.g. layout, card behaviour)
2. Changes visible on common paths (e.g. action detail modal, score display)
3. One-time UX improvements users encounter only once (e.g. guided tour)
4. Niche or optional features (e.g. artist credits page)

---

## Format

One bullet per feature. No section headings. No introductory paragraph.

```markdown
- **Feature name** — one sentence describing what changed and why it matters to the user.
```

- Bold heading names the feature
- Em dash separates heading from description
- Sentence is from the user's perspective ("you can now…", "past actions flip open…")
- Plain version numbers in filenames and dropdowns (`1.2`, not `v1.2`)

---

## Prompt for AI-assisted writing

> Write or update `public/releases/<major>.<minor>.md` for this release.
>
> Include only user-visible changes. Exclude internal refactors, storage migrations, design token cleanup, analytics instrumentation, dev tooling, and build info changes — even significant ones — unless they directly change what a user sees or does.
>
> Order bullets from highest to lowest reach: changes that affect every user on every visit rank first; one-time UX improvements (tours, onboarding) rank below persistent UI changes; cosmetic or niche changes rank last.
>
> Format: one bullet per feature, bold heading + em dash + one sentence. No section headings, no introductory paragraph. Plain version numbers (e.g. `1.2`, not `v1.2`).
