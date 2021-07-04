const { useForeignFunctionInterface } = require('./util/ffi')

/* abstract */
class BasePlatform {}

/* abstract */
class FFIBasedPlatform extends BasePlatform {
  constructor() {
    super()

    const { setSocketOption, getSocketOption } = useForeignFunctionInterface()
    this.setSocketOption = setSocketOption
    this.getSocketOption = getSocketOption
  }
}

module.exports = {
  BasePlatform,
  FFIBasedPlatform,
}
