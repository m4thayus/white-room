export const meta = {
  name: 'review',
  description: 'Dispatch the review-changes axes as one pipeline, then sweep history behind the axes that rule on what the repo already does',
  whenToUse: 'Step 2 of the white-room:review-changes skill. args carry {skillDir, diff, commits, axes, sibling}, where each axis entry is {axis, payload, model, effort}. Returns every axis report verbatim, and posts nothing.',
  phases: [
    { title: 'Axes', detail: 'one agent per axis, each following its own brief file' },
    { title: 'History', detail: 'one bounded pickaxe scan behind Standards and Precedent' },
  ],
}

const spec = args || {}
const axes = Array.isArray(spec.axes) ? spec.axes : []

if (!spec.skillDir || !spec.diff || !axes.length) {
  return {
    error: 'This workflow needs args {skillDir, diff, commits, axes:[{axis}]}. Nothing ran, so dispatch the axes by hand.',
  }
}

// Model per axis. An axis that rules on unfamiliar code gets Opus, because a weaker model there
// returns a confident wrong finding. An axis working from an explicit brief against bounded input
// gets Sonnet, because the brief carries the reasoning. Checks judges nothing.
const MODEL = {
  correctness: 'opus',
  claims: 'opus',
  standards: 'opus',
  'prior-round': 'opus',
  precedent: 'sonnet',
  comments: 'sonnet',
  prose: 'sonnet',
  checks: 'haiku',
}

// The two axes that rule on what the repo already does. Both once answered that question from the
// working tree alone and got it wrong, so the sweep is a stage rather than a line in a brief. The
// stage owns it outright: references/history.md carries the commands, and neither brief runs them.
const HISTORY = ['standards', 'precedent']

const slug = (a) => String(a.axis).toLowerCase().replace(/ /g, '-')

function dispatch(a) {
  const s = slug(a)
  const opts = {
    label: `axis:${s}`,
    phase: 'Axes',
    model: a.model || MODEL[s] || 'sonnet',
    // Checks runs the repo's suites, and review-axis has no tool that writes.
    agentType: s === 'checks' ? 'general-purpose' : 'white-room:review-axis',
  }
  if (a.effort) opts.effort = a.effort
  const prompt = [
    `You are the ${a.axis} axis of a code review.`,
    `Read your brief at ${spec.skillDir}/briefs/${s}.md and follow it verbatim. The brief is the authority on what to look for, and it names any reference file it needs relative to its own directory.`,
    `The diff under review: ${spec.diff}`,
    spec.commits ? `The commits it holds:\n${spec.commits}` : null,
    a.payload || null,
    spec.sibling || null,
  ].filter(Boolean)
  return agent(prompt.join('\n\n'), opts)
}

function sweep(report, a) {
  const s = slug(a)
  if (!report || !HISTORY.includes(s)) return { axis: a.axis, report, history: null }
  const prompt = [
    `The ${a.axis} axis of a review of \`${spec.diff}\` reported this:`,
    report,
    'Rule on it against the repository history, which the axis could not see from the working tree.',
    `Run the sweep defined at ${spec.skillDir}/references/history.md, over every symbol, name or pattern the report rests on. That file owns the commands and the bounds they carry. Follow it verbatim. Derive the file-kind pathspec it asks for from the extensions \`${spec.diff}\` touches, and read its warning against bounding by directory.`,
    'Report one line per finding: `confirmed`, `refuted`, or `silent`, naming the commit that decides it. Then report any pattern this repo tried and retired that the axis missed, because a retired pattern is prior art. Under 300 words.',
  ]
  return agent(prompt.join('\n\n'), {
    label: `history:${s}`,
    phase: 'History',
    model: 'sonnet',
    agentType: 'white-room:review-axis',
  }).then((history) => ({ axis: a.axis, report, history }))
}

log(`${axes.length} axes, history sweep behind ${axes.filter((a) => HISTORY.includes(slug(a))).length}`)

const results = await pipeline(axes, dispatch, sweep)
const done = results.filter(Boolean)
const lost = axes.length - done.length
if (lost) log(`${lost} axes returned nothing and are not in the result — dispatch each by hand`)

return { axes: done }
