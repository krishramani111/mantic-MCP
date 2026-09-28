#!/bin/sh
set -eu

repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
env_file="$repo_dir/.env"

if [ ! -r "$env_file" ]; then
  echo "Missing local .env; copy .env.example and add the Mautic API settings." >&2
  exit 1
fi

set -a
. "$env_file"
set +a
exec node "$repo_dir/build/index.js"
