#!/usr/bin/env bash

set -ex

env
node --version
npm --version

npm config set loglevel http
npm config set registry http://verdaccio:4873/

if [[ $NODE_VERSION == 4.* || $NODE_VERSION == 6.* ]];
then
  rm -rf node_modules/*
  npm i --package-lock-only --no-audit
else
  npm ci --package-lock-only --no-audit
fi;

npm test
