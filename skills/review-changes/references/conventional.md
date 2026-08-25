# Writing a comment

This file owns the craft of one comment: the Conventional Comments format, the labels, the decorations, the mentions, and the framing.

Use the [Conventional Comments](https://conventionalcomments.org/) format.

```
<label> [decoration]: <subject>

<discussion>
```

The subject is one short line carrying the ask and nothing else. Reasoning, context, and next steps
go below the blank line.

Labels, and the distinction each one carries:

- `issue:` A specific problem with the code. Blocking unless it says otherwise.
- `suggestion:` An improvement to the code. Name the replacement, not just the objection. Add
  `(blocking)` when the change is necessary rather than optional.
- `question:` A potential concern you genuinely do not know the answer to. Never a rhetorical device
  for an objection you have already formed.
- `nitpick:` Trivial and preference-based. Always non-blocking. Covers typos and polish.
- `thought:` An idea that came out of reading the diff, not a request. Always non-blocking. Keep it
  to a couple of lines.
- `chore:` Process rather than code. A changelog entry, a ticket link, a screenshot.
- `praise:` Worth keeping. No decoration.

Naming the stance lets the sentence stay plain, because an unlabelled comment leaves the author to
read severity out of tone, where a hedge reads as optional and a plain statement reads as a demand.

Decorations: `(blocking)`, `(non-blocking)`, `(if-minor)`. The last one hands the judgment to the
author, who resolves it only if the fix stays small. Add a decoration only where the label leaves
severity open. Never stack two. Never decorate `nitpick:`, `thought:`, or `praise:`, because those
are non-blocking by definition.

**A retraction takes no label.** It is a reply that names what it retracts and why. Do not restate
the original comment, because the thread above it already carries the text.

**Address a person by `@login` once in a thread reply or a standalone PR comment,** because GitHub
notifies on the mention, not on the name. This covers a reply to the author, a reply to another
reviewer, and a retraction. Use the plain name after the first `@login` in the same comment, never
instead of it.

**Never `@`-mention anyone in a new inline comment,** because submitting the review already notifies
the author and a per-comment mention reads as shouting. Name the person plainly where the sentence
needs them.

Skip the `todo:` and `note:` labels from the specification. `todo:` collides with `TODO` comments
in code, which carry a different meaning to the team.

## Describe the change. Do not write it.

This governs every label. Name the approach, the existing helper to reach for, the invariant to
preserve, or the case the current code misses. Never hand the author a drop-in patch or a
paste-ready snippet, because a patch invites acceptance without reading and moves the design
decision from the person who owns the file to the person who skimmed it.

Use a code fragment only where the shape resists prose. A type signature, a single expression, or a
function name. Keep it short enough that pasting it would not compile on its own.

## Framing decides what the author does next

A change request is a prompt. Reviews get pasted into an agent as a matter of course, so the framing
picks the mode the reader drops into.

**Prescriptive framing produces execution mode.** A named fix gets good, well-scoped work. Its
ceiling is exactly your own insight. It cannot find what no comment points at. Its failure is subtle.
A correctly-scoped fix retires the only symptom of a defect. The defect stays, and the fixer correctly
reports it as out of scope.

**Diagnostic framing produces design mode.** Naming the problem and leaving the fix open finds things
no comment pointed at. Its failure is a finding that is directionally real with a wrong
recommendation attached.

So: when the right fix is genuinely unclear, say so and leave it open. An open question is what
licenses a redesign. When a comment is prescriptive, know that it caps the result there.

## Volume is part of readability

Cut any comment that only restates the diff. Collapse repeats, per Step 4 of `SKILL.md`. Lead with
the blocking items. If more than about three findings block, say so at the top rather than making
the reader count.
