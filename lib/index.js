/**
 * The Missing (TCP_KEEPINTVL and TCP_KEEPCNT) SO_KEEPALIVE socket option setters and getters for Node using
 * bindings-napi module.
 *
 * Note: For methods provided by this module to work you must enable SO_KEEPALIVE and set the TCP_KEEPIDLE bindings for
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
const { throwIfError } = require('./bindings')
const { usePlatform } = require('./bindings')

/**
 * Sets the TCP_KEEPINTVL value for specified socket.
 *
 * Note: The msec will be rounded towards the closest integer
 *
 * @since v0.1.0
 * @param {Socket} socket to set the value for
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
  const [err, value] = usePlatform().setKeepAliveInterval(socket, msecs)
  throwIfError(err)
  return value
}

/**
 * Returns the TCP_KEEPINTVL value for specified socket.
 *
 * @since v1.1.0
 * @param {Socket} socket to check the value for
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
  const [err, value] = usePlatform().getKeepAliveInterval(socket)
  throwIfError(err)
  return value
}

/**
 * Sets the TCP_KEEPCNT value for specified socket.
 *
 * @since v0.1.0
 * @param {Socket} socket to set the value for
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
  const [err, value] = usePlatform().setKeepAliveProbes(socket, cnt)
  throwIfError(err)
  return value
}

/**
 * Returns the TCP_KEEPCNT value for specified socket.
 *
 * @since v1.1.0
 * @param {Socket} socket to check the value for
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
  const [err, value] = usePlatform().getKeepAliveProbes(socket)
  throwIfError(err)
  return value
}

/**
 * Sets the TCP_USER_TIMEOUT (TCP_RXT_CONNDROPTIME on `darwin`) value for specified socket.
 *
 * Notes:
 * * This method is only supported on `linux` and `darwin`, will throw on `freebsd`.
 * * The msec will be rounded towards the closest integer.
 * * When used with the TCP keepalive bindings, will override them.
 *
 * @see {@link https://man7.org/linux/man-pages/man7/tcp.7.html|tcp(7):TCP_USER_TIMEOUT }
 *
 * @since v1.4.0
 * @param {Socket} socket to set the value for
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
  const err = usePlatform().setUserTimeout(socket, msecs)
  throwIfError(err)
  return true
}

/**
 * Returns the TCP_USER_TIMEOUT value for specified socket.
 *
 * Note: This method is only supported on `linux`, will throw on `darwin` and `freebsd`.
 *
 * @since v1.4.0
 * @param {Socket} socket to check the value for
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
  const [err, value] = usePlatform().getUserTimeout(socket)
  throwIfError(err)
  return value
}
