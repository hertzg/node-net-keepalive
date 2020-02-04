#!/usr/bin/env bash

set -ex

node --version
npm --version

sudo $(which npm) test

npm run test-coverage
