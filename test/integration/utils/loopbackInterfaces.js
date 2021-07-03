const { networkInterfaces } = require('os')
const loopbackInterfaces = () => {
  return Object.entries(networkInterfaces()).find(([, iface]) =>
    iface.some((addr) => addr.internal)
  )
}

module.exports = {
  loopbackInterfaces,
}
