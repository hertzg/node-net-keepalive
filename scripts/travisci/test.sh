#!/usr/bin/env bash

set -ex

node --version
npm --version

sudo $(type -P npm) test-coverage
