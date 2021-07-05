module.exports = /* abstract */ class BasePlatform {
  setKeepAliveInterval(socket, msecs) {}

  getKeepAliveInterval(socket) {}

  setKeepAliveProbes(socket, count) {}

  getKeepAliveProbes(socket) {}

  setUserTimeout(socket, msecs) {}

  getUserTimeout(socket) {}
}
