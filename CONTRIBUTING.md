# How to contribute

I'm really glad you're reading this, because we need volunteer developers to help this project to survive.

## Testing

We have a handful of mocha tests, they contain a mix of unit and integration tests.
For any new changes please consider writing tests.

## Submitting changes

Please send a [GitHub Pull Request to hertzg/node-net-keepalive](https://github.com/hertzg/node-net-keepalive/pull/new/master)
with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)).
When you send a pull request, we will love you forever :heart: if you include
tests and examples :heart:. Please follow our coding conventions (below).

When writing commit messages please follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

Examples of correct commit messages

```text
feat(interval): describe feature in short

Optional longer description of the feature must be separated from the
short describtion by an empty line (\n\n).
If any of the changes are breaking please the breaking marker "!" before the
semicolon ":" on the first line. That would indicate that the change would
require a new major version release
```

Releases are automatic so make sure to use the correct type in commit messages
for correct version number calculation. Project follows Semver, and the following
table shows examples of commit messages affecting release versions:

| example                             | version bump | notes                                          |
| ----------------------------------- | ------------ | ---------------------------------------------- |
| `chore: comment`                    | N/A          | does not trigger release                       |
| `ci: fix ci/cd pipeline`            | N/A          | does not trigger release                       |
| `docs: new docs`                    | N/A          | does not trigger release                       |
| `fix: fix smth`                     | `patch`      | fixes bump the patch version                   |
| `perf: preformance improvement`     | `patch`      |                                                |
| `deps: dependency related`          | `patch`      | changes related to dependencies                |
| `chore(README): dependency related` | `patch`      | readme changes always bump the patch           |
| `feat: new feature`                 | `minor`      | all new features bump the minor version        |
| `feat(scope): new feature`          | `minor`      |                                                |
| `feat(api)!: breaking feature`      | `major`      | anything breaking will update the major vesion |
| `chore!: breaking feature`          | `major`      | even chores                                    |
| `fix!: breaking fix`                | `major`      | can be used with anything                      |

## Coding conventions

Start reading our code and you'll get the hang of it.

- Before committing format the code with prettier
- Before pushing make sure the tests run successfully (use provided docker-compose on windows).
- Make sure the update the JSDoc's respectively.
- When writing PR
