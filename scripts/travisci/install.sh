#!/usr/bin/env bash
node --version
npm --version

if [[ $TRAVIS_NODE_VERSION == "4" || $TRAVIS_NODE_VERSION == "5" ]]; then
  echo "Using npm install (node version < 6)"
  npm i;
else
  echo "Updating npm to latest version (node version >= 6)"
  npm i -g npm;

  echo "Using npm ci"
  npm ci;
fi

node --version
npm --version
