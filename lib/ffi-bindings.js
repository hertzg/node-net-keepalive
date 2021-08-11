const { platform } = require('os')
const { errnoException } = require('./commons')
const Ref = require('ref-napi')
const FFI = require('ffi-napi')

const createFFI = () => {
  const cInt = Ref.types.int
  const cVoid = Ref.types.void

  return FFI.Library(null, {
    //name       ret    1     2     3     4                   5
    setsockopt: [cInt, [cInt, cInt, cInt, Ref.refType(cVoid), cInt]],
    getsockopt: [
      cInt,
      [cInt, cInt, cInt, Ref.refType(cVoid), Ref.refType(cInt)],
    ],
  })
}

const ffi = (() => {
  let instance
  return () => {
    if (!instance) {
      instance = createFFI()
    }
    return instance
  }
})()

const setsockopt = (fd, level, name, value, valueLength) => {
  if(fd == null) {
    return false
  }

  const err = ffi().setsockopt(fd, level, name, value, valueLength)

  if (err !== 0) {
    const errno = FFI.errno()
    throw errnoException(errno, 'setsockopt')
  }

  return true
}

const getsockopt = (fd, level, name, value, valueLength) => {
  if(fd == null) {
    return false
  }

  const err = ffi().getsockopt(fd, level, name, value, valueLength)

  if (err !== 0) {
    const errno = FFI.errno()
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
