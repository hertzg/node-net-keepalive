var OS = require('os')

var Constants = module.exports = {
  SOL_TCP: 6
}

var platform = OS.platform();

if(platform === 'darwin') {
  Constants.TCP_KEEPINTVL   = 0x101
  Constants.TCP_KEEPCNT     = 0x102
} else if(platform === 'freebsd') {
  Constants.TCP_KEEPINTVL   = 512
  Constants.TCP_KEEPCNT     = 1024
} else {
  Constants.TCP_KEEPINTVL   = 5
  Constants.TCP_KEEPCNT     = 6
}
