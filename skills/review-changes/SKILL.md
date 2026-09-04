---
name: review-changes
description: Use when reviewing code changes. Covers a PR, a branch, a diff, changes since a commit, and your own work before you open a PR. Produces findings, inline comments in Conventional Comments format, and an Approve, Request Changes, or Comment verdict. It never edits the code, but it does check out the target, so run one review at a time in a working tree. Open a second worktree to review without stopping other work. Triggers on "review this PR", "review #1234", "review my branch", "review changes since main", "look at this PR", "request changes", "re-review", a later round on a PR you already reviewed, and a self-review before opening a PR.
---

# Review Changes

## What this skill owns

This skill owns the conduct of a review. That means five things.

1. Verifying what the author claims, independently.
2. Deciding which findings are real.
3. Deciding where each finding goes.
4. Writing each comment.
5. Choosing the verdict.

It does not own applying fixes.

**Name the three texts apart.** The author's text on the pull request is the **PR description**. The
top-level comment of the review you draft is the **review body**. The top-level comment of a review
an earlier round left is a **prior review body**. Never say "the body" unqualified, in either
artifact or in the session.

**The output is a draft, never a posted review.** Assemble the review body and every comment. Show
them. Wait for approval. Posting is the user's decision every time.

**The audience is the author, not the user running the review.** Write every line of the review body
and every comment for the person who wrote the code. Anything addressed to the user belongs in the
session instead, because the author has no use for it and no context for it.

## Four rules that bind the whole pass

**1. Notes-only. Produce findings. Do not edit.**

Run no Edit, no Write, and no `git mv` during a review, because a review produces the conclusions the
user can relay, not commits nobody asked for. An imperative-sounding phrase during a review
describes the work. It does not authorize the work. "Just do the crate shifting" characterizes a
change as mechanical. Only "make the change", or a clear equivalent, authorizes one.

Detect whose branch it is before any edit. Run `git log <base>..HEAD --format='%an'`. If any name
other than the user's appears, the branch is someone else's, and editing it steps on their work.
Stay in review mode until told otherwise. A branch the user pushed one commit to is still not the user's branch.

Self-review does not relax this rule on its own. Produce the findings first. Applying them is a
separate step the user asks for.

**2. Post once.**

Accumulate findings in the review directory, never in the work tree. Never post per file as the walk
proceeds, because piecemeal comments re-ping the author on every push and lose the framing one
considered pass gives. Post the whole review in one pass at the end.

One pass is not one call. A re-raise or a retraction is a reply on its own thread, per Step 4, and no
thread reply can ride inside a review submission. Step 7 carries the order.

One exception: a batch of self-contained non-blocking cleanup the author can clear in parallel, such
as a set of type errors. Post that as a standalone comment. Nothing else qualifies.

**3. Show the wording before it goes out. Every time.**

Draft the review body and every comment. Show them inline. Ask before any call that writes to the
PR, `post.sh --confirm`, `gh pr comment` and `gh api` with a POST or a PATCH alike. This applies to
follow-up thread replies too. "Post it" authorizes the action, not the wording.

**4. Never let another tool post or edit for you.**

Other review tools can generate findings. Do not pass `--comment` or `--fix` to any of them. Both
skip rule 3, and `--fix` also breaks rule 1. Do not run `/simplify` during a review, because it
applies fixes.

## When to stop and raise it with the user

Raise these in the session. Never write them into the draft.

1. **A leaked secret, a credential, or a data-loss risk.** Stop before writing it anywhere. A PR
   comment is frequently public, and it cannot be cleanly unsent.
2. **The premise or the scope of the change looks wrong.** That is a conversation, not a comment. An
   inline `issue:` buries a design disagreement in a line annotation.
3. **Two axes contradict each other and reading the hunk does not settle it.** Ask rather than
   picking one.
4. **A prior round needs a call you do not own.** The author pushed back and did not change the
   code, or another reviewer contradicts one of your prior comments. See the routing table in
   `references/routing.md`.
5. **The diff introduces a pattern the repo has no prior art for, and no rule covers it.** Whether
   the team agreed to it is not answerable from the repo. See `references/routing.md`.
6. **This is the third round on the same PR.** The rounds have stopped being about mechanics. See
   `references/verdict.md`.

