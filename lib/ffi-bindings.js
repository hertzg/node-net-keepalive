const { platform } = require('os')
const { errnoException } = require('./commons')
const { load, DataType, open } = require('ffi-rs')

const LIBRARY_NAME = 'libnative'

const createFFI = () => {
  const cInt = DataType.I32
  const cVoidRef = DataType.External

  return {
    setsockopt: (fd, level, name, value, valueLength) => {
      const { value: ret, errnoCode } = load({
        library: LIBRARY_NAME,
        funcName: 'setsockopt',
        retType: cInt,
        paramsType: [cInt, cInt, cInt, cVoidRef, cInt],
        paramsValue: [fd, level, name, value, valueLength],
        errno: true,
      })
      return [ret, errnoCode]
    },
    getsockopt: (fd, level, name, value, valueLength) => {
      const { value: ret, errnoCode } = load({
        library: LIBRARY_NAME,
        funcName: 'getsockopt',
        retType: cInt,
        paramsType: [cInt, cInt, cInt, cVoidRef, cVoidRef],
        paramsValue: [fd, level, name, value, valueLength],
        errno: true,
      })
      return [ret, errnoCode]
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

  const [ret, errno] = ffi().setsockopt(fd, level, name, value, valueLength)

  if (ret !== 0) {
    throw errnoException(errno, 'setsockopt')
  }

  return true
}

const getsockopt = (fd, level, name, value, valueLength) => {
  if (fd == null) {
    return false
  }

  const [ret, errno] = ffi().getsockopt(fd, level, name, value, valueLength)

  if (ret !== 0) {
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
