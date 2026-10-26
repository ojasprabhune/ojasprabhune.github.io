#!/usr/bin/env bash
# Publish the bookclub site. Run from anywhere: ./deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."
git add bookclub

if git diff --cached --quiet; then
  echo "nothing changed, nothing to deploy"
  exit 0
fi

git commit -q -m "bookclub: update"
git pull -q --rebase --autostash origin main
git push -q origin main

echo "deployed. live in about a minute at https://ojasprabhune.github.io/bookclub/"
