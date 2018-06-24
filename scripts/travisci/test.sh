#!/usr/bin/env bash
node --version
npm --version

echo "npm test"
npm test

echo "npm run test-coverage"
npm run test-coverage
