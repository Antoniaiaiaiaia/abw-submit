#!/usr/bin/env bash
# Reference curl submitter.
#
# Defaults to https://abw-submit-relay.vercel.app. Override only if a
# maintainer points you at a different endpoint:
#
#   export RELAY_URL="https://other.example/"
#   ./submit.sh examples/talent.json
#
set -euo pipefail

RELAY_URL="${RELAY_URL:-https://abw-submit-relay.vercel.app}"
PAYLOAD_FILE="${1:-examples/talent.json}"

curl -sS -X POST "${RELAY_URL%/}/api/submit" \
  -H 'Content-Type: application/json' \
  --data @"$PAYLOAD_FILE" | (command -v jq >/dev/null && jq || cat)
