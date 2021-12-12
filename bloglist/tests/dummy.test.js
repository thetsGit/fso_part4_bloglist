const dummy = require("../utils/helpers").dummy;

describe("dummy", () => {
  test("dummy returns one", () => {
    expect(dummy([])).toBe(1);
  });
});
