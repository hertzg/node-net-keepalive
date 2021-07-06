const Net = require('net')
const Events = require('events')

const setupConnection = async (serverPort) => {
  let closed = false
  const server = Net.createServer()
  server.listen(serverPort)

  await Events.once(server, 'listening')

  const { port } = server.address()
  const client = new Net.createConnection({ port })
  await Events.once(client, 'connect')

  const teardown = async () => {
    if (closed) {
      return
    }
    closed = true

    client.end()
    server.close()

    return Promise.all([
      await Events.once(server, 'close'),
      await Events.once(client, 'close'),
    ])
  }

  return { server, client, teardown }
}

module.exports = (maybeAsyncTestFn, { serverPort = 0 } = {}) => {
  const testFn = async (...args) => maybeAsyncTestFn(...args)

  return async (...args) => {
    const context = await setupConnection(serverPort)
    const { teardown, ...connections } = context

    try {
      await testFn({ ...connections }, ...args)
    } catch (e) {
      throw e
    } finally {
      await teardown()
    }
  }
}
