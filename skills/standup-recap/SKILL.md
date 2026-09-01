---
name: standup-recap
description: Use once the standup meeting notes markdown exists — pasted, or a file path. Files it into the vault under the standup's date, corrects transcription-mangled names against memory, and updates the standing state-of-work note from what the room actually said. Triggers on "file the standup recap", "here's the standup notes", "standup notes are ready", and pasting a Zoom-style meeting summary.
---

# Standup Recap

File the meeting's own record of standup, once it exists as markdown.

This is the second half of the pair with `standup-prep` — that skill builds what you walk in
with, this one files what came out. There's no Zoom or Gmail connection here, so the notes arrive
by hand: pasted, or as a path to a file already saved somewhere.

## Take the input

A file path, or pasted markdown. If neither is clearly a standup recap, ask which standup it's
for — don't guess a date from today, because recap notes get filed same-day but reviewed later.

## File it, verbatim

Write `~/Vault/meetings/YYYY-MM-DD-standup-recap.md`:

```
---
date: YYYY-MM-DD
tags: [standup, mercury]
source: zoom
---

<the body, unchanged except for the name correction below>
```

**Body stays as given.** This skill doesn't reshape the recap into house structure or second-guess
its content — the source is fallible in the way a transcript is fallible, not in the way a summary
is fallible.

## Correct names, nothing else

Zoom's transcription mishears names and project names — `memory/mercury/name-spellings.md` already
tracks known traps (Aaren → "Erin", for one). Check the body against that note and
`memory/mercury/github-handles.md` for people, and correct only what's a known or obvious phonetic
mishearing.

**Don't touch anything else.** Not phrasing, not structure, not a name you're merely unsure about.
A wrong guess corrupts the record; a left-alone misspelling is just a misspelling. If a correction
you make isn't already in `name-spellings.md`, that's worth adding there once, not re-deriving next
time.

## Update the state-of-work note

Read this week's `standup-prep.md` (same date) alongside the recap you just filed. Update
`memory/mercury/current-priorities.md` — one note, overwritten each week, not a new file — with
where the room's discussion diverged from the prep: what got confirmed, what got reprioritized,
what came up that the prep didn't know about.

**The prep note itself is never touched.** It's the record of what you walked in expecting; the
divergence is what the state note is for.

If `current-priorities.md` doesn't exist yet, create it as `type: project` with the same
`Observations` / `Why` shape the rest of `memory/mercury/` uses.

## What this skill doesn't do

No reconciling against older weeks, no chasing carry-over — that's `standup-prep`'s job next week,
reading the recap this skill just filed. This skill's whole scope is one meeting: file it, correct
names, update state.
