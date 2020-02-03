#!/usr/bin/env bash

set -ex

node --version
npm --version

npm test

npm run test-coverage
