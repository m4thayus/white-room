#!/usr/bin/env node
const { readFileSync, globSync } = require("node:fs")

const args = process.argv.slice(2)
const files = args.length ? args : globSync(["skills/*/SKILL.md", "agents/*.md"])
const bad = files.filter(f => !/^description: >-$/m.test(readFileSync(f, "utf8").split("\n---")[0]))

bad.forEach(f => console.error(`${f}: description must be a folded block scalar (description: >-)`))
process.exit(bad.length ? 1 : 0)
