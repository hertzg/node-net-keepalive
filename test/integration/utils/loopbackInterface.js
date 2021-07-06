const { networkInterfaces } = require('os')
module.exports = () => {
  return Object.entries(networkInterfaces()).find(([, iface]) =>
    iface.some((addr) => addr.internal)
  )
}
