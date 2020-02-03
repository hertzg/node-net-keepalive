#!/usr/bin/env bash

set -ex

echo "Setting up NVM"
rm -rf ~/.nvm
git clone https://github.com/creationix/nvm.git ~/.nvm
pushd ~/.nvm
git checkout `git describe --abbrev=0 --tags`
source ~/.nvm/nvm.sh
nvm install $TRAVIS_NODE_VERSION
PATH="`npm bin`:`npm bin -g`:$PATH"

echo "Fix CXX version for ffi"
if [[ $TRAVIS_OS_NAME == "linux" ]]; then
  export CXX=g++-4.8;
fi
$CXX --version

popd

node --version
npm --version
