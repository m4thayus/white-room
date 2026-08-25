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

Sweep history before you rule on "this repo has a better way". Run `git log -S<symbol> --all` and
`git log --grep=<term>`, then `git show` each commit they return. A pattern the repo tried and
retired is invisible to a working-tree grep, and it is the answer to whether the house way is the
house way.
