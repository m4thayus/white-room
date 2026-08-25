#!/usr/bin/env bash
#
# Read a review draft back as raw text, then post it to the pull request.
#
#   post.sh <payload.json>            print the draft, write nothing
#   post.sh <payload.json> --confirm  post each thread reply, then the review
#
# Step 7 of ../SKILL.md defines the payload shape and points here. The checks
# below cover only what the read-back does not put on screen, plus the one
# failure that cannot be rolled back. GitHub validates the rest and names the
# field it rejects.

set -euo pipefail

payload=${1:-}
mode=${2:-}

if [[ ! -f ${payload} ]]; then
  echo "usage: post.sh <payload.json> [--confirm]" >&2
  exit 64
fi

if [[ -n ${mode} && ${mode} != --confirm ]]; then
  echo "post.sh: unknown argument ${mode}" >&2
  exit 64
fi

jq empty "${payload}" 2>/dev/null || {
  echo "post.sh: ${payload} is not valid JSON" >&2
  exit 65
}

problems=$(jq -r '
  def absent(value; want): (value | type) != want or value == "";
  [ (if absent(.repo; "string") then "repo: expected \"owner/name\"" else empty end),
    (if absent(.pr; "number") then "pr: expected the pull request number" else empty end),
    (if absent(.review.body; "string") then "review.body: expected the review body" else empty end),
    (.review.event as $event
     | if ([ "APPROVE", "REQUEST_CHANGES", "COMMENT" ] | index($event // "") | not)
       then "review.event: expected APPROVE, REQUEST_CHANGES or COMMENT" else empty end),
    ( (.replies // []) | to_entries[]
      | select(absent(.value.comment_id; "number"))
      | "replies[\(.key)]: expected a numeric comment_id" )
  ] | .[]' "${payload}")

if [[ -n ${problems} ]]; then
  echo "post.sh: ${payload} is missing what the writes need" >&2
  echo "${problems}" >&2
  exit 65
fi

jq -r '
  ( (.replies // [])[] | "--- reply to comment \(.comment_id) ---", .body ),
  "--- review body (\(.review.event)) ---", .review.body,
  ( (.review.comments // [])[]
    | "--- \(.path) \(.start_line // .line):\(.line) \(.side // "RIGHT") ---", .body )
' "${payload}"

if [[ ${mode} != --confirm ]]; then
  echo "post.sh: nothing posted. Re-run with --confirm once the user approves these bytes." >&2
  exit 0
fi

repo=$(jq -r .repo "${payload}")
pr=$(jq -r .pr "${payload}")
posted=0

# ponytail: no resume. A failure between the replies and the review leaves the
# replies posted, so a re-run duplicates them. Trimming .replies by hand covers
# a rare case; add a flag only if it bites.
on_exit() {
  local status=$?
  if (( status != 0 )) && (( posted > 0 )); then
    echo "post.sh: ${posted} reply/replies already posted." >&2
    echo "post.sh: trim .replies before you re-run --confirm." >&2
  fi
}
trap on_exit EXIT

replies=$(jq '(.replies // []) | length' "${payload}")
for (( i = 0; i < replies; i++ )); do
  id=$(jq -r ".replies[${i}].comment_id" "${payload}")
  jq "{ body: .replies[${i}].body }" "${payload}" |
    gh api --method POST "repos/${repo}/pulls/${pr}/comments/${id}/replies" --input - --jq .html_url
  posted=$(( posted + 1 ))
done

jq .review "${payload}" |
  gh api --method POST "repos/${repo}/pulls/${pr}/reviews" --input - --jq .html_url
