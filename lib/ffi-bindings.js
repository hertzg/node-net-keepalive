'use strict'

const Ref = require('ref-napi')
  , FFI = require('ffi-napi')
  , Commons = require('./commons')


const cInt = Ref.types.int
  , cVoid = Ref.types.void

const ffi = FFI.Library(null, {
  //name       ret    1     2     3     4                   5
  setsockopt: [cInt, [cInt, cInt, cInt, Ref.refType(cVoid), cInt]],
  getsockopt: [cInt, [cInt, cInt, cInt, Ref.refType(cVoid), Ref.refType(cInt)]]
})

const setsockopt = (fd, level, name, value, valueLength) => {
  const err = ffi.setsockopt(fd, level, name, value, valueLength)

  if (err !== 0) {
    let errno = FFI.errno()
    throw Commons.errnoException(errno, 'setsockopt')
  }

  return true
}

const getsockopt = (fd, level, name, value, valueLength) => {
  const err = ffi.getsockopt(fd, level, name, value, valueLength)

  if (err !== 0) {
    let errno = FFI.errno()
    throw Commons.errnoException(errno, 'getsockopt')
  }
  return true
}

module.exports = {
  setsockopt,
  getsockopt
}
