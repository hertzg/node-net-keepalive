/**
 * The Missing (TCP_KEEPINTVL and TCP_KEEPCNT) SO_KEEPALIVE socket option setters and getters for Node using
 * ffi-rs module.
 *
 * Note: For methods provided by this module to work you must enable SO_KEEPALIVE and set the TCP_KEEPIDLE options for
 * socket using Net.Socket-s built in method socket.setKeepAlive([enable][, initialDelay]) !
 *
 * @author George Kotchlamazashvili <georgedot@gmail.com>
 *
 * @example <caption>CommonJS</caption>
 * require('net-keepalive')
 *
 * @example <caption>ES Modules</caption>
 * import * as NetKeepalive from 'net-keepalive'
 *
 * @module net-keepalive
 * @since v0.1.0
 */
'use strict'

const Assert = require('assert'),
  Net = require('net'),
  OS = require('os'),
  Constants = require('./constants'),
  { DataType, createPointer, restorePointer } = require('ffi-rs'),
  FFIBindings = require('./ffi-bindings')

const _isSocket = (socket) => socket instanceof Net.Socket

const _getSocketFD = (socket) => {
  const fd = socket._handle != null ? socket._handle.fd : undefined
  if (OS.platform() !== 'win32') {
    Assert(fd && fd !== -1, 'Unable to get socket fd')
  }
  return fd
}

/**
 * Sets the TCP_KEEPINTVL value for specified socket.
 *
 * Note: The msec will be rounded towards the closest integer
 *
 * @since v0.1.0
 * @param {Net.Socket} socket to set the value for
 * @param {number} msecs to wait in-between probes
 *
 * @returns {boolean} <code>true</code> on success
 *
 * @example <caption>Set interval in-between probes to 1 second (<code>1000</code> milliseconds) for socket <code>s</code></caption>
 * NetKeepAlive.setKeepAliveInterval(s, 1000)
 *
 * @throws {AssertionError} setKeepAliveInterval requires two arguments
 * @throws {AssertionError} setKeepAliveInterval expects an instance of socket as its first argument
 * @throws {AssertionError} setKeepAliveInterval requires msec to be a Number
 * @throws {ErrnoException|Error} Unexpected error
 */
module.exports.setKeepAliveInterval = function setKeepAliveInterval(
  socket,
  msecs
) {
  Assert.strictEqual(
    arguments.length,
    2,
    'setKeepAliveInterval requires two arguments'
  )
  Assert(
    _isSocket(socket),
    'setKeepAliveInterval expects an instance of socket as its first argument'
  )
  Assert.strictEqual(
    msecs != null ? msecs.constructor : void 0,
    Number,
    'setKeepAliveInterval requires msec to be a Number'
  )

  const fd = _getSocketFD(socket),
    seconds = ~~(msecs / 1000),
    dataType = DataType.I32,
    [intvlVal] = createPointer({
      paramsType: [dataType],
      paramsValue: [seconds],
    }),
    intvlValLn = 4 // sizeof int

  return FFIBindings.setsockopt(
    fd,
    Constants.SOL_TCP,
    Constants.TCP_KEEPINTVL,
    intvlVal,
    intvlValLn
  )
}

/**
 * Returns the TCP_KEEPINTVL value for specified socket.
 *
 * @since v1.1.0
 * @param {Net.Socket} socket to check the value for
 *
 * @returns {number} interval (ms) in-between probes
 *
 * @example <caption>Get the current interval in-between probes for socket <code>s</code></caption>
 * NetKeepAlive.getKeepAliveInterval(s) // returns 1000 based on setter example
 *
 * @throws {AssertionError} getKeepAliveInterval requires one arguments
 * @throws {AssertionError} getKeepAliveInterval expects an instance of socket as its first argument
 * @throws {ErrnoException|Error} Unexpected error
 */