**Report the conflicts you did settle.** Give each cross-axis contradiction one line in the session,
with the call you made. Never resolve one silently. Keep it brief and let the user ask for the detail.

**Report the prior threads you dropped.** Give each silently-ignored thread the label rules dropped
one line in the session. The author has no use for it, and the user may disagree with the drop.

A finding that flips the verdict is not an escalation. Recommend the verdict and let the user override
it.

## Write every artifact in Simplified Technical English

`references/style.md` carries the rules for everything this skill produces. Read it before you write
the review body or a comment.

Which artifact takes which mode.

- **Strict.** A comment subject line, and every prompt you send a subagent. A wrong reading there
  costs the author a round.
- **Flavored.** The discussion under a subject, and the review body. Contractions and some range read
  better there.

## Keep the review in one directory under `/tmp`

One directory per review, `/tmp/review-<n>/`, where `<n>` is the pull request number, or the branch
name where no pull request exists. Replace every character outside `a-z`, `0-9` and `-` with a
hyphen, so a branch name stays one directory. Name it in the session once, when Step 0 creates it.

| File | Written by | Holds |
|---|---|---|
| `prior.json` | Step 0 | The prior review bodies and every inline thread |
| `axes.md` | Step 3 | Each axis report, verbatim and unmerged |
| `draft.md` | Step 5 | The review body, every comment with its anchor, and the verdict |
| `payload.json` | Step 7 | The payload `post.sh` reads back and posts |

`draft.md` is the one file that has to survive a compaction, because it alone reconstructs the
review. Keep the other three out of it.

## Step 0. Resolve the target

Resolve the target before reading any code. Use the first of these that applies.

1. An explicit argument. A PR number, `owner/repo#N`, a URL, a branch name, a commit or tag, or `.`
   for the current branch.
2. No argument. Run `gh pr view --json number,title,body,headRefName,author`.
3. No PR for the branch. Diff against the merge-base, and say that is what you are reviewing.
4. Ambiguous, or not a git repo. Ask. Do not guess a target.

**Check out the target before anything else reads it.** The axes verify by executing, not by reading
alone. They read the working tree, so the tree has to hold the code under review.

**A dirty tree stops the review.** Name what is uncommitted and ask. Never stash, and never check
out over uncommitted work. This holds for a self-review too. Uncommitted work is not reviewable,
because no other reviewer can fetch it and no CI run covers it.

**Where the target is not already HEAD, fetch it and check it out.** Name the ref you moved to in
the session, so the user sees the tree move.

Confirm the base ref resolves and the diff is not empty. Capture one diff command and reuse it:
`git diff <base>...HEAD`. Use three dots so the comparison runs against the merge-base. Capture the
commit list with `git log <base>..HEAD --oneline`.

Fail here on a bad ref or an empty diff. Do not fail inside a subagent.

**Then check whether the diff depends on a sibling repo.** A PR in a multi-repo series frequently
reads code that lives in another repo's unmerged branch. Where it does, find that PR, fetch its head,
and record the exact SHA. Carry the SHA into every subagent prompt, per Step 2.

The sibling's default branch is the wrong source, because the change the diff depends on has not
landed there yet. A finding read off the default branch comes back confirmed and wrong.

**Then check for prior rounds.** Review history changes the axis set, so detect it here rather than
part-way through.

Dispatch a Haiku subagent for the fetch. The thread JSON grows with the review history, and none of
it belongs in this context.

> Run both commands for pull request <n> in <owner>/<repo>.
>
> 1. `gh pr view <n> --json reviews` for the prior review bodies.
> 2. `gh api repos/{owner}/{repo}/pulls/<n>/comments` for every inline thread.
>
> Write both results to `prior.json` at <path>. Then report three things and nothing else: whether
> any prior review exists, how many inline threads there are, and the path you wrote.

Run `gh api user --jq .login` yourself, because one line of output costs more to delegate than to
fetch. The Prior Round axis needs it to tell your prior comments from another reviewer's.

Say in the session whether this is a first pass or a re-review.

## Step 1. Read the PR: the claims, then the metadata

**The claims.** Read the PR description, the commit messages, and the review-request text. Turn each
claim into a row to verify. A claim is anything the author asserts about behavior, scope, or the
reason for a change.

