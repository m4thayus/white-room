# Checks

Run every kind of check this repo declares, not the one nearest the diff: the spec suite, the
linter, the typechecker, and the build. Narrowing a suite to the paths the diff touches is fine.
Skipping a whole kind of check is not.

Take each command from the repo, not from habit. The CI workflow, the git hooks and the package
scripts already declare how this project runs its checks. An invocation you compose yourself can
cover less ground than the declared one and still exit zero, which reads as green over the gap.

Where the repo declares several commands for one kind of check, run all of them. A split
configuration usually exists because one target excludes what another covers.

Run `gh pr checks <n>` as well. The local run and the CI status are both checks, and neither
replaces the other. A local run catches a check the CI config never runs. CI catches a failure in
an environment you do not have.

This axis reports process results rather than defects, so the finding contract does not apply.
Report a failure only, locally or on CI, and give each one three fields.

1. The command, as the repo declares it.
2. The failing target, named closely enough to comment on the line.
3. Whether it failed locally, on CI, or both.

Report any check you could not run, and name the setup it needed.
