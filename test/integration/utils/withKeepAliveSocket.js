const { createConnection, createServer } = require('net')

const withKeepAliveSocket =
  (testFn, { initialDelay = 1000, serverPort = 0 } = {}) =>
  (done) => {
    const server = createServer()
    server.listen(serverPort, () => {
      const { port } = server.address()

      const testDone = (userError) => {
        socket.destroy()
        server.close((srvCloseError) => done(userError || srvCloseError))
      }

      const socket = createConnection(port, () => {
        socket.setKeepAlive(true, initialDelay)

        try {
          testFn({ server, socket }, testDone)
        } catch (e) {
          testDone(e)
        }
      })
    })
  }

module.exports = {
  withKeepAliveSocket,
}