Verify by running something wherever you can. Reading the code is weaker evidence than executing it.
Grep for the callers. Run the spec. Check whether the pattern the author says is new already exists
on main.

Say in the review body which claims you verified and how. That is the evidence for the verdict, and
it covers the claims only. A table helps when there are several claims, and it is not required.

**The suites are not a claim.** "Specs pass", "lint is clean", and "typecheck passes" get no
verification row. The Checks axis runs them anyway, per Step 2, and only a failure reaches the
review.

**The metadata.** Three questions about the pull request itself, not about the diff.

1. Does the PR description still describe the diff? A description written against an earlier revision
   is common, and the author cannot see the drift from inside the branch.
2. Is a label the repo expects missing? Run `gh label list` for what exists and
   `gh pr view --json labels` for what is set. A blast-radius or a notable-change label is the common
   miss, because each is a judgment call nobody makes at open time.
3. Has a label gone stale? Nobody revisits a label after the PR opens. A `chore` or a `refactor` that
   grew into a behavior change now needs the label a feature takes.

None of the three anchors to a line of code, so all three belong in the review body. See Step 4.

## Step 2. Dispatch the axes

One axis per subagent, so no axis sees another's reasoning.

**Dispatch through the `white-room:review` workflow.** Pass it `{skillDir, diff, commits, axes,
sibling}`, where `skillDir` is this skill's absolute base directory and each axis entry is
`{axis, payload}`. It sets the model per axis, sweeps history behind Standards and Precedent,
returns every axis report, and posts nothing.

**Where the Workflow tool is missing, dispatch the axes by hand.** One subagent per axis, as the
`review-axis` agent — except Checks, which runs the repo's suites and so needs a subagent that can
write. Send that one to `general-purpose`.

**Set the model on every by-hand dispatch,** because an axis inherits the session model otherwise.
The strongest model available for the axes that rule on unfamiliar code, a cheaper one for the axes
an explicit brief drives, and the cheapest for Checks, which judges nothing.

**Sweep history behind Standards and Precedent by hand too.** Neither brief runs the sweep, so
skipping it leaves both axes ruling on what this repo does from the working tree alone. Dispatch
one more subagent per axis once that axis reports, and point it at `references/history.md`. The
workflow does this for you, and the by-hand path does not.

**Every by-hand prompt carries these parts.**

1. The diff command and the commit list from Step 0.
2. The absolute path to the axis brief, resolved from this skill's base directory. A subagent never
   sees this file, so a relative path reaches nothing.
3. **Where Step 0 found a sibling-repo dependency:** the repo, the PR number, and the SHA to read.
   State that the default branch is not the source.

### Pick the axis set

Read the changed paths first: `git diff --name-only <base>...HEAD`. The paths pick the set.

- **Prose-only diff**, where every changed path is `.md` or `.mdx`. Dispatch **Claims**, **Prose**,
  and **Checks**. A markdown linter and a spell check are checks. Nothing else, because the diff
  holds no code to be wrong and no comment to audit.
- **Any other diff.** Dispatch **Correctness**, **Claims**, **Standards**, **Precedent**,
  **Comments**, and **Checks**. Add **Prose** where the diff also touches `.md` or `.mdx`.

Add **Prior Round** to either set where Step 0 found prior review rounds.

Dispatch every axis the set names, including one whose subject looks thin. An axis with nothing to
say costs one `no findings` line.

### The axis briefs

Each brief is a file. Pass its absolute path and require the agent to follow it verbatim, rather
than pasting the text into the prompt. A brief that needs a reference file names it itself, relative
to its own directory, so the dispatch carries one path.

- **Correctness.** `briefs/correctness.md`
- **Claims.** `briefs/claims.md`. Paste the claims you collected in Step 1.
- **Standards.** `briefs/standards.md`
- **Precedent.** `briefs/precedent.md`
- **Comments.** `briefs/comments.md`
- **Prose.** `briefs/prose.md`
- **Checks.** `briefs/checks.md`. Pass the pull request number.
- **Prior Round.** `briefs/prior-round.md`. Dispatch only where Step 0 found prior rounds. Pass the
  `prior.json` path from Step 0, and pass your own login.

Report the axes separately. Do not merge them, because one axis passing can hide another failing.
Code can follow every standard and still implement the wrong thing.

