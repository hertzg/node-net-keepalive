const Ref = require('ref-napi')
const UnixFFIPlatform = require('../unixPlatform')

const TCP_KEEPINTVL = 0x101
const TCP_KEEPCNT = 0x102
const TCP_RXT_CONNDROPTIME = 0x80

module.exports = class DarwinFFIPlatform extends UnixFFIPlatform {
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

  _setUserTimeout(socket, msecs) {
    const valueRef = Ref.alloc(Ref.types.int, msecs)
    return this.setTCPOption(socket, TCP_RXT_CONNDROPTIME, valueRef)
  }

  _getUserTimeout(socket) {
    const valueRef = Ref.alloc(Ref.types.int)
    const err = this.getTCPOption(socket, TCP_RXT_CONNDROPTIME, valueRef)
    return [err, valueRef.deref()]
  }
}
