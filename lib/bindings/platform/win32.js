const BasePlatform = require('../basePlatform')

module.exports = class Win32Platform extends BasePlatform {
  setKeepAliveInterval(socket, msecs) {
    return undefined
  }

  getKeepAliveInterval(socket) {
    return [undefined, undefined]
  }

  setKeepAliveProbes(socket, count) {
    return undefined
  }

  getKeepAliveProbes(socket) {
    return [undefined, undefined]
  }

  setUserTimeout(socket, msecs) {
    return undefined
  }

  getUserTimeout(socket) {
    return [undefined, undefined]
  }
}
