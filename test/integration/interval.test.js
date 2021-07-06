jest.disableAutomock()
jest.unmock('ref-napi')
jest.unmock('ffi-napi')

const withKeepAliveSocket = require('./utils/withKeepAliveSocket')
const { skipSuiteOnWindows } = require('../helpers')
const nextInRangeExcept = require('./utils/nextInRangeExcept')

const normalizeInterval = (interval) => ~~(interval / 1000)

skipSuiteOnWindows()
describe('TCP_KEEPINTVL', () => {
  it(
    'should set interval different from system default',
    withKeepAliveSocket(({ socket }, done) => {
      const Lib = require('../../lib')
      const sysDefaultInterval = Lib.getKeepAliveInterval(socket)

      const interval =
        nextInRangeExcept(1, 3, 1, normalizeInterval(sysDefaultInterval)) * 1000
      expect(interval).not.toBe(sysDefaultInterval)

      Lib.setKeepAliveInterval(socket, interval)
      const actualInterval = Lib.getKeepAliveInterval(socket)
      expect(actualInterval).toBe(interval)
      expect(actualInterval).not.toBe(sysDefaultInterval)

      done()
    })
  )
})
