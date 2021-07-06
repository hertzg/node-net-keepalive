jest.disableAutomock()
jest.unmock('ref-napi')
jest.unmock('ffi-napi')

const { skipOnPlatforms } = require('../helpers')
const withConnection = require('./utils/withConnection')
const nextInRangeExcept = require('./utils/nextInRangeExcept')

skipOnPlatforms('win32', 'freebsd')
describe('TCP_USER_TIMEOUT', () => {
  it(
    'should set user-timeout different from system default',
    withConnection(({ client }) => {
      client.setKeepAlive(true, 1000)
      const Lib = require('../../lib')
      const sysDefaultTimeout = Lib.getUserTimeout(client)
      const userTimeout = nextInRangeExcept(1000, 5000, 100, sysDefaultTimeout)

      Lib.setUserTimeout(client, userTimeout)
      const actualTimeout = Lib.getUserTimeout(client)
      expect(actualTimeout).toBe(userTimeout)
      expect(actualTimeout).not.toBe(sysDefaultTimeout)
    })
  )
})