## Step 3. Triage

Reconcile what Step 2 returned. Do not re-run it.

Write each axis report to `axes.md` before you triage, verbatim and unmerged.

**Trust each axis on its own finding.** The subagent that ran the axis already did that
verification. Repeating it in the main context refills the context that one axis per subagent kept
clear.

**One carve-out: an empirical claim you can check in one command.** Run the command. An axis
reporting that a symbol has no other caller, that a path does not exist, or that a suite is named
something else costs one `grep` to settle, and a wrong one costs the author a round.

Check the fact, not the finding. This never licenses re-reading the hunk, and it never licenses
re-deriving the reasoning. Where the check needs more than one command, trust the axis.

**Own the recommendation.** That part is yours, not the subagent's. Check every proposed fix against
`references/conventional.md` before it becomes a comment. Watch for the retired symptom: a fix that
resolves the visible failure one level above where the cause lives.

**Two axes disagreeing is the one trigger for reading the code yourself.** When axes contradict each
other on the same lines, or one axis's fix would create another axis's finding, open that hunk and
make the call. Nothing else earns a re-read in the main context. Report the call you made, and raise
it when the hunk does not settle it.

Drop any finding with no concrete failure scenario. A finding that needs an artificial test setup to
happen is theoretical.

**Precedent, Prior Round and Checks are exempt from that rule, for two different reasons.** An
observation and a disposition are not defects, so no failure scenario attaches to either. A check
failure is the opposite case. It already happened, so the run is its failure scenario and nothing
about it is theoretical. Route Checks below, and route Precedent and Prior Round through
`references/routing.md`.

For each surviving finding, ask these four questions.

| Question | Real | Theoretical |
|---|---|---|
| Can this happen through actual usage? | yes | only via artificial test setup |
| Is this at a system boundary (user input, external API)? | yes | no, internal code with structural guarantees |
| Does a structural constraint prevent it? (OS modal, event loop, type system) | no | yes |
| Is this a public API / library surface? | yes | no, closed app, internal use |

Real findings become comments. Drop a theoretical finding, or turn it into an adjacent note that says
why it is theoretical. Defensive programming suits a system boundary. It does not suit internal code with a
structural guarantee.

**The circular finding trap.** If the fix for one finding would trigger the opposite finding, stop.
The loop itself signals that both findings are probably theoretical. Triage them rather than
oscillating.

`references/routing.md` carries the destination tables for a Precedent observation and for a Prior
Round disposition. Read it per finding.

**Route the Checks rows.** Every failure is blocking, and it goes near the top of the review body.
Where the failing target points at a line, add an inline comment for the detail as well. Where the
axis could not run a check, say so in the session, and name the CI result you fell back on.

**Reconcile this round against the other reviewers.** Prior Round reported their positions, so check
every finding you are keeping against them. A finding that contradicts a position goes to the
session, not the draft. A finding another reviewer already made gets cut, or shrinks to one line
agreeing with theirs.

**Calibrate the confidence you write,** because confident phrasing on a shaky finding costs the
author a full context reload to disprove. State the observation and the reasoning. Do not dress
uncertainty as a ruling. A finding you are 60% on must read as 60%. Separate "this is wrong" from
"this looks off, check me".

**Classify each surviving finding by whether its fix is predictable.**

- **Mechanical.** The diagnosis forces the fix. Name that fix in the comment.
- **Needs a call.** The fix needs a design decision or a trade-off. Name the decision, and name
  what it turns on.

Severity never picks the bucket. A data-loss bug with one forced fix is mechanical. A nitpick with
two defensible shapes needs a call. Reaching for needs-a-call because a finding feels serious is
the most likely way to get this wrong.

The test is whether the resulting diff is predictable. It is not how bad the defect is, and it is
not who owns the decision. A finding whose fix you can name inline is mechanical.

**Why:** the verdict rests on this. Step 6 asks whether you have to see the next iteration, and a
predictable diff is one this review already covers. The split also serves the author, because it
tells them where they owe a decision rather than a patch.

## Step 4. Group the findings, then place them

**Collapse repeats into one comment.** Anchor it at the worst site. Name the other sites in the
discussion. Five history sites become one comment, not five.

**Every finding is an inline comment.** Anchor it to the line that shows the problem, because the
code is the context.

