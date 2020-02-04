#!/usr/bin/env sh
set -ex

apk --no-cache add bash alpine-sdk tcpdump python

/app/scripts/docker/bash.sh
