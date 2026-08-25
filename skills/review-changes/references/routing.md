# Routing a finding

This file owns the destination tables for a Precedent observation and for a Prior Round disposition.

**Use what Precedent reported.** It decides who owns a fix, and what a finding covers. It never
decides whether a finding is real, or how severe it is.

| What Precedent found | Destination |
|---|---|
| No prior art, and no rule against it | session, because "was this agreed?" is not answerable from the repo |
| No prior art, and a rule against it | inline comment, citing the rule |
| Prior art, and an axis flagged it | inline comment, naming where else the pattern appears |

A bug main also has is the same bug. Prior art changes what the comment says, not what it asks for.
Say that the pattern predates this diff, and that the fix reaches past it.

Ask what a finding actually is before you reach for prior art. A finding rewritten around the points
that survive it is frequently the wrong finding.

**Route the Prior Round rows.** The axis reports what it saw, and it does not choose a destination.

| Disposition | Destination |
|---|---|
| Fixed as asked | nowhere |
| Claimed fixed, and the code does not show it | re-raise |
| Fixed differently, and it works | nowhere, unless the alternative is worth naming |
| Fixed differently, and it breaks something else | re-raise |
| Our prior comment was wrong | retract |
| The author pushed back and did not change it | session |
| Another reviewer contradicts our prior comment | session |
| Another reviewer agrees with our prior comment | nowhere |
| Ignored in silence | how hard we asked decides, below |

**Ignored in silence.** How hard the prior comment asked decides. A non-blocking ask left the change
optional, so re-raising it removes the option.

| How hard we asked | The label, where the comment was ours | Destination |
|---|---|---|
| Blocking | `issue:`, `suggestion: (blocking)` | re-raise |
| Optional | `suggestion:` | one line, non-blocking |
| Trivial | `suggestion: (if-minor)`, `nitpick:`, `thought:` | drop, and note it in the session |
