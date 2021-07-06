jest.disableAutomock()
jest.unmock('ref-napi')
jest.unmock('ffi-napi')

const { skipSuiteOnWindows, skipSuiteOnFreeBsd } = require('../helpers')
const withKeepAliveSocket = require('./utils/withKeepAliveSocket')
const nextInRangeExcept = require('./utils/nextInRangeExcept')

skipSuiteOnWindows()
skipSuiteOnFreeBsd()
describe('TCP_USER_TIMEOUT', () => {
  it(
    'should set user-timeout different from system default',
    withKeepAliveSocket(({ socket }, done) => {
      const Lib = require('../../lib')
      const sysDefaultTimeout = Lib.getUserTimeout(socket)
      const userTimeout = nextInRangeExcept(1000, 5000, 100, sysDefaultTimeout)

      Lib.setUserTimeout(socket, userTimeout)
      const actualTimeout = Lib.getUserTimeout(socket)
      expect(actualTimeout).toBe(userTimeout)
      expect(actualTimeout).not.toBe(sysDefaultTimeout)

      done()
    })
  )
})
