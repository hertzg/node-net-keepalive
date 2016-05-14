var UV = null
  , Util = require('util')

function tryGetUV() {
  if(UV === null) {
    try {
      UV = typeof process.binding === "function" ? process.binding('uv') : undefined
    } catch (ex) {}
  }
  return UV
}

function uvErrName(errno) {
  var UV = tryGetUV()
    , errName = "UNKNOWN"

  if (UV && UV.errname) {
    errName = UV.errname(-errno)
  }
  
  return errName
}

function errnoException(errno, syscall, original) {
  if (Util._errnoException) {
    return Util._errnoException(-errno, syscall)
  }

  var errname = uvErrName(-errno)
    , message = syscall + " " + errname + " (" + errno + ")"

  if (original) {
    message += " " + original;
  }
  
  var e = new Error(message);
  e.code = errname;
  e.errno = errname;
  e.syscall = syscall;
  return e;
}

module.exports = {
  errnoException: errnoException
}