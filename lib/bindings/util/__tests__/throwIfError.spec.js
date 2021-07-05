jest.unmock("../throwIfError");

describe("throwIfError", () => {
  it("should throw the first argument when it is truthy", () => {
    const throwIfError = require("../throwIfError");

    const fakeError = new Error("some random error");
    expect(() => throwIfError(fakeError)).toThrow(fakeError);
    expect(() => throwIfError("string")).toThrow("string");
    expect(() => throwIfError("")).not.toThrow();
    expect(() => throwIfError(null)).not.toThrow();
    expect(() => throwIfError()).not.toThrow();
  });
});
