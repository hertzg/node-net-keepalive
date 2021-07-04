const {
  alloc,
  types: { int },
} = require('ref-napi')
const { UnixFFIPlatform } = require('./unix')

const TCP_KEEPINTVL = 5
const TCP_KEEPCNT = 6
const TCP_USER_TIMEOUT = 18

class LinuxFFIPlatform extends UnixFFIPlatform {
  _setKeepAliveInterval(socket, seconds) {
    const valueRef = alloc(int, seconds)
    return this.setTCPOption(socket, TCP_KEEPINTVL, valueRef)
  }

  _getKeepAliveInterval(socket) {
    const valueRef = alloc(int)
    const err = this.getTCPOption(socket, TCP_KEEPINTVL, valueRef)
    return [err, valueRef.deref()]
  }

  _setKeepAliveProbes(socket, count) {
    const valueRef = alloc(int, count)
    return this.setTCPOption(socket, TCP_KEEPCNT, valueRef)
  }

  _getKeepAliveProbes(socket) {
    const valueRef = alloc(int)
    const err = this.getTCPOption(socket, TCP_KEEPCNT, valueRef)
    return [err, valueRef.deref()]
  }

  _setUserTimeout(socket, msecs) {
    const valueRef = alloc(int, msecs)
    return this.setTCPOption(socket, TCP_USER_TIMEOUT, valueRef)
  }

  _getUserTimeout(socket) {
    const valueRef = alloc(int)
    const err = this.getTCPOption(socket, TCP_USER_TIMEOUT, valueRef)
    return [err, valueRef.deref()]
  }
}

module.exports = {
  LinuxFFIPlatform,
}
