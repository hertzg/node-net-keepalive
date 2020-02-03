'use strict'

const OS = require('os')

const Constants = {
  SOL_TCP: 6,
  TCP_KEEPINTVL: undefined,
  TCP_KEEPCNT: undefined,
}

switch (OS.platform()) {
  case 'darwin':
    Constants.TCP_KEEPINTVL = 0x101
    Constants.TCP_KEEPCNT = 0x102
    break

  case 'freebsd':
    Constants.TCP_KEEPINTVL = 512
    Constants.TCP_KEEPCNT = 1024
    break

  case 'linux':
  default:
    Constants.TCP_KEEPINTVL = 5
    Constants.TCP_KEEPCNT = 6
    break
}

module.exports = Constants
