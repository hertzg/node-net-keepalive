const { skipSuiteOnWindows } = require('../helpers')
const withKeepAliveSocket = require('./utils/withKeepAliveSocket')
const nextInRangeExcept = require('./utils/nextInRangeExcept')

jest.unmock('../helpers')
jest.unmock('./utils/withKeepAliveSocket')
jest.unmock('./utils/nextInRangeExcept')
jest.deepUnmock('../../lib')

describe('TCP_KEEPCNT', () => {
  skipSuiteOnWindows()

  it(
    'should set probes different from system default',
    withKeepAliveSocket(({ socket }, done) => {
      const Lib = require('../../lib')
      const sysDefaultProbes = Lib.getKeepAliveProbes(socket)
      const probes = nextInRangeExcept(3, 5, 1, sysDefaultProbes)

      Lib.setKeepAliveProbes(socket, probes)
      const actualProbes = Lib.getKeepAliveProbes(socket)
      expect(actualProbes).toBe(probes)
      expect(actualProbes).not.toBe(sysDefaultProbes)

      done()
    })
  )
})
