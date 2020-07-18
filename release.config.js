const CHANGELOG_HEADER = `# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html), enforced with [semantic-release](https://github.com/semantic-release/semantic-release).
`

module.exports = {
  preset: 'conventionalcommits',
  releaseRules: [
    { breaking: true, release: 'major' },
    { type: 'feat', release: 'minor' },
    { type: 'fix', release: 'patch' },
  ],
  changelogFile: 'CHANGELOG.md',
  changelogTitle: CHANGELOG_HEADER,
  tarballDir: 'pack',
  message:
    'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
  assets: ['CHANGELOG.md', 'pack/*.tgz'],
  assignees: ['hertzg'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'prettier --write CHANGELOG.md',
      },
    ],
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
}