**An anchor has to sit inside a diff hunk.** GitHub rejects every other line, so check the hunk
before you choose.

**Anchor to the line that names the subject.** Where the declaration sits outside every hunk, pick an
in-hunk line that references it and name the declaration in prose. A comment about a type that
anchors to some unrelated field reads as a comment about that field.

Prefer one line to a range. GitHub renders a range comment at its last line, and the line that names
the subject can sit outside the preview shown there.

Naming a line in prose changes how the comment is written, so settle the anchor here rather than
while assembling the payload.

**A claim the code contradicts has two possible defects. Place it by which one.** Where the code is
wrong, that is an ordinary inline comment. Where the code is right and the claim is wrong, the defect
is a sentence in the description, so it goes in the review body with the metadata findings.

Lead that one with the claim, because leading with the code analysis reads as "your change is
broken" and sends the author to defend an implementation that was never in question. Quote it, say
what verification found, and name the fix as correcting the description. Code detail goes underneath
as evidence.

**A re-raise or a retraction is a reply on the original thread.** The thread carries the history a
fresh comment would orphan. Where the thread takes no reply, because it is resolved or outdated or
the prior comment was a prior review body, post one PR-level comment instead and link the original.

**The review body has three fixed parts and two conditional ones.**

1. The verdict.
2. **Where a check from Step 2 failed:** one line per failing check, labelled `issue:` and blocking.
   Name the check and what it reports. A failing suite is a fact about the whole PR, so it never
   sits only in an inline comment. The location detail is what the inline comment carries.
3. The evidence for the verdict, from Step 1.
4. The count of inline comments, `praise:` and `thought:` excluded. Where that count is zero, say
   you read the whole diff and found nothing to change, and name every axis that came back with no
   findings.
5. **Where Step 1's metadata pass found something:** each metadata finding, one line each, labelled
   from the list in `references/conventional.md`.

Do not rank the axis findings in the review body, and do not name a worst one. The inline comments
carry that.

**A concern the user raised never gets answered in the review body.** Answer it to the user, in the
session. Where it turned out to be a real defect, it becomes an ordinary inline comment, judged on
its merits like any other. Where it turned out to be nothing, the author has no use for the answer.

**The review body never restates a finding.** Apply this test to every sentence in it: could this be
a comment on a file? If yes, move it. A sentence that reads as a finding is a finding. Praise is a
finding too, so anchor it on the file it praises. A metadata finding has no file to anchor to, which
is why the review body is where it goes.

**No aggregate hand-waving.** A sentence like "two of them are passes rather than defects" adds
confusion. Name the comments it refers to, or cut the sentence.

## Step 5. Write each comment

`references/conventional.md` carries the format, the labels, the decorations, the mentions, and the
framing. Read it before you write a comment.

### Write the draft to `draft.md`

Write the draft once every comment is written. The review body first, then one section per inline
comment, in this shape.

```markdown
## app/javascript/src/viewers/types/base.ts:45
side: LEFT
start_line: 43

suggestion (non-blocking): ...
```

The heading carries the path and the line. Add `side: LEFT` only for a comment on a deleted line,
because the API defaults to `RIGHT`. Add `start_line` only for a multi-line anchor.

The write is not a post. Step 7 still shows the draft and waits for the go-ahead.

## Step 6. Choose the verdict

Pick one rung of the verdict ladder, once every dispatched axis has reported.

`references/verdict.md` carries the ladder. Read it before you choose.

Append the verdict to `draft.md` once you pick it.

## Step 7. Show, then post

Show the review body and every comment from `draft.md`. Wait for the go-ahead. That go-ahead
covers the wording. The payload gets its own check below.

**Show the evidence for each comment, in the session.** A comment is written for the author, so it
carries the finding rather than the reasoning under it. The user signs the review, so the user needs
enough to judge each finding without opening the pull request. Give each comment four things.

1. The mechanism. Why the code is wrong, not just that it is.
2. The trigger. The input, the state, or the call path that reaches it.
3. The counter-evidence the axis weighed, including why a passing spec does not cover it.
4. The confidence, and what would settle an uncertain finding.

Add the classification from Step 3, mechanical or needs-a-call.

