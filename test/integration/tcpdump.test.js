jest.disableAutomock()
jest.unmock('ref-napi')
jest.unmock('ffi-napi')

const { skipOnPlatforms } = require('../helpers')
const withConnection = require('./utils/withConnection')
const { waitForKeepAlivePackets, calculateTimeout } = require('./utils/tcpDump')
const loopbackInterface = require('./utils/loopbackInterface')

const INITIAL_DELAY = 1000
const KEEPALIVE_PACKET_COUNT = 60
const MAX_TIMEOUT = calculateTimeout(INITIAL_DELAY, 1000, 30)

skipOnPlatforms('win32')
describe('tcp-dump', () => {
  const [LOOPBACK_IFACE_NAME] = loopbackInterface()
  if (!LOOPBACK_IFACE_NAME) {
    jest.only(
      '[SKIP] Unable to auto detect internal (loopback) interface, skipping all tests',
      () => {}
    )
  }

  it.each`
    interval | probes
    ${100}   | ${10}
    ${1000}  | ${10}
    ${2000}  | ${5}
    ${5000}  | ${2}
  `(
    'should send $probes probes every $interval millisecond',
    withConnection(
      ({ server, client }, interval, probes) => {
        client.setKeepAlive(true, INITIAL_DELAY)
        const Lib = require('../../lib')
        Lib.setKeepAliveInterval(client, interval)
        Lib.setKeepAliveProbes(client, probes)

        const ports = [server.address().port, client.address().port]

        waitForKeepAlivePackets(
          LOOPBACK_IFACE_NAME,
          KEEPALIVE_PACKET_COUNT,
          ports,
          calculateTimeout(INITIAL_DELAY, interval, probes),
          (error, { stderr, status }) => {
            expect(error).toBeFalsy()

            if (status !== 0) {
              console.error(`tcpdump stderr: ${stderr.toString('utf8')}`)
            }
            expect(status).toBe(0)
          }
        )
      },
      {
        initialDelay: INITIAL_DELAY,
      }
    ),
    MAX_TIMEOUT
  )
})
