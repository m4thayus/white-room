# The White Room

A Claude Code plugin that is also its own marketplace. It carries skills, plus the agents and
workflows those skills dispatch.

`AGENTS.md` is a symlink to this file. Edit `CLAUDE.md`.

## Layout

| Path | Holds |
|---|---|
| `skills/<name>/SKILL.md` | One skill. Add `references/`, `briefs/` or `scripts/` beside it when the skill earns them. |
| `agents/` | Subagent definitions a skill dispatches. |
| `workflows/` | Workflow scripts a skill runs. |
| `.claude-plugin/` | `plugin.json` and `marketplace.json`. |

## Adding or changing a skill

1. Write `skills/<name>/SKILL.md` with `name` and `description` frontmatter. Put the triggers in the
   description, because it is all the router reads.
2. Add or update the skill's row in `README.md`.
3. Bump the version in `.claude-plugin/plugin.json` and in both places in
   `.claude-plugin/marketplace.json`.

**Keep `README.md` current in the same change.** It is the only place a reader learns what this
plugin offers, so a new skill, a rename or a changed purpose lands there too.

**A rename breaks every invocation of the old name.** User instructions and other skills name a
skill as `white-room:<name>`, and nothing in this repo catches a stale reference. Grep the callers
before you rename.

## Commits

See the Conventions section of `README.md`.
