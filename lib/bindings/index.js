const lazySingleton = require('./util/lazySingleton')
const os = require('os')
const DarwinFFIPlatform = require('./platform/darwin')
const FreeBSDFFIPlatform = require('./platform/freebsd')
const LinuxFFIPlatform = require('./platform/linux')
const Win32Platform = require('./platform/win32')

const createPlatform = (platform = os.platform()) => {
  switch (platform) {
    case 'win32':
      return new Win32Platform()
    case 'darwin':
      return new DarwinFFIPlatform()
    case 'freebsd':
      return new FreeBSDFFIPlatform()
  }

  return new LinuxFFIPlatform()
}

const usePlatform = lazySingleton(createPlatform)

module.exports = {
  usePlatform,
  createPlatform,
}
