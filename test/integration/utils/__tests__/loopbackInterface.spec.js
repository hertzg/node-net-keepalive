const loopbackInterface = require('../loopbackInterface')

jest.unmock('../loopbackInterface')

it('should be able to find internal loopback device', () => {
  const [name] = loopbackInterface()
  expect(name).toBeTruthy()
})
