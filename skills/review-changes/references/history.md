# The history sweep

Two axes rule on what this repo already does, and the working tree cannot answer that. A pattern
the repo used four times and retired four times reads as "never done" to a working-tree grep. This
file owns the commands that see it.

**Only the sweep stage runs these.** The axis reports from the working tree and names what its
report rests on. The sweep runs behind it. Running the sweep inside the axis as well doubles the
slowest work in the review.

`git log -S` diffs every commit it walks, so an unbounded scan is the slowest command in a review.
Every number below was measured on a 8562-commit repository.

## Bound by file kind, always

Pass a pathspec of the file kinds the diff touches. This is the bound that carries the work.

```sh
git log -S'<symbol>' HEAD --format='%h %s' -- '*.rb' '*.rake'
```

| Form | Time | Commits found |
|---|---|---|
| `-S'<symbol>' --all` | 198.4s | 12 |
| `-S'<symbol>' HEAD` | 162.9s | 12 |
| `-S'<symbol>' HEAD -- '*.rb'` | **0.39s** | 12 |

Identical results, 510 times faster. A file-kind pathspec bounds the walk without bounding where
it looks, so it still sees a pattern retired from a directory this diff never touches.

## Never bound by directory

A directory pathspec looks like the same optimization and is not. It answers only for the
directories you named.

The same symbol, searched under three directories it does not live in, returns **0 commits in
0.14s**. The true answer is 12. An axis claiming "this repo has never done X" would come back
confirmed and wrong, which is the failure this whole stage exists to prevent.

Use a directory pathspec only to confirm or refute a finding about the changed code itself, where
the diff's own directories are the subject. Never use one to settle "no prior art".

## Walk `HEAD`, not `--all`

`--all` adds every remote branch and every tag: 10103 commits against 8562 here. It cost 22% more
and returned nothing extra. A pattern that only ever lived on an abandoned branch is not what this
repo does.

## Batch the symbols into one scan

One scan carries twelve symbols as cheaply as one, so collect every symbol, name and pattern the
report rests on, then run one command.

```sh
git log --pickaxe-regex -S'(symbolA|symbolB|symbolC)' -n 20 HEAD --format='%h %s' -- '*.rb'
git log --grep='(termA|termB)' --extended-regexp -n 20 HEAD --format='%h %s' -- '*.rb'
```

N separate scans cost N times one scan. At the unbounded 198s that is 16 minutes for five symbols.

## `-n 20` caps the output, not the walk

It ends the walk early only where the matches cluster early, and they rarely do. Unscoped, `-n 20`
took 173s against a 163s baseline. Keep it, because it caps what comes back. Never treat it as a
bound.

## Read a commit in two steps

Never run a bare `git show`. It prints every file in the commit.

```sh
git show <sha> --stat
git show <sha> -- <the one path the finding rests on>
```

Across the 12 commits above, bare `git show` printed **1.64 MB**. `--stat` printed **110 KB**.
Read the stat first, and open the diff only for the path that matters.

## Say what you ran

Report the commands. A search that returned nothing is a finding only where its bounds were right,
and the pathspec is that bound. A reader who cannot see it cannot judge the result.
