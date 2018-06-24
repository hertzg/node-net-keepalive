node --version
npm --version

if($env:nodejs_version -eq '4' -or $env:nodejs_version -eq '5') {
  echo "Running NPM Install (node version < 6)"
  npm i;
} else {
  echo "Updating NPM to latest version";
  npm i -g npm;

  echo "Running NPM ci (node version >= 6)"
  npm ci;
}

node --version
npm --version
