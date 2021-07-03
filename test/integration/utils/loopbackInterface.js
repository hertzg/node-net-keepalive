const { networkInterfaces } = require('os')
const loopbackInterface = () => {
  return Object.entries(networkInterfaces()).find(([, iface]) =>
    iface.some((addr) => addr.internal)
  )
}

module.exports = {
  loopbackInterface,
}
