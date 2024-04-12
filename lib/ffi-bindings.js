const { platform } = require('os')
const { errnoException } = require('./commons')
const { load, DataType, open, close, arrayConstructor } = require('ffi-rs')

const LIBRARY_NAME = 'libnative'

const createFFI = () => {
  const cInt = DataType.I32
  const cVoidRef = DataType.External

  return {
    setsockopt: (fd, level, name, value, valueLength) => {
      const ret = load({
        library: LIBRARY_NAME,
        funcName: 'setsockopt',
        retType: cInt,
        paramsType: [cInt, cInt, cInt, cVoidRef, cInt],
        paramsValue: [fd, level, name, value, valueLength],
      })
      return ret
    },
    getsockopt: (fd, level, name, value, valueLength) => {
      const ret = load({
        library: LIBRARY_NAME,
        funcName: 'getsockopt',
        retType: cInt,
        paramsType: [cInt, cInt, cInt, cVoidRef, cVoidRef],
        paramsValue: [fd, level, name, value, valueLength],
      })
      return ret
    },
  }
}

const ffi = (() => {
  let instance
  return () => {
    if (!instance) {
      open({
        library: LIBRARY_NAME,
        path: '',
      })
      instance = createFFI()
    }
    return instance
  }
})()

const setsockopt = (fd, level, name, value, valueLength) => {
  if (fd == null) {
    return false
  }

  const err = ffi().setsockopt(fd, level, name, value, valueLength)

  if (err !== 0) {
    const errno = 9 // FIXME: there's no FFI.errno() in ffi-rs
    throw errnoException(errno, 'setsockopt')
  }

  return true
}

const getsockopt = (fd, level, name, value, valueLength) => {
  if (fd == null) {
    return false
  }

  const err = ffi().getsockopt(fd, level, name, value, valueLength)

  if (err !== 0) {
    const errno = 9 // FIXME: there's no FFI.errno() in ffi-rs
    throw errnoException(errno, 'getsockopt')
  }
  return true
}

const noop = () => false
const isWin32 = platform() === 'win32'

module.exports = {
  setsockopt: isWin32 ? noop : setsockopt,
  getsockopt: isWin32 ? noop : getsockopt,
}
