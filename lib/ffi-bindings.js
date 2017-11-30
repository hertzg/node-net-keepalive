var Ref = require('ref')
  , FFI = require('ffi')
  , Commons = require('./commons')


var ffi = FFI.Library(null, {
  //   name         ret               1             2              3                    4                     5
  setsockopt: [Ref.types.int, [Ref.types.int, Ref.types.int, Ref.types.int, Ref.refType(Ref.types.void), Ref.types.int]],
  getsockopt: [Ref.types.int, [Ref.types.int, Ref.types.int, Ref.types.int, Ref.refType(Ref.types.void), Ref.refType(Ref.types.int)]]
});

function setsockopt(fd, level, name, value, valueLength) {
  var err = ffi.setsockopt(fd, level, name, value, valueLength)
    , errno

  if (err !== 0) {
    errno = FFI.errno()
    throw Commons.errnoException(errno, 'setsockopt')
  }

  return true
}

function getsockopt(fd, level, name, value, valueLength) {
  var err = ffi.getsockopt(fd, level, name, value, valueLength)
    , errno

  if (err !== 0) {
    errno = FFI.errno()
    throw Commons.errnoException(errno, 'getsockopt')
  }
  return true
}

module.exports = {
  setsockopt: setsockopt,
  getsockopt: getsockopt
}
