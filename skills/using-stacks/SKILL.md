---
name: using-stacks
description: >-
  Use when the user says "stack", "stacked PR", "stack it on top of this one",
  "gh stack" or "GitHub stacks", or when work depends on a pull request that has
  not merged yet. "Stack" means GitHub's stacks feature and its `gh stack` CLI
  extension, not a branch cut from another branch by hand. Also use when a PR at
  the bottom of a stack squash-merges and the branches above it need to follow.
---

# Using Stacks

A stack is a server-side GitHub object: an ordered chain of pull requests, each
based on the one below. The `github/gh-stack` extension is its client. Core `gh`
has no stack commands.

**"Stack" always means this tool.** Never answer it with `git switch -c` off the
current branch. A hand-cut branch has no stack object, so GitHub shows no stack
and `sync` cannot move it.

## Stack or branch off the default branch

Stack only when the new work needs the lower PR's changes to build or pass.
Independent work, such as a deletion that a review turned up, branches off the
default branch and opens its own PR. Ask when the dependency is unclear.

## Let the commands do the work

**Use a `gh stack` command for every push, PR and rebase.** Hand-run git and
`gh pr` steps bypass the stack object, and then the stack has to be rewired by
hand.

- Open PRs with `gh stack submit --auto --open`. Don't hand-run `gh pr create`
  to choose the title and body, and then `gh stack link` to rewire the stack.
- Push with `gh stack sync` or `gh stack push`. Never run a plain `git push` on
  a stacked branch.
- Move branches with `gh stack sync` or `gh stack rebase`. Never run
  `git rebase` by hand, except as the fallback in Landing.

**The auto title and body are never a blocker.** `submit --auto` picks the title
from the branch name, and the body it writes is a footer only. Edit both
afterward with `gh pr edit <n> --title "<t>" --body-file <file>`. GitHub stores
the stack link separately, so the edit keeps the PR in the stack. Run `submit`
first and write the title and body after.

## Commands

Run `gh stack <command> --help` when a flag here does not match. These notes
match v0.2.1.

| Command                    | Does                                                                         |
| -------------------------- | ---------------------------------------------------------------------------- |
| `init <bottom> [<next>…]`  | Adopts existing branches and creates missing ones, bottom first. Local only. |
| `add <branch> -A -m "<m>"` | Creates a branch on top, stages everything and commits.                      |
| `submit --auto --open`     | Pushes every branch and opens or updates one PR per branch.                  |
| `view`                     | Shows the stack and its PRs.                                                 |
| `sync`                     | Fetches, rebases each branch onto its parent, pushes. `--prune` cleans up.   |
| `rebase`                   | Rebases locally without pushing. `--abort` restores every branch.            |
| `push`                     | Pushes the stack's active branches.                                          |
| `unstack --local`          | Deletes the local stack only. Without `--local` it deletes it on GitHub.     |

To list every stack in a repository, run `gh api repos/{owner}/{repo}/stacks`.

## Landing

The stack manages development and review, not landing. Each PR squash-merges
into the default branch on its own, bottom first.

1. Squash-merge the bottom PR. A squash uses the PR title as the commit subject,
   so make sure the auto title was edited.
2. Run `gh stack sync`. It rebases the next branch onto the squash commit and
   retargets its PR.
3. Check that `git log <default-branch>..<next-branch>` lists only that branch's
   own commits.
4. Repeat for the next PR.

A squash merge creates a new commit, so git can't match it to the lower branch's
original commits. `sync` handles that. If step 3 shows the lower branch's
original commits, the manual fallback is
`git rebase --onto <default-branch> <old-parent-branch>`.

## Force pushes

`sync` and `push` force-push with `--force-with-lease`. That is the one force
push a stack allows, because each branch has to sit on its parent's tip with no
merge commits. Get it only through those commands. Never type a
`git push --force` or `--force-with-lease` yourself.

## Gotchas

- `submit` without `--auto` opens an interactive editor an agent can't drive.
- `--auto` alone creates drafts. `--open` marks them ready for review.
- `gh stack merge` lands the whole stack at once. It needs a per-repository
  capability, and it errors with "async stack merge is not available for this
  repository" where that capability is off.
- `view` shows only the current stack, and no `gh stack` command lists them all.
  Commands carries the API call that does.
