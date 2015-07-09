Assert = require 'assert'
FFI = require 'ffi'
Net = require 'net'
Ref = require 'ref'
Util = require 'util'
UV = null

## CONSTANTS
SOL_TCP   = 6

TCP_KEEPIDLE   = 4
TCP_KEEPINTVL   = 5
TCP_KEEPCNT     = 6

## FFI Bindings
bindings = FFI.Library null,
  setsockopt: ['int',     ['int', 'int', 'int', 'pointer', 'int']]
  #getsockopt: ['int',     ['int', 'int', 'int', 'pointer', 'pointer']]
  #strerror:   ['string',  ['int']]

_errnoException = (errno, syscall) ->
  if Util._errnoException
    return Util._errnoException -errno, syscall

  unless UV
    UV = process.binding? 'uv'

  errname = UV.errname -errno
  message = "#{syscall} #{errname}"
  if original
    message += " #{original}"
  e = new Error message
  e.code = errname
  e.errno = errname
  e.syscall = syscall
  return e


_isSocket = (socket) -> socket instanceof Net.Socket
_getSocketFD = (socket) -> return socket._handle?.fd

setKeepAliveInterval = (socket, msecs) ->
  Assert.strictEqual arguments.length, 2, 'setKeepAliveInterval requires two
    arguments'
  Assert _isSocket(socket), 'setKeepAliveInterval expects an instance of socket
    as its first argument'
  Assert.strictEqual msecs?.constructor, Number, 'setKeepAliveInterval requires
    msec to be a Number'

  fd = _getSocketFD socket
  Assert fd && fd isnt -1, 'Unable to get socket fd'

  seconds = ~~(msecs / 1000)
  intvlVal = Ref.alloc 'int', seconds
  intvlValLn = intvlVal.type.size

  err = bindings.setsockopt fd, SOL_TCP, TCP_KEEPINTVL, intvlVal, intvlValLn
  unless err is 0
    errno = FFI.errno()
    throw _errnoException errno, 'setsockopt'

  return true

setKeepAliveProbes = (socket, cnt) ->
  Assert.strictEqual arguments.length, 2, 'setKeepAliveProbes requires two
    arguments'
  Assert _isSocket(socket), 'setKeepAliveProbes expects an instance of socket
    as its first argument'
  Assert.strictEqual cnt?.constructor, Number, 'setKeepAliveProbes requires
    cnt to be a Number'

  fd = _getSocketFD socket
  Assert fd, 'Unable to get socket fd'

  count = ~~(cnt)
  cntVal = Ref.alloc 'int', count
  cntValLn = cntVal.type.size

  err = bindings.setsockopt fd, SOL_TCP, TCP_KEEPCNT, cntVal, cntValLn
  unless err is 0
    errno = FFI.errno()
    throw _errnoException errno, 'setsockopt'

  return true

module.exports =
  setKeepAliveInterval: setKeepAliveInterval
  setKeepAliveProbes: setKeepAliveProbes