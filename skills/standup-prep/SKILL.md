---
name: standup-prep
description: >-
  Use before the weekly Mercury standup. Sweeps GitHub, Linear, git log and
  Slack for what shipped and what's still open, reconciles it against last
  week's prep and recap notes, and writes the week's standup-prep note to the
  vault. Triggers on "standup prep", "prep for standup", "build my standup
  notes", and "what should I say at standup".
---

# Standup Prep

Build the note you walk into standup with: what shipped, what's still open,
what's blocking you.

This is the personal, no-MCP-for-Zoom sibling of a sweep — Mercury Analytics
runs one for its roadmap docs, pulling from GitHub, Linear, a Zoom-transcribed
standup summary in Gmail, and Slack. This skill has no Gmail or Zoom connection,
so the meeting side comes from `standup-recap`, a separate skill invoked once
the notes markdown exists. This skill only builds the _prep_ — before the
meeting, from sources that don't need a human to hand them anything.

## Where the note goes

`~/Vault/meetings/YYYY-MM-DD-standup-prep.md`, dated for the coming standup. The
vault README covers the folder's purpose; nothing here changes it.

## The window

Window start is the date on the newest existing `*-standup-prep.md` in
`~/Vault/meetings/`. Window end is today. If no prep note exists yet, ask for a
start date rather than guessing one.

## Preflight — last week's notes

Read the two notes from the previous cycle: `<prior-date>-standup-prep.md` and
`<prior-date>-standup-recap.md`. Both should already be in the vault — the recap
is what carries last week's meeting outcome forward.

**If either is missing, stop and ask for it** — a path, or pasted markdown —
rather than building this week's note blind. Don't guess what was said last
week.

## The four sources

**GitHub — the spine.** PRs across `mercuryanalytics`, merged and open, plus PRs
you reviewed.

```sh
gh search prs --owner mercuryanalytics "merged:>=<date>" --author=@me --json number,title,repository,closedAt --limit 50
gh search prs --owner mercuryanalytics --state open --updated ">=<date>" --author=@me --json number,title,repository,updatedAt,isDraft --limit 50
gh search prs --owner mercuryanalytics "merged:>=<date>" --reviewed-by=@me --json number,title,repository,closedAt --limit 50
```

Put the date filter in the query string. `--merged-at` as a flag silently
returns empty.

**Linear.** `mcp__linear__list_issues` for the Product and Engineering teams,
filtered by `updatedAt` at the window start and `assignee` you.
`mcp__linear__get_issue` on anything that moved, to check its linked PR before
crediting it as shipped.

**Git log.** For work with no PR behind it — direct-to-main commits, WIP that
never opened one:

```sh
git log --author=<your email> --since=<date> --oneline --no-merges
```

Run it across the Mercury repos under `~/Projects/mercury/*` that have in-window
activity.

**Slack — signal, not shipped work.** `#technology-team-internal` (memory has
the channel ID). Resolve your own user ID with `slack_read_user_profile` (no
`user_id` argument), then:

```text
slack_search_public "from:<@your-id> after:<window-start>"
```

Read anything you posted for priority cues and things you said you'd raise. This
never becomes a "Last week" bullet on its own — it only corroborates or
contextualizes what GitHub and Linear already show.

## The meeting shape

Standup runs three sections. Two of them are yours, three minutes each. The
third belongs to the whole team.

1. **Last week** — what you did. Three minutes.
2. **This week** — what you will do. Three minutes.
3. **Process items** — the team section. Policies that bind everyone, and
   findings worth sharing.

**The note carries these three sections and no others.** Earlier versions added
`Still owed` and `Blockers / risks`. Both cut across the three slots, so the
note could not be read out loud. Every finding routes into exactly one of the
three instead.

**Route each finding by the slot you say it in, not by what kind of thing it
is.**

- Work you did → `Last week`. An item you owed and did not finish still happened
  last week, so say it there as a "Did not land" line.
- Work you will do → `This week`. A blocker on your own item goes here too,
  attached to that item. You are the person who says it, so it belongs in your
  slot.
- Anything that binds the whole team → `Process items`. A policy or convention
  question, a finding from a PR review or a code change that everyone should
  know, a scheduling call that crosses repos, admin, vacations.

**The test for the team section: does this change how everyone works, or does
everyone need to hear it?** Yes puts it in `Process items`. No leaves it in your
own two sections.

**Unowned work is not a process item.** The quarterly meeting walks the unowned
backlog, and this meeting does not. An issue nobody has picked up belongs in
that backlog, not in this note.

**Three minutes is about 400 spoken words.** Keep each personal section near
that.

## Writing rules

- **Every PR number carries its title, every time.** Repeat mentions included.
  Nobody in the room remembers a bare number.
- **Open each personal section with one bold lead sentence.** It is the sentence
  you say if the room interrupts you after five seconds.
- **Every top-level bullet stands alone.** Someone who has never heard of the
  item understands it from that one bullet. Nobody asks the follow-up question,
  so the bullet has to answer it.
- **A sub-bullet is the part you cut when three minutes run short.** Never park
  the context there.
- **Record a dropped item once, with the reason.** A silent deletion returns
  next week, because the reconcile step reads this note.

## Reconcile

**Merge state is truth.** A Linear issue marked `Done` with no merged PR behind
it is a claim, not a fact — flag it, don't credit it. A PR that's open, however
confidently something else describes it as shipped, is not shipped.

**Carry-over comes from last week's prep, checked against this week's sources.**
Take last week's `This week` items. Route anything no source confirms as done
through the three-section test above. Most carried items land in this week's
`This week`. One you will not pick up is a dropped item — record it once with
the reason and let it go.

**Last week's recap corrects the record, not last week's prep file.** If the
meeting surfaced something the prep note didn't know about, or resolved a "still
open" item during the discussion, fold that into this week's `Last week`
section. Never edit the old prep note itself.

**If `memory/mercury/standup-agenda.md` exists**, read its `Pending` section for
items you've flagged to raise. Surface unraised ones under `Process items` —
this skill reads that note, it doesn't maintain it.

**Check whether a note already exists for the coming date.** A prep note written
days ago covers only the days before it was written. Rebuild it across the full
window rather than starting a separate note, and say so before overwriting.

## The note

```markdown
---
date: YYYY-MM-DD
tags: [standup, mercury]
---

## Last week

**<one bold lead sentence — the headline of your three minutes>**

- **<what you did>.** <the detail that makes it matter>
  - <sub-detail, spoken only if asked>
- **Did not land: <item>.** <why, and what is actually left>

## This week

**<one bold lead sentence — the thing you most want the room to hear>**

1. **<imperative>.** <why this, why now>
   - <who is waiting, or what you commit to today>

## Process items

- **<the policy question, or the finding the team should have>.**
  <the evidence behind it>
  - <the specific question you want answered>
```

Drop a section when it is empty. `Process items` often is, and an empty week
there beats an item re-listed out of habit.

**Show the draft and wait for a yes before writing it.** Nothing here is
destructive, but the note is what you'll say out loud — worth one read first.
