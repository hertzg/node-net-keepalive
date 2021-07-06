const withConnection = require('../withConnection')
const Util = require('util')
const Net = require('net')

jest.unmock('net')
jest.unmock('events')
jest.unmock('../withConnection')

describe('withConnection', () => {
  it('should call the test function with connections and arguments', async () => {
    const fakeTest = jest.fn()
    const wrapper = withConnection(fakeTest)

    const args = [1, 'a', true, { obj: true }]

    await expect(wrapper(...args)).resolves.not.toThrow()
    expect(fakeTest).toBeCalledTimes(1)
    expect(fakeTest).toBeCalledWith(
      expect.objectContaining({
        server: expect.any(Net.Server),
        client: expect.any(Net.Socket),
      }),
      ...args
    )
  })

  it('should setup connections only when called and teardown when done', async () => {
    let serverWasListening, clientWasDestroyed

    let _server, _client
    const testFn = jest.fn(({ server, client }) => {
      _server = server
      _client = client
      serverWasListening = server.listening
      clientWasDestroyed = client.destroyed
    })

    const wrapper = withConnection(testFn)
    expect(testFn).not.toBeCalled()
    expect(typeof wrapper).toBe('function')

    const promise = wrapper()
    expect(Util.types.isPromise(promise)).toBeTruthy()
    await expect(promise).resolves.not.toThrow()

    expect(serverWasListening).toBe(true)
    expect(clientWasDestroyed).toBe(false)
    expect(_server.listening).toBe(false)
    expect(_client.destroyed).toBe(true)
  })

  it('should still teardown if test throws synchronously', async () => {
    let _server, _client
    await expect(
      withConnection(({ server, client }) => {
        _server = server
        _client = client
        expect(false).toBe(true)
      })()
    ).rejects.toThrow()
    expect(_server.listening).toBe(false)
    expect(_client.destroyed).toBe(true)
  })

  it('should still teardown if test rejects', async () => {
    let _server, _client
    await expect(
      withConnection(async ({ server, client }) => {
        _server = server
        _client = client
        expect(false).toBe(true)
      })()
    ).rejects.toThrow()
    expect(_server.listening).toBe(false)
    expect(_client.destroyed).toBe(true)
  })
})
