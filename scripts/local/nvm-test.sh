#!/usr/bin/env bash

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

for v in "$@"; do
  nvm i $v
  nvm use $v
  npm ci
  $(which npm) test
done
