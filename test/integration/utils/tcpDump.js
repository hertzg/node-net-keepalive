const ChildProcess = require('child_process')
const { collectChunks } = require('../../helpers')

const calculateTimeout = (initialDelay, interval, probes) =>
  Math.floor((interval * probes + initialDelay) * 1.5)

const waitForKeepAlivePackets = (iface, packets, ports, timeout, done) => {
  const args = [
    '-pl',
    '-c',
    packets,
    '-i',
    iface,
    `(${ports
      .map((port) => `port ${port}`)
      .join(
        ' or '
      )}) and ( tcp[tcpflags] & tcp-ack != 0 and ( (ip[2:2] - ((ip[0]&0xf)<<2) ) - ((tcp[12]&0xf0)>>2) ) == 0 ) `,
  ]
  console.log(`waiting ${timeout / 1000}s for: \$ tcpdump ${args.join(' ')}`)

  const p = ChildProcess.spawn('tcpdump', args, {
    timeout,
    stdio: ['ignore', 'inherit', 'pipe'],
  })
  p.stderr.pipe(process.stderr)
  const stderr = collectChunks(p.stderr)

  let finished = false
  const finish = (...args) => {
    if (finished) return
    done(...args)
  }

  p.once('error', (err) => {
    finish(err)
    p.kill()
  })
  p.once('exit', (code, signal) => {
    finish(null, {
      stderr: Buffer.concat(stderr),
      status: code,
      signal,
    })
  })
}

module.exports = {
  calculateTimeout,
  waitForKeepAlivePackets,
}
