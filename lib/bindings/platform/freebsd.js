const Ref = require('ref-napi')
const UnixFFIPlatform = require('../unixPlatform')

const TCP_KEEPINTVL = 512
const TCP_KEEPCNT = 1024

module.exports = class FreeBSDFFIPlatform extends UnixFFIPlatform {
  setUserTimeout(socket, msecs) {
    return 0
  }

  getUserTimeout(socket) {
    return [0, 0]
  }

  _setKeepAliveInterval(socket, seconds) {
    const valueRef = Ref.alloc(Ref.types.int, seconds)
    return this.setTCPOption(socket, TCP_KEEPINTVL, valueRef)
  }

  _getKeepAliveInterval(socket) {
    const valueRef = Ref.alloc(Ref.types.int)
    const err = this.getTCPOption(socket, TCP_KEEPINTVL, valueRef)
    return [err, valueRef.deref()]
  }

  _setKeepAliveProbes(socket, count) {
    const valueRef = Ref.alloc(Ref.types.int, count)
    return this.setTCPOption(socket, TCP_KEEPCNT, valueRef)
  }

  _getKeepAliveProbes(socket) {
    const valueRef = Ref.alloc(Ref.types.int)
    const err = this.getTCPOption(socket, TCP_KEEPCNT, valueRef)
    return [err, valueRef.deref()]
  }
}
