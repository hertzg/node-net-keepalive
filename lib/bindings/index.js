const { platform: currentPlatform } = require('os')
const { DarwinFFIPlatform } = require('./darwin')
const { FreeBSDFFIPlatform } = require('./freebsd')
const { LinuxFFIPlatform } = require('./linux')

const usePlatform = (() => {
  let platform
  return () => {
    if (!platform) {
      platform = createPlatform()
    }
    return platform
  }
})()

const createPlatform = (platform = currentPlatform()) => {
  switch (platform) {
    case 'darwin':
      return new DarwinFFIPlatform()
    case 'freebsd':
      return new FreeBSDFFIPlatform()
  }

  return new LinuxFFIPlatform()
}

const throwIfError = (err) => {
  if (err) {
    throw err
  }
}

module.exports = {
  usePlatform,
  createPlatform,
  throwIfError,
}
