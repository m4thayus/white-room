---
name: request-review
description: Use when a pull request needs reviewers. Picks two, assigns them on GitHub, then posts one Slack message tagging them with the link and a sentence of context. Triggers on "request review", "request review on #123", "get eyes on this PR", "assign reviewers", "who should review this", and naming the reviewers outright, as in "ask Scott and Priya to review #123".
---

# Request Review

Two reviewers on a pull request, assigned on GitHub, announced once in Slack.

## What this skill owns

Choosing the two candidates, assigning them, and writing the Slack message. It does not own the
review, and it does not own the roster.

**The roster lives outside this skill.** A name like "Scott" maps to a GitHub handle and a Slack
member ID somewhere in the host configuration — agent memory, a project `CLAUDE.md`, a contributors
file, `slack_search_users`. Resolve it there every time. This skill carries no mapping of its own,
because a roster written into a public repo goes stale and then pings the wrong person.

**Ask rather than guess an identifier.** A wrong handle assigns a stranger, and a wrong Slack ID
tags one.

## Steps

### 1. Resolve the pull request

Take the number or URL the user gave. With neither, read the current branch's PR:

```
gh pr view --json number,url,title,isDraft,author,files
```

A draft PR gets no reviewers by default. Say it is a draft and ask before going on.

### 2. Find the candidates

Stop at the first source that yields two people.

1. **Names in the invocation win outright.** "Ask Scott and Priya" ends the search. Resolve their
   handles and move to step 3.
2. **CODEOWNERS for the changed paths.** Read `.github/CODEOWNERS` in the target repo.
3. **Recent committers on the changed paths.** `git log -n 20 --format='%an %ae' -- <paths>`.

Exclude the PR author, the user, and anyone already requested. Fewer than two candidates left means
ask the user for the second name rather than reaching further down the list.

### 3. Propose the two, then stop

Name both, one line each on why that person. Wait for the user's yes.

**Why the stop:** an assignment emails the reviewer, and the Slack message pings them again. Getting
the pair wrong costs two people an interruption and cannot be unsent.

### 4. Assign on GitHub

```
gh pr edit <number> --add-reviewer <handle>,<handle>
```

### 5. Post one Slack message

Invoke `white-room:communique` for the wording. It owns the mention syntax and the show-before-send
gate, and this skill adds only the shape below.

Resolve the channel by name from the host configuration, or with `slack_search_channels`. Confirm
the channel with the user when more than one name matches.

Send after the user approves the wording. One message covers both reviewers — never one message each.

## The shape of the message

```
<@U01ABCDEF> <@U02GHIJKL> review when you have a moment: https://github.com/acme/api/pull/812
— swaps the export queue to per-account locks.

Scott: the migration ordering. Priya: the retry path.
```

Tags first, then the link, then one sentence on what the PR does. The focus lines are optional, one
line per reviewer, and only when a reviewer needs pointing at something specific.

**Left to its own devices this message runs long. Do not:**

- Restate the PR description. The link carries it.
- Summarize the diff, or list the files.
- Use bullets, headings, or a second paragraph of context.

## When the Slack MCP is absent

Print the message for the user to paste, and write the reviewers as `@Name` rather than `<@U…>`.
Slack renders the `<@U…>` form only through the API, so a pasted ID shows as raw text and tags
nobody. Say that the user has to retype each mention for the tag to take.