module.exports.getKeepAliveInterval = function getKeepAliveInterval(socket) {
  Assert.strictEqual(
    arguments.length,
    1,
    'getKeepAliveInterval requires one arguments'
  )
  Assert(
    _isSocket(socket),
    'getKeepAliveInterval expects an instance of socket as its first argument'
  )

  const fd = _getSocketFD(socket),
    dataType = DataType.I32,
    [intvlVal] = createPointer({
      paramsType: [dataType],
      paramsValue: [0],
    }),
    [intvlValLn] = createPointer({
      paramsType: [DataType.I32],
      paramsValue: [4], // sizeof int
    })

  FFIBindings.getsockopt(
    fd,
    Constants.SOL_TCP,
    Constants.TCP_KEEPINTVL,
    intvlVal,
    intvlValLn
  )

  const [value] = restorePointer({
    retType: [dataType],
    paramsValue: [intvlVal],
  })

  return value * 1000
}

/**
 * Sets the TCP_KEEPCNT value for specified socket.
 *
 * @since v0.1.0
 * @param {Net.Socket} socket to set the value for
 * @param {number} cnt number of probes to send
 *
 * @returns {boolean} <code>true</code> on success
 *
 *
 * @example <caption>Set number of probes to send to 1 for socket <code>s</code></caption>
 * NetKeepAlive.setKeepAliveProbes(s, 1)
 *
 * @throws {AssertionError} setKeepAliveProbes requires two arguments
 * @throws {AssertionError} setKeepAliveProbes expects an instance of socket as its first argument
 * @throws {AssertionError} setKeepAliveProbes requires cnt to be a Number
 * @throws {ErrnoException|Error} Unexpected error
 */
module.exports.setKeepAliveProbes = function setKeepAliveProbes(socket, cnt) {
  Assert.strictEqual(
    arguments.length,
    2,
    'setKeepAliveProbes requires two arguments'
  )
  Assert(
    _isSocket(socket),
    'setKeepAliveProbes expects an instance of socket as its first argument'
  )
  Assert.strictEqual(
    cnt != null ? cnt.constructor : void 0,
    Number,
    'setKeepAliveProbes requires cnt to be a Number'
  )

  const fd = _getSocketFD(socket),
    count = ~~cnt,
    dataType = DataType.I32,
    [cntVal] = createPointer({
      paramsType: [dataType],
      paramsValue: [count],
    }),
    cntValLn = 4 // sizeof int

  return FFIBindings.setsockopt(
    fd,
    Constants.SOL_TCP,
    Constants.TCP_KEEPCNT,
    cntVal,
    cntValLn
  )
}

/**
 * Returns the TCP_KEEPCNT value for specified socket.
 *
 * @since v1.1.0
 * @param {Net.Socket} socket to check the value for
 *
 * @returns {number} number of probes to send
 *
 * @example <caption>Get the current number of probes to send for socket <code>s</code></caption>
 * NetKeepAlive.getKeepAliveProbes(s) // returns 1 based on setter example
 *
 * @throws {AssertionError} getKeepAliveProbes requires one arguments
 * @throws {AssertionError} getKeepAliveProbes expects an instance of socket as its first argument
 * @throws {ErrnoException|Error} Unexpected error
 */
module.exports.getKeepAliveProbes = function getKeepAliveProbes(socket) {
  Assert.strictEqual(
    arguments.length,
    1,
    'getKeepAliveProbes requires one arguments'
  )
  Assert(
    _isSocket(socket),
    'getKeepAliveProbes expects an instance of socket as its first argument'
  )

  const fd = _getSocketFD(socket),
    dataType = DataType.I32,
    [cntVal] = createPointer({
      paramsType: [dataType],
      paramsValue: [0],
    }),
    [cntValLn] = createPointer({
      paramsType: [DataType.I32],
      paramsValue: [4], // sizeof int
    })

  FFIBindings.getsockopt(
    fd,
    Constants.SOL_TCP,
    Constants.TCP_KEEPCNT,
    cntVal,
    cntValLn
  )

  const [value] = restorePointer({
    retType: [dataType],
    paramsValue: [cntVal],
  })

  return value
}

