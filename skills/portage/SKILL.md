---
name: portage
description: Write the document that carries this session's work across to the next one. Use when the context window is running out, when the user stops for the day mid-task, or when the work moves to a fresh session. Produces one document holding the decision and its why, the facts already established with their evidence, and what is still open, then prints the one-line prompt that opens the next session. The user invokes it, and it writes nothing else.
argument-hint: [what the next session picks up]
disable-model-invocation: true
---

# Portage

Carry the work across to a session that will not have this one's context.

The reader is a fresh agent that remembers none of this. Anything constraining what it does next
either sits in the document or is reachable by a path the document holds.

## Where the document goes

Discover the destination. Never configure it, and never hardcode a directory name.

1. A path in the invocation.
2. A location named by project or user instructions.
3. A directory in this repo that already holds documents of this kind, under whatever name it uses
   there.
4. Otherwise the OS temp directory. Report the path you used.

**Never invent a directory.** Match a convention that already exists, or fall back to temp.

## The filename

Kebab case, named after the subject, no date prefix.

**Portaging the same work again overwrites that file.** One subject, one document, always the
current state. Write a new document when the subject changes, not when the content does.

## Write it fresh every crossing

The document is disposable. It carries the work over one gap between sessions, nothing links to it,
and it stops mattering the moment the next session has read it.

**Never edit the previous document. Write the current state from scratch, over the same path.**
Overwriting is how the old one goes away.

**Where the subject changed, so you are writing a new filename, delete the document this session
read — after the new one is on disk.** Delete only that one file, the one you were handed. Never
sweep a directory for anything that looks like a portage document, because these directories hold
other work.

**Why:** editing invites striking a line out instead of deleting it, and the document then grows
every crossing until the next session inherits a changelog. Rewriting makes every line earn its
place again. A line survives because you would write it today, not because it was true last week.

**Keep what constrains future action. Drop what only records sequence.** A rejected option and the
reason it lost survives, because it stops the next session proposing it again. Finished work does
not, and neither does "resolved on Tuesday". A resolved question moves into the decision section,
carrying its why with it.

No struck-through items, no per-line date stamps, no changelog at the foot of the file.

## Then print the prompt that opens the next session

One line, in a code block, holding the path and nothing else.

    Read /absolute/path/to/the-document.md and pick up the work.

**Never restate the decision, the state or what comes next.** The document holds all of it. A prompt
that repeats any of it is a second copy that is wrong as soon as the document changes, and the
next session has no way to tell which copy is current.
