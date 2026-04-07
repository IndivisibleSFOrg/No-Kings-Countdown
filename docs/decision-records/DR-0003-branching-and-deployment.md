# DR-0003 — Branching and Deployment Strategy

**Status:** Accepted (amended 2026-04-07)
**Date:** 2026-03-13
**Amended:** 2026-04-07
**Deciders:** Reece

---

## Context

The project is a statically generated Nuxt site. As of the 2026-04-07 amendment, the repo hosts two distinct civic-action sites from a single codebase, each on its own long-lived branch and deployed to its own domain.

### Deployment targets

| Branch | Domain | Purpose |
|---|---|---|
| `no-kings-countdown` (production) | `nokingscountdown.org` | No Kings Countdown — stable, user-facing; updates on explicit `nkc/x.y.z` releases |
| `no-kings-countdown` (integration) | `nkc.nokingscountdown.org` | Reflects current state of `no-kings-countdown`; used for review before tagging |
| `main` (integration) | `goodtroubledaily.org` | Good Trouble Daily — reflects current state of `main` |
| PR previews | ephemeral URL | Per-PR preview; URL posted as PR comment |

### Branching model

The repo has two long-lived branches:

- **`no-kings-countdown`** — maintenance branch for the No Kings Countdown site. Accepts only bug fixes and minor content updates. Released via `nkc/x.y.z` tags.
- **`main`** — active development branch for the Good Trouble Daily generalized platform. Short-lived feature branches are cut from `main`, named `{type}/{issue-number}-{short-kebab-description}`, and merged back via merge commit.

Tags serve two distinct purposes:

1. **NKC release tags** (`nkc/x.y.z`) — mark a production release of the No Kings Countdown site; drive the in-app `appVersion` via `git describe`, populate `releaseVersionIndex` via `git for-each-ref`, and gate the NKC production deploy
2. **Semver release tags** (`x.y.z`) — future production releases of the Good Trouble Daily platform on `main`
3. **Non-semver tags** — used for other product surfaces such as in-app feature tour anchors; these must never trigger a production deploy

### The Vercel integration problem

Vercel's native GitHub integration is branch-based. It has no first-class understanding of tags. The only available workaround — an "Ignored Build Step" shell script configured in the Vercel dashboard — can be made to work, but it places critical deploy logic in an invisible UI text field outside version control. That is not acceptable.

### Build environment constraint

The Nuxt build resolves two pieces of version metadata at build time using git commands:

- `git describe --always --tags` for `appVersion`
- `git for-each-ref refs/tags` to build `releaseVersionIndex`

Both require a full git history with all tags present. Vercel's own build environment does not guarantee access to git tags. All deploy workflows therefore run the build on the GitHub Actions runner — using `vercel build` (which invokes `pnpm generate`) with `fetch-depth: 0` and `fetch-tags: true` — and upload the pre-built output to Vercel with `vercel deploy --prebuilt`. Vercel does no rebuilding of its own.

### Single Vercel project

Both sites share one Vercel project. Only `no-kings-countdown` tagged releases occupy the Vercel "production" slot (and thus `nokingscountdown.org` via the project's production domain assignment). The `main` branch deploys as a Vercel preview and is pinned to `goodtroubledaily.org` via `vercel alias set`. Both custom domains are registered in the Vercel project so Vercel provisions SSL certificates for them.

The consequence: `main` always uses Vercel's Preview-tier environment variables. This is acceptable as long as both sites share the same backend configuration. If they diverge in ways that require different Production-scoped secrets, a second Vercel project would be needed.

---

## Decision

Disable Vercel's native GitHub integration entirely (`"github": { "enabled": false }` in `vercel.json`) and drive all deployments from GitHub Actions.

### Workflows

| Workflow | Trigger | Target | Deployed to |
|---|---|---|---|
| `deploy-production.yml` | Push of tag matching `nkc/[0-9]+.[0-9]+.[0-9]+` | Vercel production | `nokingscountdown.org` |
| `deploy-nkc-branch.yml` | Push to `no-kings-countdown` | Vercel preview, aliased | `nkc.nokingscountdown.org` |
| `deploy-main.yml` | Push to `main` | Vercel preview, aliased | `goodtroubledaily.org` |
| `deploy-preview.yml` | PR opened, synchronized, or reopened | Vercel preview | ephemeral URL (posted as PR comment) |

The production workflow uses `vercel deploy --prebuilt --prod`; the others use `vercel deploy --prebuilt` (preview environment). The branch workflows additionally run `vercel alias set` to pin each preview deployment to its stable domain.

Non-semver tags and untagged commits do not trigger a production deploy. The NKC tag pattern `nkc/[0-9]+.[0-9]+.[0-9]+` is intentionally exact — it matches `nkc/1.4.0` but not bare semver or non-release tags.

### GitHub Pages

`nuxtjs_deploy.yml` (GitHub Pages) is disabled. Vercel is the sole production host as of the 1.4.0 release (2026-03-13).

### Secrets required

All Vercel workflows depend on three repository secrets:

- `VERCEL_TOKEN` — API token for the Vercel CLI
- `VERCEL_ORG_ID` — Vercel organization ID
- `VERCEL_PROJECT_ID` — Vercel project ID (single project serves both branches)