/**
 * Sets the TCP_USER_TIMEOUT (TCP_RXT_CONNDROPTIME on `darwin`) value for specified socket.
 *
 * Notes:
 * * This method is only supported on `linux` and `darwin`, will throw on `freebsd`.
 * * The msec will be rounded towards the closest integer.
 * * When used with the TCP keepalive options, will override them.
 *
 * @see {@link https://man7.org/linux/man-pages/man7/tcp.7.html|tcp(7):TCP_USER_TIMEOUT }
 *
 * @since v1.4.0
 * @param {Net.Socket} socket to set the value for
 * @param {number} msecs to wait for unacknowledged data before closing the connection
 *
 * @returns {boolean} <code>true</code> on success
 *
 * @example <caption>Set user timeout to 30 seconds (<code>30000</code> milliseconds) for socket <code>s</code></caption>
 * NetKeepAlive.setUserTimeout(s, 30000)
 *
 * @throws {AssertionError} setUserTimeout requires two arguments
 * @throws {AssertionError} setUserTimeout called on unsupported platform
 * @throws {AssertionError} setUserTimeout expects an instance of socket as its first argument
 * @throws {AssertionError} setUserTimeout requires msec to be a Number
 * @throws {ErrnoException|Error} Unexpected error
 */
module.exports.setUserTimeout = function setUserTimeout(socket, msecs) {
  Assert.strictEqual(
    arguments.length,
    2,
    'setUserTimeout requires two arguments'
  )
  Assert(
    Constants.TCP_USER_TIMEOUT != null,
    'setUserTimeout called on unsupported platform'
  )
  Assert(
    _isSocket(socket),
    'setUserTimeout expects an instance of socket as its first argument'
  )
  Assert.strictEqual(
    msecs != null ? msecs.constructor : void 0,
    Number,
    'setUserTimeout requires msec to be a Number'
  )

  const fd = _getSocketFD(socket),
    msecInt = ~~msecs,
    dataType = DataType.I32,
    [msecVal] = createPointer({
      paramsType: [dataType],
      paramsValue: [msecInt],
    }),
    msecValLn = 4 // sizeof int

  return FFIBindings.setsockopt(
    fd,
    Constants.SOL_TCP,
    Constants.TCP_USER_TIMEOUT,
    msecVal,
    msecValLn
  )
}

/**
 * Returns the TCP_USER_TIMEOUT value for specified socket.
 *
 * Note: This method is only supported on `linux`, will throw on `darwin` and `freebsd`.
 *
 * @since v1.4.0
 * @param {Net.Socket} socket to check the value for
 *
 * @returns {number} msecs to wait for unacknowledged data before closing the connection
 *
 * @example <caption>Get the current user timeout for socket <code>s</code></caption>
 * NetKeepAlive.getUserTimeout(s) // returns 30000 based on setter example
 *
 * @throws {AssertionError} getUserTimeout requires one arguments
 * @throws {AssertionError} getUserTimeout called on unsupported platform
 * @throws {AssertionError} getUserTimeout expects an instance of socket as its first argument
 * @throws {ErrnoException|Error} Unexpected error
 */
module.exports.getUserTimeout = function getUserTimeout(socket) {
  Assert.strictEqual(
    arguments.length,
    1,
    'getUserTimeout requires one arguments'
  )
  Assert(
    Constants.TCP_USER_TIMEOUT != null,
    'getUserTimeout called on unsupported platform'
  )
  Assert(
    _isSocket(socket),
    'getUserTimeout expects an instance of socket as its first argument'
  )

  const fd = _getSocketFD(socket),
    dataType = DataType.I32,
    [msecVal] = createPointer({
      paramsType: [dataType],
      paramsValue: [0],
    }),
    [msecValLn] = createPointer({
      paramsType: [DataType.I32],
      paramsValue: [4], // sizeof int
    })

  FFIBindings.getsockopt(
    fd,
    Constants.SOL_TCP,
    Constants.TCP_USER_TIMEOUT,
    msecVal,
    msecValLn
  )

  const [value] = restorePointer({
    retType: [dataType],
    paramsValue: [msecVal],
  })

  return value
}
