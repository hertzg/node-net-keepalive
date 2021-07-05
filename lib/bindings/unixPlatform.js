const getSocketFd = require('./util/getSocketFd')
const Ref = require('ref-napi')
const FFIBasedPlatform = require('./ffiPlatform')

const SOL_TCP = 6

module.exports = /* abstract */ class UnixFFIPlatform extends FFIBasedPlatform {
  setTCPOption(socket, option, valueRef) {
    const fd = getSocketFd(socket)
    return this.setSocketOption(
      fd,
      SOL_TCP,
      option,
      valueRef,
      Ref.alloc(Ref.types.int, valueRef.type.size)
    )
  }

  getTCPOption(socket, option, valueRef) {
    const fd = getSocketFd(socket)
    const lengthRef = Ref.alloc(Ref.types.int, valueRef.type.size)
    return this.getSocketOption(fd, SOL_TCP, option, valueRef, lengthRef)
  }

  setKeepAliveInterval(socket, msecs) {
    const seconds = ~~(msecs / 1000)
    return this._setKeepAliveInterval(socket, seconds)
  }

  getKeepAliveInterval(socket) {
    const [err, seconds] = this._getKeepAliveInterval(socket)
    return [err, seconds * 1000]
  }

  setKeepAliveProbes(socket, count) {
    return this._setKeepAliveProbes(socket, count)
  }

  getKeepAliveProbes(socket) {
    return this._getKeepAliveProbes(socket)
  }

  setUserTimeout(socket, msecs) {
    return this._setUserTimeout(socket, ~~msecs)
  }

  getUserTimeout(socket) {
    return this._getUserTimeout(socket)
  }
}
