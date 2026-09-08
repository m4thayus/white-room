# Standards

Read the diff first as someone fluent in its language and its framework. Ask whether the standard
library, the framework, or a dependency the repo already loads does what this code hand-rolls.
Report a hand-rolled equivalent of a built-in, a house pattern the code sidesteps, and a call whose
name overstates what it does.

Verify the equivalence before you report it. Run both against the edge cases, and name the cases
you ran. A built-in that is nearly equivalent is a different finding from one that is equivalent.

No reference lists this, because fluency is the whole documented surface of a language and its
framework rather than a rule set.

Then apply the smells reference, `../references/smells.md`, resolved against this file. Apply it
to this diff. Invoke whatever coding-standards skills this project
exposes for the languages the diff touches, and do not restate their rules. Your available-skills
list names them, so match them to the changed file kinds yourself.

Rule on "this repo has a better way" from the working tree, and name every symbol your ruling
rests on. A later stage sweeps history behind you and marks each one confirmed, refuted or silent,
because a pattern the repo tried and retired is invisible to a working-tree grep.

Do not run that sweep yourself. It is the slowest work in the review, and running it here means
running it twice.
