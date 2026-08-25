---
name: communique
description: Use before any text leaves this session for a human other than the user — a Slack message or DM, a PR review body or comment, an issue body, a commit message someone else reads. Covers drafting the wording, showing it to the user before it sends, writing for a recipient who has none of this session's context, and repairing something already sent. Triggers on "send this", "post it", "reply to them", "comment on the PR", "request changes", "DM them", "write the commit message", and any gh pr review, gh pr comment or Slack send.
---

<!-- Sync: user or project instructions invoke this skill by name, as `white-room:communique`.
     Renaming the skill or the plugin breaks every one of those invocations, and nothing here
     catches it. The other end is whatever CLAUDE.md or AGENTS.md names the skill. -->

# Communique

Anything leaving this session for a human other than the user. Slack messages and DMs, PR review
bodies and comments, issue bodies, commit messages others will read.

## Show the wording before it goes out

Draft the body, show it inline, and ask — even when the user has already said "post it", "send it"
or "request changes".

**The instruction authorizes the action, not the wording.** "Put together our findings and
request changes" means assemble and be ready. It does not mean fire.

**Why:** these go to real people. Tone and framing are the part the user most wants final say on,
and once sent they re-ping and cannot be cleanly unsent.

## Tag the first mention

Use the platform's mention syntax the first time you name someone. Every later mention in the same
message is the bare name.

**A message that opens a topic cold gets the tag.** No prior thread, nothing the recipient already
tracks — the tag marks where the new thing starts. A DM opens cold like anything else, so it gets
the tag too.

Time sensitivity is a separate signal. A cold open earns the tag whether or not the ask has a
deadline.

Every platform with a mention syntax follows the same rule. These are the ones this session
reaches.

| Platform | First mention |
|---|---|
| GitHub | `@handle` |
| Linear | `@handle` |
| Slack | `<@U01ABCDEF>`, which renders as their display name |

Slack also broadcasts to a whole channel, and this is where time sensitivity gets said out loud.

| Broadcast | Reaches | Connotes |
|---|---|---|
| `<!here>` | members currently active | act on this today |
| `<!channel>` | every member, active or not | the channel is blocked until someone does |

A broadcast never replaces the tag on the person who owns the ask. Name them too, or nobody
owns it.

Look up handles and IDs wherever this project keeps them — agent memory, a contributors file, a
team roster in the docs. Ask rather than guess an ID, because a wrong ID pings the wrong person.

## If it already went out

Offer the repair rather than leaving it.

- PR review bodies edit in place: `gh api PATCH /repos/{owner}/{repo}/pulls/{n}/reviews/{id}`
- PR and issue comments edit and delete
- Slack messages edit

## Assume the recipient has none of our context

Unless there is positive evidence otherwise — they were on the thread, it is in the PR, they
said it themselves — everything discussed in this session is invisible to them.

Two consequences:

1. Never retract or amend something they never received. A draft shown only to the user does not
   exist to them.
2. Never drop in a detail that surfaced in side discussion without introducing it fresh.

Reread every reference as the recipient before sending. Anything they have not seen either gets
stated as new, with its why, or gets cut.

**Why:** unexplained context is worse than no context. It sends them hunting for a message they
never got, or assuming they forgot something. On a long-running review that is actively
corrosive, because each round then has both sides working from information the other lacks.

## The user's edits to a draft are proposals, not copy to transcribe

When the user responds to draft wording they are reacting to the substance and steering it. Take
each note as a constraint or a correction. Reconcile it against the rest of the message, drop what
it makes redundant, and rewrite.

**Why:** pasting spoken notes straight through produces a worse message than either of you would
write. It abandons judgment exactly where judgment matters — what to include, what a colleague
can act on, what needs no saying.

## Commit messages

Conventional Commits, in every repo.

    type(scope): subject

- **Types in use:** `feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `build`. Pick the one
  that describes the change, not the files it touched.
- **Scope** is lowercase and names the area — `claude`, `tmux`, `viewer`, `auth`. Omit it when
  the change is repo-wide.
- **Subject** is lowercase and imperative, with no trailing period.
- **Append the issue ref where the project does.** Read the recent log first, and match it:
  `fix(export): drop the duplicate header row from CSV output (ENG-1234)`. GitHub adds the PR
  number on squash merge, so never write that yourself.

## Two habits to drop on the way through

1. Preemptively absolving the recipient. "So you applied the rule correctly", "that's not on you".
2. Reaching for a specific example when a general statement is what was asked for.