Take all four from `axes.md`, because the axis already reported them under the finding contract in
`agents/review-axis.md`. Never reconstruct a mechanism from your own reading of the diff, and never
present a reconstructed one as the axis's finding. Where an axis report is missing a field, say
that rather than filling it in.

This evidence stays in the session. It never enters `draft.md`, because the author has no use for
it.

Length follows the number of findings. Eight findings make a long message, and that is correct. Do
not compress the evidence into a table.

**Why:** the user is the reviewer of record and signs the approval. A finding they cannot judge
independently is one they take on faith, which is worse than not raising it.

**Head each comment with a link, not a bare path.**

```
[app/javascript/src/viewers/types/base.ts:45](https://github.com/<owner>/<repo>/blob/<sha>/app/javascript/src/viewers/types/base.ts#L45)
```

Pin `<sha>` to the head commit so the link cannot drift while the user reads.

**Re-fetch immediately before you post.** Nothing pauses the PR while you review it, and
nothing pauses it while you wait for the go-ahead. A long pass makes the Step 0 snapshot stale.
Re-run the Step 0 prior-round commands, and add
`gh pr view <n> --json state,reviewDecision,headRefOid`.

Reconcile the result against the drafted findings.

1. Another reviewer already made a point you drafted. Drop your comment, and reply on their thread
   instead.
2. `headRefOid` moved. Always say so in the session, and name what moved. Run
   `git log <old-oid>..<new-oid> --oneline`, then `git diff <old-oid>..<new-oid>` over the files your
   findings cite. Judge by the cited lines, not by the file list. A merge from the base branch churns
   whole files while leaving every finding intact.
   - Your cited lines are untouched. Say so, and post.
   - The author already fixed a finding you drafted. Drop that one, and post the rest.
   - Neither case above applies. Stop, and let the user choose between a full Step 0 round, a
     re-check of the touched findings only, and posting as drafted.
3. The PR merged or closed. Stop, and raise it with the user.

Show the revised set and get a fresh go-ahead when anything changed. Update `draft.md` to match, so
it never disagrees with the set you showed. Post once.

### Write the payload, then read it back

`post.sh` carries the order of the writes, the one-call-per-endpoint rule, and the read-back. It
reads back by default and writes only with `--confirm`.

Write `payload.json` from `draft.md`. Every anchor copies across from a comment heading.

```json
{
  "repo": "<owner>/<name>",
  "pr": <n>,
  "replies": [ { "comment_id": <id>, "body": "..." } ],
  "review": {
    "event": "APPROVE",
    "body": "...",
    "comments": [ { "path": "...", "line": <n>, "start_line": <n>, "side": "RIGHT", "body": "..." } ]
  }
}
```

`replies` takes one entry per prior thread you answer, and the key can be absent. `start_line` and
`side` are optional on a comment. `event` takes `APPROVE`, `REQUEST_CHANGES` or `COMMENT`.

The script refuses a payload before it writes. Read `scripts/post.sh` for the fields it checks.

Read the payload back and show that output.

```sh
${CLAUDE_PLUGIN_ROOT}/skills/review-changes/scripts/post.sh /tmp/review-<n>/payload.json
```

Those bytes are what the author reads, anchors included. The final go-ahead attaches to them, not to
the draft earlier in the session.

Your message text renders as markdown and shell output does not, so re-printing the draft in a
message shows you the same rendering that hid the problem the first time. Backticks that made a
subject line legible in chat print literally in shell output, and GitHub renders them the way chat
did, as one code span that swallows the label.

This checks fidelity, not correctness. It confirms that what ships is what the user approved, and it
catches a dropped comment or a wrong anchor. It says nothing about whether a finding is right.

### Post with `--confirm`

One command, once the user approves those bytes.

```sh
${CLAUDE_PLUGIN_ROOT}/skills/review-changes/scripts/post.sh /tmp/review-<n>/payload.json --confirm
```

The review body counts the inline comments, re-raises included, so a body that lands ahead of its
replies points the author at something they cannot find.

**Never hand-roll the calls.** `gh pr review` takes a body and nothing else, so it cannot anchor an
inline comment. A `gh api` you build yourself skips the read-back.

**When the write is denied, stop.** Do not reshape the command and retry, because retrying a denied
write is the thing the denial asks you not to do. Show the user the exact command and let them run
it.
