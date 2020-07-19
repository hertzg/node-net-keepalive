const CHANGELOG_HEADER = `# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html), enforced with [semantic-release](https://github.com/semantic-release/semantic-release).
`

module.exports = {
  preset: 'conventionalcommits',
  releaseRules: [
    { breaking: true, release: 'major' },
    { type: 'rel', scope: 'major', release: 'major' },
    { type: 'feat', release: 'minor' },
    { type: 'rel', scope: 'minor', release: 'minor' },
    { type: 'fix', release: 'patch' },
    { type: 'perf', release: 'patch' },
    { type: 'deps', release: 'patch' },
    { scope: 'README', release: 'patch' },
    { type: 'rel', scope: 'patch', release: 'patch' },
    { scope: 'no-release', release: false },
  ],

  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      { changelogFile: 'CHANGELOG.md', changelogTitle: CHANGELOG_HEADER },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'prettier --write CHANGELOG.md',
      },
    ],
    ['@semantic-release/npm', { tarballDir: 'pack' }],
    [
      '@semantic-release/git',
      {
        assets: [
          'CHANGELOG.md',
          'package.json',
          'package-lock.json',
          'npm-shrinkwrap.json',
        ],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: ['CHANGELOG.md', 'pack/*.tgz'],
        assignees: ['hertzg'],
      },
    ],
  ],
}
