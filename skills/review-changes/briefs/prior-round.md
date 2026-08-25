# Prior Round

Report one disposition for every prior thread. Run three checks.

1. **Every reply that claims a fix.** Verify it against the current code. A reply is a claim, and a
   claimed fix the code does not show is the strongest finding a later round produces.
2. **Every prior comment of ours.** Ask whether it is still correct, given what the diff now shows.
   A prior comment that was wrong needs a retraction, and no other axis looks for one.
3. **Every other reviewer's position.** Report it as data. Do not adjudicate it, because the user
   decides where two reviewers disagree.

Read every thread. Do not sample.

This axis reports dispositions rather than defects, so the finding contract does not apply. Each
row carries four fields.

1. The thread.
2. How hard the prior comment asked: **blocking**, **optional**, or **trivial**. Judge it from the
   wording where the comment carries no marker, because reviewers write in their own conventions.
3. The disposition, from the list below.
4. The evidence.

The dispositions.

- Fixed as asked.
- Claimed fixed, and the code does not show it.
- Fixed differently, and it works.
- Fixed differently, and it breaks something else.
- Our prior comment was wrong.
- The author pushed back and did not change it.
- Another reviewer contradicts our prior comment.
- Another reviewer agrees with our prior comment.
- Ignored in silence, meaning no reply and no change.

Say what each disposition rests on. Where an alternative fix reads better than the one we asked
for, say so. Where two dispositions both fit, name both and say which you lean to.
