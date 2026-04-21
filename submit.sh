#!/usr/bin/env bash
# Reference curl submitter.
#
# The relay URL is not published in this repo. Ask the abw admin or see the
# pinned message in the Telegram channel (t.me/abetterweb3_cn) for the
# current endpoint, then:
#
#   export RELAY_URL="<the relay URL>"
#   ./submit.sh examples/talent.json
#
set -euo pipefail

: "${RELAY_URL:?RELAY_URL is not set. Ask the abw admin (pinned message in t.me/abetterweb3_cn).}"
PAYLOAD_FILE="${1:-examples/talent.json}"

curl -sS -X POST "${RELAY_URL%/}/api/submit" \
  -H 'Content-Type: application/json' \
  --data @"$PAYLOAD_FILE" | (command -v jq >/dev/null && jq || cat)
