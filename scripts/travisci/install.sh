#!/usr/bin/env bash
set -ex

node --version
npm --version


if [[ $TRAVIS_NODE_VERSION == 4.* || $TRAVIS_NODE_VERSION == 6.* ]];
then
  rm -rf node_modules/*
  npm i --package-lock-only --no-audit
else
  npm ci --package-lock-only --no-audit
fi;


