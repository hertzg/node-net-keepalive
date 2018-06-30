"use strict"

const Assert = require('assert')
  , Net = require('net')
  , Constants = require('./constants')
  , Ref = require('ref-napi')
  , FFIBindings = require('./ffi-bindings')


const _isSocket = (socket) => socket instanceof Net.Socket

const _getSocketFD = (socket) => {
  const fd = socket._handle != null ? socket._handle.fd : undefined
  Assert(fd && fd !== -1, 'Unable to get socket fd')
  return fd
}

function setKeepAliveInterval(socket, msecs) {
  Assert.strictEqual(arguments.length, 2,
    'setKeepAliveInterval requires two arguments')
  Assert(_isSocket(socket),
    'setKeepAliveInterval expects an instance of socket as its first ' +
    'argument')
  Assert.strictEqual(msecs != null ? msecs.constructor : void 0,
    Number, 'setKeepAliveInterval requires msec to be a Number')

  const fd = _getSocketFD(socket)
    , seconds = ~~(msecs / 1000)
    , intvlVal = Ref.alloc('int', seconds)
    , intvlValLn = intvlVal.type.size

  return FFIBindings.setsockopt(fd, Constants.SOL_TCP,
    Constants.TCP_KEEPINTVL, intvlVal, intvlValLn)
}

function getKeepAliveInterval(socket) {
  Assert.strictEqual(arguments.length, 1,
    'getKeepAliveInterval requires one arguments')
  Assert(_isSocket(socket),
    'getKeepAliveInterval expects an instance of socket as its first ' +
    'argument')

  const fd = _getSocketFD(socket)
    , intvlVal = Ref.alloc(Ref.types.uint32)
    , intvlValLn = Ref.alloc(Ref.types.uint32, intvlVal.type.size)

  FFIBindings.getsockopt(fd, Constants.SOL_TCP,
    Constants.TCP_KEEPINTVL, intvlVal, intvlValLn)

  return intvlVal.deref() * 1000
}

function setKeepAliveProbes(socket, cnt) {
  Assert.strictEqual(arguments.length, 2,
    'setKeepAliveProbes requires two arguments')
  Assert(_isSocket(socket),
    'setKeepAliveProbes expects an instance of socket as its first ' +
    'argument')
  Assert.strictEqual(cnt != null ? cnt.constructor : void 0,
    Number, 'setKeepAliveProbes requires cnt to be a Number')

  const fd = _getSocketFD(socket)
    , count = ~~(cnt)
    , cntVal = Ref.alloc('int', count)
    , cntValLn = cntVal.type.size

  return FFIBindings.setsockopt(fd, Constants.SOL_TCP,
    Constants.TCP_KEEPCNT, cntVal, cntValLn)
}

function getKeepAliveProbes(socket) {
  Assert.strictEqual(arguments.length, 1,
    'getKeepAliveProbes requires one arguments')
  Assert(_isSocket(socket),
    'getKeepAliveProbes expects an instance of socket as its first ' +
    'argument')

  const fd = _getSocketFD(socket)
    , cntVal = Ref.alloc(Ref.types.int)
    , cntValLn = Ref.alloc(Ref.types.int, cntVal.type.size)

  FFIBindings.getsockopt(fd, Constants.SOL_TCP,
    Constants.TCP_KEEPCNT, cntVal, cntValLn)

  return cntVal.deref()
}

module.exports = {
  getKeepAliveInterval,
  setKeepAliveInterval,
  getKeepAliveProbes,
  setKeepAliveProbes
}
