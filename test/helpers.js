const { platform } = require('os')

const itSkipOS = (skipOs, ...args) =>
  (skipOs.includes(platform()) ? it.skip : it)(...args)

const skipOnPlatforms = (...platforms) => {
  if (platforms.includes(platform())) {
    const message = `is skipped on ${platforms.join(', ')} platforms`
    test.only(message, () => {
      console.warn(`[SKIP] ${message}`)
    })
  }
}

const onlyOnPlatforms = (...platforms) => {
  if (!platforms.includes(platform())) {
    const message = `is only run on ${platforms.join(', ')} platforms`
    test.only(message, () => {
      console.warn(`[SKIP] ${message}`)
    })
  }
}

const collectChunks = (stream) => {
  const chunks = []
  stream.on('data', (chunk) => chunks.push(chunk))
  return chunks
}

module.exports = {
  skipOnPlatforms,
  onlyOnPlatforms,
  collectChunks,
  itSkipOS,
}
