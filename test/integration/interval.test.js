const withKeepAliveSocket = require('./utils/withKeepAliveSocket')
const { skipSuiteOnWindows } = require('../helpers')
const nextInRangeExcept = require('./utils/nextInRangeExcept')

jest.unmock('../helpers')
jest.unmock('./utils/withKeepAliveSocket')
jest.unmock('./utils/nextInRangeExcept')
jest.deepUnmock('../../lib')

const normalizeInterval = (interval) => ~~(interval / 1000)

describe('TCP_KEEPINTVL', () => {
  skipSuiteOnWindows()

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
