'use strict'

const OS = require('os')

const Constants = {
  SOL_TCP: 6,
  TCP_KEEPINTVL: undefined,
  TCP_KEEPCNT: undefined,
  TCP_USER_TIMEOUT: undefined,
}

switch (OS.platform()) {
  case 'darwin':
    Constants.TCP_KEEPINTVL = 0x101
    Constants.TCP_KEEPCNT = 0x102

    // Alias for TCP_RXT_CONNDROPTIME
    // Source https://github.com/apple/darwin-xnu/blob/a1babec6b135d1f35b2590a1990af3c5c5393479/bsd/netinet/tcp.h#L221
    Constants.TCP_USER_TIMEOUT = 0x80
    break

  case 'freebsd':
    Constants.TCP_KEEPINTVL = 512
    Constants.TCP_KEEPCNT = 1024
    break

  case 'linux':
  default:
    Constants.TCP_KEEPINTVL = 5
    Constants.TCP_KEEPCNT = 6
    Constants.TCP_USER_TIMEOUT = 18
    break
}

module.exports = Constants
