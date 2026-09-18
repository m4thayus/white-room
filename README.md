# The White Room

_A construct for my Claude Code skills._

> I know kung fu.\
> — Neo

Personal Claude Code skills. Each one grants a capability by taking options
away.

## Install

```sh
claude plugin marketplace add m4thayus/white-room
claude plugin install white-room@white-room
```

## Skills

| Skill            | What it does                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `review-changes` | Reviews a PR, a branch or a diff. Produces findings and a verdict, and never edits the code.     |
| `communique`     | Drafts anything that leaves the session for another human, and gates it on your approval.        |
| `portage`        | Writes the handoff document that carries the work across to a fresh session.                     |
| `request-review` | Picks two reviewers for a PR, assigns them on GitHub, and announces it once in Slack.            |
| `standup-prep`   | Sweeps GitHub, Linear, git log and Slack, then writes the week's standup-prep note to the vault. |
| `standup-recap`  | Files the meeting's notes markdown into the vault and updates the state-of-work memory note.     |

## Conventions

Commit subjects follow
[Conventional Commits](https://www.conventionalcommits.org/). Types in use:
`feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `build`.

Prettier owns formatting. It hard-wraps prose at 80 columns and everything else
at 120, per `.prettierrc.json`. `markdownlint-cli2` owns what a formatter cannot
reach, such as a fenced block with no language, per `.markdownlint-cli2.jsonc`.

## Contributing

```sh
npm ci      # installs the tools and wires the pre-commit hook
npm run format
npm run lint  # or lint:format, lint:markdown, lint:frontmatter on their own
```
