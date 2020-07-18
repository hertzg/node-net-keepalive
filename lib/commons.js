'use strict'

const Util = require('util')

const tryGetUV = (() => {
  let UV = null
  return () => {
    if (UV === null) {
      try {
        UV =
          typeof process.binding === 'function'
            ? process.binding('uv')
            : undefined
      } catch (ex) {
        // Continue regardless
      }
    }
    return UV
  }
})()

const uvErrName = (errno) => {
  const UV = tryGetUV()
  return UV && UV.errname ? UV.errname(errno) : 'UNKNOWN'
}

const errnoException = (errno, syscall, original) => {
  if (Util._errnoException) {
    return Util._errnoException(-errno, syscall, original)
  }

  const errname = uvErrName(-errno),
    message = original
      ? `${syscall} ${errname} (${errno}) ${original}`
      : `${syscall} ${errname} (${errno})`

  const e = new Error(message)
  e.code = errname
  e.errno = errname
  e.syscall = syscall
  return e
}

module.exports = {
  errnoException,
}
