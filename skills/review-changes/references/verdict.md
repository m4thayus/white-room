# Choosing the verdict

This file owns the verdict call: the deciding question, the four-rung ladder, the round bar, and what another reviewer's finding means for your rung.

The deciding question is "do I have to see the next iteration myself?" It is not "are there issues
to fix?" and it is not "how bad is the worst finding?"

A blocking inline comment already holds the author accountable, because the team honours it. It marks
a finding fix-before-merge without asking to see the fix. Severity picks the comment label. It does
not pick the verdict. Request Changes on top of a blocking comment buys no extra guarantee, and it
costs the author a round-trip.

## The ladder

Each rung asks more of the author than the one below it. Take the lowest rung that holds.

**1. Approve, clean.** Nothing in the review asks the author for anything, the review body included.
Only `praise:` and `thought:` belong here, because neither carries a request. A `nitpick:` does carry
one, even though it never blocks.

**2. Approve, with notes.** The review asks for things, and none of them needs you to see the result.
Blocking comments live on this rung. A review that found real problems with known fixes lands here,
and that is the normal shape.

**3. Request Changes.** The next iteration is the thing you need to see. One of these has to hold.

- A check from Step 2 of `SKILL.md` fails. Whether the suite goes green is a fact only the next run
  shows.
- The fix has no agreed shape. You disputed the approach, so what lands is not predictable.
- A reply cannot confirm the fix. Only the diff shows it.

Your own prior blocking finding, still unfixed and unanswered, holds this rung on the same logic. You
asked once already, so the next iteration is still the thing you need to see.

Read the classification Step 3 put on each finding. A mechanical finding never carries this rung,
because its fix lands in a diff you can already predict, and this review covers that diff. A
needs-a-call finding carries it only where the decision could land in substantially different code.
Counting needs-a-call findings is not the test. A long list of them is still an approve, and one
alone can hold this rung.

Then ask what round this is. The bar rises steeply, not by one step each time.

| Round | What this rung needs |
|-------|----------------------|
| 1 | A case holds. Ordinary, and cheap. |
| 2 | A case holds, and one sentence names what the next iteration settles. |
| 3 | Nothing qualifies. Stop, and raise it with the user. |

A PR that reaches a third round is no longer arguing about mechanics. It is arguing about design, the
two sides are flip-flopping, and a comment thread will not settle it. Name a venue that can: a call,
a design discussion, a conversation with the author. Rung 4 can carry that ask, or post no review and
take it up directly.

**4. Comment.** A fix is not what you want. A change can be soundly built and still be the wrong
change. Approving endorses it, and Request Changes asks for a next iteration you cannot describe,
because the open question is whether to do this at all.

Raise it with the user before you draft anything. A wrong premise or a wrong scope is a conversation,
not a review artifact.

## An approval is unconditional

Never approve and also route a finding back for your own sign-off before merge. "Ping me on the
third one" is not a fifth rung. It withholds the trust the approval claims to extend, and it costs
the round-trip rung 2 exists to avoid.

Approve means "I trust you to fix what this review asks, and I do not need to see it again". A
finding you do have to see is rung 3, so take rung 3 and say what the next iteration settles.

## Another reviewer's open finding is data

The reviewer who raised a finding owns it. First come, first served. They decide whether it gates,
and their decision stands whichever way it went. Report it, per the Prior Round axis.

It tells you nothing about your own verdict, in either direction. A finding they gated on is not a
reason for you to gate. One they approved over is not a reason for you to let it go. You can agree
with their point, say so, and still need no round-trip of your own.

Gating on their finding also takes it out of their hands. A Request Changes blocks the merge by
itself, so it overrides the Approve they gave with the finding open.

## Name no verdict until every axis reports

Wait for all dispatched axes, even for a provisional call in the session. A late axis reverses an
early verdict, and the reversal reads as indecision rather than as new evidence.

Default to the lowest rung that holds. Rung 3 levies a re-review tax. Say what the tax buys, or do
not levy it.
