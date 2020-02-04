#!/usr/bin/env bash
set -ex

NODE_VERSION=$(node --version)
NODE_VERSION=${NODE_VERSION:1}
echo $NODE_VERSION
npm --version

if [[ $NODE_VERSION == 4.* || $NODE_VERSION == 6.* ]];
then
  rm -rf node_modules/*
  npm i --package-lock-only --no-audit
else
  npm ci --package-lock-only --no-audit
fi;


