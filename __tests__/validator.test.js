const Validator = require("../src/validator");

describe("Validator - Type", () => {
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

  it("should validate simple number rules", () => {
    const rules = { age: { type: "number", required: true } };
    const messages = {
      age: {
        type: "Age must be a number",
        required: "Age is required",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple boolean rules", () => {
    const rules = { isMarried: { type: "boolean", required: true } };
    const messages = {
      isMarried: {
        type: "isMarried must be a boolean",
        required: "isMarried is required",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ isMarried: true })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple integer rules", () => {
    const rules = { age: { type: "integer", required: true } };
    const messages = {
      age: {
        type: "Age must be an integer",
        required: "Age is required",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple float rules", () => {
    const rules = { age: { type: "float", required: true } };
    const messages = {
      age: {
        type: "Age must be a float",
        required: "Age is required",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ age: 20.5 })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple date rules", () => {
    const rules = { date: { type: "date", required: true } };
    const messages = {
      date: {
        type: "Date must be a date",
        required: "Date is required",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ date: new Date() })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  // Add more tests for different rules and scenarios
});

describe("Validator - Required Validation", () => {
  it("should validate required fields", () => {
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
});

describe("Validator - Length Validation", () => {
  it("should validate length fields", () => {
    const rules = {
      name: { type: "string", required: true, minLength: 5, maxLength: 10 },
    };
    const messages = {
      name: {
        type: "Name must be a string",
        required: "Name is required",
        minLength: "Name must be at least 5 characters",
        maxLength: "Name must be at most 10 characters",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ name: "John Doe" })).resolves.toBe(true);
    expect(validator.validate({ name: "John" })).resolves.toBe(false);
  });
});

describe("Validator - Min/Max Validation", () => {
  it("should validate min/max fields", () => {
    const rules = {
      age: { type: "number", required: true, min: 18, max: 60 },
    };
    const messages = {
      age: {
        type: "Age must be a number",
        required: "Age is required",
        min: "Age must be greater than or equal to 18",
        max: "Age must be less than or equal to 60",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({ age: 17 })).resolves.toBe(false);
    expect(validator.validate({ age: 61 })).resolves.toBe(false);
  });
});

describe("Validator - match Validation", () => {
  it("should validate fields against a matching field", () => {
    const rules = {
      password: { type: "string", required: true },
      confirmPassword: { type: "string", required: true, match: "password" },
    };
    const messages = {
      password: {
        type: "Password must be a string",
        required: "Password is required",
      },
      confirmPassword: {
        type: "Confirm Password must be a string",
        required: "Confirm Password is required",
        match: "Confirm Password must match Password",
      },
    };
    const validator = new Validator(rules, messages);

    expect(
      validator.validate({ password: "123456", confirmPassword: "123456" })
    ).resolves.toBe(true);
    expect(
      validator.validate({ password: "123456", confirmPassword: "1234567" })
    ).resolves.toBe(false);
  });
});

describe("Validator - Email Validation", () => {
  it("should validate fields against an email", () => {
    const rules = {
      email: { type: "string", required: true, validate: "email" },
    };
    const messages = {
      email: {
        type: "Email must be a string",
        required: "Email is required",
        validate: "Email must be a valid email",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ email: "john@doe.com" })).resolves.toBe(true);
    expect(validator.validate({ email: "john@doe" })).resolves.toBe(false);
    expect(validator.validate({ email: "john" })).resolves.toBe(false);
    expect(validator.validate({ email: "john@doe." })).resolves.toBe(false);
  });
});

describe("Validator - Custom Validation", () => {
  it("should validate fields against a custom function", () => {
    const rules = {
      age: {
        type: "number",
        required: true,
        custom: (value) => {
          return value >= 18 && value <= 60;
        },
      },
    };
    const messages = {
      age: {
        type: "Age must be a number",
        required: "Age is required",
        custom: "Age must be between 18 and 60",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({ age: 17 })).resolves.toBe(false);
    expect(validator.validate({ age: 61 })).resolves.toBe(false);
  });
});

describe("Validator - Regex Validation", () => {
  it("should validate fields against a regular expression", () => {
    const rules = {
      username: { type: "string", regex: /^[a-zA-Z0-9]+$/ },
    };
    const messages = {
      username: {
        type: "Username must be a string",
        regex: "Username must be alphanumeric",
      },
    };
    const validator = new Validator(rules, messages);

    expect(validator.validate({ username: "JohnDoe123" })).resolves.toBe(true);
    expect(validator.validate({ username: "John Doe!" })).resolves.toBe(false);
  });
});

describe("Validator - Options", () => {
  it("Should track the passed fields", () => {
    const rules = {
      name: { type: "string", required: true },
      age: { type: "number", required: true },
    };
    const messages = {
      name: {
        type: "Name must be a string",
        required: "Name is required",
      },
      age: {
        type: "Age must be a number",
        required: "Age is required",
      },
    };
    const options = { trackPassedFields: true };

    const validator = new Validator(rules, messages, options);
    validator.validate({ name: "John Doe", age: 20 });

    // Contains { name: "John Doe", age: 20}
    expect(validator.passed).toEqual({ name: "John Doe", age: 20 });
  });

  it("Should give error for fields not in rules", () => {
    const rules = {
      name: { type: "string", required: true },
    };
    const messages = {
      name: {
        type: "Name must be a string",
        required: "Name is required",
      },
    };
    const options = { trackPassedFields: true, strictMode: true };

    const validator = new Validator(rules, messages, options);
    validator.validate({ name: "John Doe", age: 20 });

    // Contains { name: "John Doe", age: 20}
    expect(validator.errors).toEqual({ age: "Field is not allowed" });
  });
});
