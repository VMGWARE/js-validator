const Validator = require("../src/validator");

describe("Validator", () => {
  it("should validate simple string rules", () => {
    const rules = { name: { type: "string", required: true } };
    const messages = {
      name: {
        type: "Name must be a string",
        required: "Name is required",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ name: "John Doe" })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  // Add more tests for different rules and scenarios
});
