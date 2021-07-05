module.exports = (factory) => {
  let instance, initialized
  return (...args) => {
    if (!initialized) {
      instance = factory(...args)
      initialized = true
    }
    return instance
  }
}
