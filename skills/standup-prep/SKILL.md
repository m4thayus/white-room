---
name: standup-prep
description: Use before the weekly Mercury standup. Sweeps GitHub, Linear, git log and Slack for what shipped and what's still open, reconciles it against last week's prep and recap notes, and writes the week's standup-prep note to the vault. Triggers on "standup prep", "prep for standup", "build my standup notes", and "what should I say at standup".
---

# Standup Prep

Build the note you walk into standup with: what shipped, what's still open, what's blocking you.

This is the personal, no-MCP-for-Zoom sibling of a sweep — Mercury Analytics runs one for its
roadmap docs, pulling from GitHub, Linear, a Zoom-transcribed standup summary in Gmail, and Slack.
This skill has no Gmail or Zoom connection, so the meeting side comes from `standup-recap`, a
separate skill invoked once the notes markdown exists. This skill only builds the *prep* — before
the meeting, from sources that don't need a human to hand them anything.

## Where the note goes

`~/Vault/meetings/YYYY-MM-DD-standup-prep.md`, dated for the coming standup. The vault README
covers the folder's purpose; nothing here changes it.

## The window

Window start is the date on the newest existing `*-standup-prep.md` in `~/Vault/meetings/`. Window
end is today. If no prep note exists yet, ask for a start date rather than guessing one.

## Preflight — last week's notes

Read the two notes from the previous cycle: `<prior-date>-standup-prep.md` and
`<prior-date>-standup-recap.md`. Both should already be in the vault — the recap is what carries
last week's meeting outcome forward.

**If either is missing, stop and ask for it** — a path, or pasted markdown — rather than building
this week's note blind. Don't guess what was said last week.

## The four sources

**GitHub — the spine.** PRs across `mercuryanalytics`, merged and open, plus PRs you reviewed.

```
gh search prs --owner mercuryanalytics "merged:>=<date>" --author=@me --json number,title,repository,closedAt --limit 50
gh search prs --owner mercuryanalytics --state open --updated ">=<date>" --author=@me --json number,title,repository,updatedAt,isDraft --limit 50
gh search prs --owner mercuryanalytics "merged:>=<date>" --reviewed-by=@me --json number,title,repository,closedAt --limit 50
```

Put the date filter in the query string. `--merged-at` as a flag silently returns empty.

**Linear.** `mcp__linear__list_issues` for the Product and Engineering teams, filtered by
`updatedAt` at the window start and `assignee` you. `mcp__linear__get_issue` on anything that
moved, to check its linked PR before crediting it as shipped.

**Git log.** For work with no PR behind it — direct-to-main commits, WIP that never opened one:

```
git log --author=<your email> --since=<date> --oneline --no-merges
```

Run it across the Mercury repos under `~/Projects/mercury/*` that have in-window activity.

**Slack — signal, not shipped work.** `#technology-team-internal` (memory has the channel ID).
Resolve your own user ID with `slack_read_user_profile` (no `user_id` argument), then:

```
slack_search_public "from:<@your-id> after:<window-start>"
```

Read anything you posted for priority cues and things you said you'd raise. This never becomes a
"Last week" bullet on its own — it only corroborates or contextualizes what GitHub and Linear
already show.

## Reconcile

**Merge state is truth.** A Linear issue marked `Done` with no merged PR behind it is a claim, not
a fact — flag it, don't credit it. A PR that's open, however confidently something else describes
it as shipped, is not shipped.

**Carry-over comes from last week's prep, checked against this week's sources.** Take last week's
`This week` items. Anything no source confirms as done becomes an "Owed from `<date>`" line this
week. If the same item was already carried last week too, say how many weeks running — that count
is what makes a stale item visible instead of quietly re-listed forever.

**Last week's recap corrects the record, not last week's prep file.** If the meeting surfaced
something the prep note didn't know about, or resolved a "still open" item during the discussion,
fold that into this week's `Last week` section. Never edit the old prep note itself.

**If `memory/mercury/standup-agenda.md` exists**, read its `Pending` section for items you've
flagged to raise. Surface unraised ones under `Process item to raise` — this skill reads that note,
it doesn't maintain it.

## The note

```
---
date: YYYY-MM-DD
tags: [standup, mercury]
---

## Last week

- **#nnnn merged — <what it does>.** <one line of context, if it needs one>
- Owed from <prior-date> (N weeks running) — <item>, still <state>

## This week

1. **<imperative>.** <why this, why now>

## Blockers / risks

- <blocker> — waiting on <who/what>

## Process item to raise

- <item from standup-agenda.md, if any are pending>
```

Drop a section entirely rather than leaving it empty. `Process item to raise` only appears when
`standup-agenda.md` has something pending.

**Show the draft and wait for a yes before writing it.** Nothing here is destructive, but the note
is what you'll say out loud — worth one read first.
