const BasePlatform = require('../basePlatform')

module.exports = class Win32Platform extends BasePlatform {
  setKeepAliveInterval(socket, msecs) {
    return false
  }

  getKeepAliveInterval(socket) {
    return [undefined, undefined]
  }

  setKeepAliveProbes(socket, count) {
    return false
  }

  getKeepAliveProbes(socket) {
    return [undefined, undefined]
  }

  setUserTimeout(socket, msecs) {
    return false
  }

  getUserTimeout(socket) {
    return [undefined, undefined]
  }
}
