#!/usr/bin/env bash

set -ex

node --version
npm --version

sudo npm test

npm run test-coverage
