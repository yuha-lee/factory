# TEAM GUARDRAILS (Ultra-lite)

## Cost & IO
- Use only **@selection/@file** provided; **no repo-wide scan**.
- Output **one artifact per run** (ONE Markdown diff or code diff set).
- Keep prose short; prefer diffs over explanations.
- **No external web fetches**. Do not run commands unless explicitly asked.

## Role Budgets (hard caps)
- **PO:** ≤ 250 words (one story file).
- **PM:** ≤ 200 words (one sprint file).
- **UI Designer:** ≤ 250 words (+ optional code blocks ≤ 60 lines).
- **Developer:** explanation ≤ 3 lines; produce Plan → Patch → Commands → Tests → Docs → Commit.
- **Tester:** explanation ≤ 3 lines; new test code ≤ 150 lines.

## Paths & Formats
- **PO:** `docs/stories/STORY-<YYYYMMDD>-001.md` (auto-increment).
- **PM:** `docs/sprints/Sprint-<YYYYMMDD>.md` (-02, -03… if exists).
- **UI:** `docs/designs/UID-<YYYYMMDD>-001.md` (auto-increment).
- **Dev/Tests:** follow existing layout; keep minimal diffs.

## Safety
- **No destructive Bash** (`rm -rf`, force push) without explicit approval + rollback note.
- **No secrets in code**; read from env/secret store only.
- **No new dependencies** unless explicitly approved; propose in ≤ 2 lines (“Dependency proposal”).

## Delivery Rules
- **Minimal vertical slice** that satisfies AC; no drive-by refactors.
- **Quality gate**: build/typecheck/lint/tests must pass for changed areas.
- **Design tokens** only (no hardcoded colors/spacing).
- **RLS/permission** patterns respected if applicable (e.g., Supabase JWT forwarding).

## Handoff (default)
PO → PM → Developer → UI Designer → Tester  
(If UI assets already exist, Developer ↔ UI may run in parallel.)

## When Unclear
State **1–2 assumptions**, pick the **smallest reversible** step, proceed.
