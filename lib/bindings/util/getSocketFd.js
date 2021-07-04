const assert = require('assert')

const getSocketFd = (socket) => {
  const fd = socket._handle != null ? socket._handle.fd : undefined
  assert(fd && fd !== -1, 'Unable to get socket fd')
  return fd
}

module.exports = {
  getSocketFd,
}
