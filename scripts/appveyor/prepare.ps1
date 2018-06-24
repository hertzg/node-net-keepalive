echo "Installing Node v$env:nodejs_version"
Install-Product node $env:nodejs_version

node --version
npm --version
