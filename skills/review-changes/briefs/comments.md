# Comments

Sweep every comment this diff adds or changes. Report six things.

1. **A comment the code should have made unnecessary.** Code trumps a comment. Where a rename, a
   restructure, or a split would remove the need for the comment, report that change instead. Often
   the honest fix is the name.
2. **Historical narration.** A comment states the rule the code follows now. It does not narrate
   the change that produced it. Signature phrases to grep for: "now applies", "under the old",
   "was harmless but", "used to".
3. **One fact, one home.** A comment restating what another comment already owns should be a
   pointer to that owner instead.
4. **Verbosity.** A paragraph where one sentence carries the rule.
5. **A header that re-explains its section.** Prefer one rationale attached to the rule it
   justifies.
6. **Style.** Apply the style reference, `../references/style.md`, resolved against this file, in
   flavored mode. A changed comment takes the same
   structural rules as a review comment, because the next maintainer reads it the same way.

Configuration takes a lighter pass. A setting's wording is frequently opaque on its own terms, and
its *why* is rarely derivable from the value, so a comment there earns its place more easily. Still
read it. Report one that is genuinely redundant or bloated, and do not go hunting for one.

The exception to one fact, one home is the sync comment. Sometimes this code silently depends on
code elsewhere: a wire format, a shared schema, an ordering both ends assume, a constant another
service parses. Then the comment belongs at both ends, and each copy names the other. The other
end may be another file, another package, or another repo. Test it: could someone editing *this*
code break the invariant without ever opening the other one? Yes means replicate the fact. No
means make it a pointer.

This audit is not cosmetic. Reading the comments closely is how a missing code finding surfaces.
Treat any comment that does not match what the code does as a correctness lead.
