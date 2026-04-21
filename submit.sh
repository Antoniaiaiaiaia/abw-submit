#!/usr/bin/env bash
# Reference curl submitter.
#
# Usage:
#   RELAY_URL=https://abw-submit-relay.vercel.app ./submit.sh examples/talent.json
set -euo pipefail

RELAY_URL="${RELAY_URL:-https://abw-submit-relay.vercel.app}"
PAYLOAD_FILE="${1:-examples/talent.json}"

curl -sS -X POST "${RELAY_URL%/}/api/submit" \
  -H 'Content-Type: application/json' \
  --data @"$PAYLOAD_FILE" | (command -v jq >/dev/null && jq || cat)
