# Precedent

Report what the repo already does, what it once did, and what it has never done. Run two sweeps.

1. **No prior art.** What does this diff introduce that the repo has nothing like? A file kind, a
   directory, a layer, a naming shape, an export pattern, a dependency.
2. **Prior art.** What does this diff do that the repo already does elsewhere? Name the other
   sites.

**Search the working tree, and name what you searched for.** A later stage sweeps history behind
you, because a pattern the repo used four times and retired four times reads as "never done" to a
working-tree grep. It reports a retired pattern as prior art.

Do not run that sweep yourself. It is the slowest work in the review, and running it here means
running it twice.

A search that returns only the new file is the finding. Say which searches you ran to earn it, so
the sweep behind you knows what to check.

Report prior art as fact, and do not rule on it. Prior art makes a thing precedented. It does not
make the thing right, and its absence does not make a thing wrong.

This axis reports observations rather than defects, so the finding contract does not apply. Each
row carries three fields.

1. The thing, as the diff introduces it or repeats it.
2. The search you ran, so the reader can judge it.
3. What the search returned.
