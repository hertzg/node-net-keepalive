var OS = require('os')

var Constants = module.exports = {
  SOL_TCP: 6
}

if(OS.platform() === 'darwin') {
  Constants.TCP_KEEPINTVL   = 0x101
  Constants.TCP_KEEPCNT     = 0x102
} else {
  Constants.TCP_KEEPINTVL   = 5
  Constants.TCP_KEEPCNT     = 6
}