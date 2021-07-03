const { platform } = require('os')

const itSkipOS = (skipOs, ...args) =>
  (skipOs.includes(platform()) ? it.skip : it)(...args)

const skipSuiteOnWindows = () => {
  if (platform() === 'win32') {
    const message = `does not work on windows`
    test.only(message, () => {
      console.warn(`[SKIP] Skipped as this feature does not work on Windows`)
    })
  }
}

const skipSuiteOnMacOs = () => {
  if (platform() === 'darwin') {
    const message = `does not work on darwin`
    test.only(message, () => {
      console.warn(`[SKIP] Skipped as this feature does not work on MacOS`)
    })
  }
}

const skipSuiteOnFreeBsd = () => {
  if (platform() === 'freebsd') {
    const message = `does not work on freebsd`
    test.only(message, () => {
      console.warn(`[SKIP] Skipped as this feature does not work on FreeBSD`)
    })
  }
}

const collectChunks = (stream) => {
  const chunks = []
  stream.on('data', (chunk) => chunks.push(chunk))
  return chunks
}

module.exports = {
  skipSuiteOnWindows,
  skipSuiteOnMacOs,
  skipSuiteOnFreeBsd,
  collectChunks,
  itSkipOS,
}
