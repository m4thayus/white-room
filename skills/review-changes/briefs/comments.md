# Comments

Sweep every comment this diff reaches, whether it changed the comment or not. Your diff carries
whole-function context, so a comment the change left alone still arrives in front of you. Report
seven things.

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
7. **A comment the change invalidated without touching it.** The code under the comment changed and
   the comment did not. Rule every comment in your context lines against the code as it stands after
   the change, not against the diff. A comment describing the old behaviour is now wrong, and this is
   the most common way a comment goes stale.

   Your context lines stop at the enclosing function, so search for the ones outside it. Take two
   keys: the name in each hunk header, and the basename of each changed path. Count the files each
   key hits before you read anything.

   ```sh
   git grep -lE '^[[:space:]]*(#|//|/\*|\*|--|<!--).*<key>' -- . ':(exclude)*.lock'
   ```

   **Drop a key that hits more than five files.** It is a common word rather than a name, and its
   hits mean nothing. Measured in an 8562-commit repository, `index` hits 60 files, `util` 16 and
   `actions` 12, while a real name hits one. Read the hits for every key under the cap.

   **Anchor the comment marker to the start of the line, and put no `\b` around the key.** An
   unanchored `//` matches every URL in the repository. A word boundary fails inside `snake_case`
   and inside a path, which is exactly where these names sit.

   Use `git grep` here, never `rg`. It searches tracked files only and returns in about a tenth of
   a second, where `rg` descends into vendor directories and runs for minutes. Ignore a hit in a
   file the diff already changed, because your context lines covered that one.

   This reaches a comment that names the code it depends on. The sync comment rule below is what
   makes it reachable, so the search works to the degree the codebase follows that rule. Nothing
   reaches a comment that describes this behaviour without naming the code or the file. Say which
   keys you searched, and never call the sweep exhaustive.

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
