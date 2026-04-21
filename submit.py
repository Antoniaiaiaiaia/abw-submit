#!/usr/bin/env python3
"""Reference submitter for abw-submit-kit.

Usage:
    # Set the relay URL. Ask the abw admin or see the pinned message in the
    # Telegram channel (t.me/abetterweb3_cn) for the current endpoint.
    export RELAY_URL="<the relay URL>"

    # Dry run — shows what would be written, doesn't actually post.
    python submit.py examples/talent.json --dry-run

    # Live submission
    python submit.py examples/talent.json

The payload file must be a JSON object of the form:
    { "type": "talent" | "recruit", "data": { ... } }

On 400 (validation_failed), we print the errors and exit 1. Fix the payload
and retry.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from urllib import request, error

DEFAULT_RELAY = os.environ.get("RELAY_URL", "")


def submit(payload: dict, relay_url: str, dry_run: bool) -> dict:
    body = dict(payload)
    if dry_run:
        body["dry_run"] = True

    req = request.Request(
        f"{relay_url.rstrip('/')}/api/submit",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as e:
        return json.loads(e.read().decode("utf-8"))


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("payload_file", help="Path to a JSON payload file")
    p.add_argument("--relay", default=DEFAULT_RELAY, help="Relay base URL")
    p.add_argument("--dry-run", action="store_true", help="Do not actually write to Notion")
    args = p.parse_args()

    if not args.relay:
        sys.stderr.write(
            "error: RELAY_URL is not set. Ask the abw admin or see the pinned\n"
            "       message in the Telegram channel (t.me/abetterweb3_cn).\n"
        )
        return 2

    with open(args.payload_file, "r", encoding="utf-8") as f:
        payload = json.load(f)

    result = submit(payload, args.relay, args.dry_run)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    sys.exit(main())
