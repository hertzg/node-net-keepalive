var Assert = require('assert')
  , Net = require('net')
  , Constants = require('./constants')
  , Ref = require('ref')
  , FFIBindings = require('./ffi-bindings')


function _isSocket(socket) {
  return socket instanceof Net.Socket
}

function _getSocketFD(socket) {
  var ref
    , fd = (ref = socket._handle) != null ? ref.fd : void 0
  
  Assert(fd && fd !== -1, 'Unable to get socket fd')
  return fd
}

function setKeepAliveInterval(socket, msecs) {  
  Assert.strictEqual(arguments.length, 2, 
    'setKeepAliveInterval requires two arguments')
  Assert(_isSocket(socket), 
    'setKeepAliveInterval expects an instance of socket as its first '+
    'argument')
  Assert.strictEqual(msecs != null ? msecs.constructor : void 0, 
    Number, 'setKeepAliveInterval requires msec to be a Number')
  
  var fd = _getSocketFD(socket)
    , seconds = ~~(msecs / 1000)
    , intvlVal = Ref.alloc('int', seconds)
    , intvlValLn = intvlVal.type.size
    
  return FFIBindings.setsockopt(fd, Constants.SOL_TCP,
    Constants.TCP_KEEPINTVL, intvlVal, intvlValLn)
}

function setKeepAliveProbes(socket, cnt) {  
  Assert.strictEqual(arguments.length, 2, 
    'setKeepAliveProbes requires two arguments')
  Assert(_isSocket(socket), 
    'setKeepAliveProbes expects an instance of socket as its first '+
    'argument')
  Assert.strictEqual(cnt != null ? cnt.constructor : void 0, 
    Number, 'setKeepAliveProbes requires cnt to be a Number')
  
  var fd = _getSocketFD(socket)
    , count = ~~(cnt)
    , cntVal = Ref.alloc('int', count)
    , cntValLn = cntVal.type.size
    
  return FFIBindings.setsockopt(fd, Constants.SOL_TCP,
    Constants.TCP_KEEPCNT, cntVal, cntValLn)
}

module.exports = {
  setKeepAliveInterval: setKeepAliveInterval,
  setKeepAliveProbes: setKeepAliveProbes
};