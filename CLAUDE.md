# CLAUDE.md — Claude Code Orientation

Read these files before doing anything:

1. [README.md](./README.md) — project overview, stack, and all development commands
2. [CONTRIBUTING.md](./CONTRIBUTING.md) — issue workflow, branching, commits, PRs, code style, and CLI notes for agents

## Key File Locations

| Concern | Canonical source |
|---|---|
| All pnpm scripts | `package.json` → `scripts` |
| Design tokens (Tailwind names → CSS vars) | `tailwind.config.js` |
| Design token hex values | `assets/css/main.css` `:root` block |
| Design system rationale and component patterns | `docs/decision-records/DR-0001-design-system.md` |
| Release notes selection, format, and AI prompt | `docs/decision-records/DR-0002-release-notes-policy.md` |
| Design component reference | `docs/design-library.html` |
| ESLint rules | `eslint.config.ts` |
| Build data parsing | `utils/parseBuildData.ts`, `composables/googleSheets.ts` |
| Analytics provider layer | `composables/analytics/` |
