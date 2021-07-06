const BasePlatform = require('./basePlatform')
const { useForeignFunctionInterface } = require('./util/ffi')

module.exports = /* abstract */ class FFIBasedPlatform extends BasePlatform {
  constructor() {
    super()

    const { setSocketOption, getSocketOption } = useForeignFunctionInterface()
    this.setSocketOption = setSocketOption
    this.getSocketOption = getSocketOption
  }
}
