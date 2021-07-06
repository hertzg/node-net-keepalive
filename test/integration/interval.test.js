jest.disableAutomock()
jest.unmock('ref-napi')
jest.unmock('ffi-napi')

const withConnection = require('./utils/withConnection')
const { skipOnPlatforms } = require('../helpers')
const nextInRangeExcept = require('./utils/nextInRangeExcept')

const normalizeInterval = (interval) => ~~(interval / 1000)

skipOnPlatforms('win32')
describe('TCP_KEEPINTVL', () => {
  it(
    'should set interval different from system default',
    withConnection(({ client }) => {
      client.setKeepAlive(true, 1000)

      const Lib = require('../../lib')
      const sysDefaultInterval = Lib.getKeepAliveInterval(client)

      const interval =
        nextInRangeExcept(1, 3, 1, normalizeInterval(sysDefaultInterval)) * 1000
      expect(interval).not.toBe(sysDefaultInterval)

      Lib.setKeepAliveInterval(client, interval)
      const actualInterval = Lib.getKeepAliveInterval(client)
      expect(actualInterval).toBe(interval)
      expect(actualInterval).not.toBe(sysDefaultInterval)
    })
  )
})
