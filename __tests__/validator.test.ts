// file deepcode ignore NoHardcodedPasswords/test: Not a real password

import Validator from "../src/index";

describe("Validator - Type", () => {
  it("should validate rule with no type", () => {
    const validator = new Validator(
      { name: { required: true } },
      {
        name: {
          required: "Name is required",
        },
      }
    );

    expect(validator.validate({ name: "John Doe" })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple string rules", () => {
    const validator = new Validator(
      { name: { type: "string", required: true } },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      }
    );

    expect(validator.validate({ name: "John Doe" })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple number rules", () => {
    const validator = new Validator(
      { age: { type: "number", required: true } },
      {
        age: {
          type: "Age must be a number",
          required: "Age is required",
        },
      }
    );

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple boolean rules", () => {
    const validator = new Validator(
      { isMarried: { type: "boolean", required: true } },
      {
        isMarried: {
          type: "isMarried must be a boolean",
          required: "isMarried is required",
        },
      }
    );

    expect(validator.validate({ isMarried: true })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple integer rules", () => {
    const validator = new Validator(
      { age: { type: "integer", required: true } },
      {
        age: {
          type: "Age must be an integer",
          required: "Age is required",
        },
      }
    );

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple float rules", () => {
    const validator = new Validator(
      { age: { type: "float", required: true } },
      {
        age: {
          type: "Age must be a float",
          required: "Age is required",
        },
      }
    );

    expect(validator.validate({ age: 20.5 })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  it("should validate simple date rules", () => {
    const validator = new Validator(
      { date: { type: "date", required: true } },
      {
        date: {
          type: "Date must be a date",
          required: "Date is required",
        },
      }
    );

    expect(validator.validate({ date: new Date() })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });

  // Add more tests for different rules and scenarios
});

describe("Validator - Required Validation", () => {
  it("should validate required fields", () => {
    const validator = new Validator(
      { name: { type: "string", required: true } },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      }
    );

    expect(validator.validate({ name: "John Doe" })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(false);
  });
});

describe("Validator - Min/Max Validation", () => {
  it("should validate number fields against a minimum value", () => {
    const validator = new Validator(
      {
        age: { type: "number", required: true, min: 18 },
      },
      {
        age: {
          type: "Age must be a number",
          required: "Age is required",
          min: "Age must be greater than or equal to 18",
          max: "Age must be less than or equal to 60",
        },
      }
    );

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({ age: 17 })).resolves.toBe(false);
  });

  it("should validate number fields against a maximum value", () => {
    const validator = new Validator(
      {
        age: { type: "number", required: true, max: 60 },
      },
      {
        age: {
          type: "Age must be a number",
          required: "Age is required",
          min: "Age must be greater than or equal to 18",
          max: "Age must be less than or equal to 60",
        },
      }
    );

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({ age: 61 })).resolves.toBe(false);
  });

  it("should validate string fields against a minimum length", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true, min: 3 },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
          min: "Name must be at least 3 characters",
          max: "Name must be at most 60 characters",
        },
      }
    );

    expect(validator.validate({ name: "John Doe" })).resolves.toBe(true);
    expect(validator.validate({ name: "Jo" })).resolves.toBe(false);
  });

  it("should validate string fields against a maximum length", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true, max: 60 },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
          min: "Name must be at least 3 characters",
          max: "Name must be at most 60 characters",
        },
      }
    );

    expect(validator.validate({ name: "John Doe" })).resolves.toBe(true);
    expect(
      validator.validate({
        name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec",
      })
    ).resolves.toBe(false);
  });
});

describe("Validator - match Validation", () => {
  it("should validate fields against a matching field", () => {
    const validator = new Validator(
      {
        password: { type: "string", required: true },
        confirmPassword: { type: "string", required: true, match: "password" },
      },
      {
        password: {
          type: "Password must be a string",
          required: "Password is required",
        },
        confirmPassword: {
          type: "Confirm Password must be a string",
          required: "Confirm Password is required",
          match: "Confirm Password must match Password",
        },
      }
    );

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
    const validator = new Validator(
      {
        email: { type: "string", required: true, validate: "email" },
      },
      {
        email: {
          type: "Email must be a string",
          required: "Email is required",
          validate: "Email must be a valid email",
        },
      }
    );

    expect(validator.validate({ email: "john@doe.com" })).resolves.toBe(true);
    expect(validator.validate({ email: "john@doe" })).resolves.toBe(false);
    expect(validator.validate({ email: "john" })).resolves.toBe(false);
    expect(validator.validate({ email: "john@doe." })).resolves.toBe(false);
  });
});

describe("Validator - Custom Validation", () => {
  it("should validate fields against a custom function", () => {
    const validator = new Validator(
      {
        age: {
          type: "number",
          required: true,
          custom: (value: any) => {
            return value >= 18 && value <= 60;
          },
        },
      },
      {
        age: {
          type: "Age must be a number",
          required: "Age is required",
          custom: "Age must be between 18 and 60",
        },
      }
    );

    expect(validator.validate({ age: 20 })).resolves.toBe(true);
    expect(validator.validate({ age: 17 })).resolves.toBe(false);
    expect(validator.validate({ age: 61 })).resolves.toBe(false);
  });
});

describe("Validator - Regex Validation", () => {
  it("should validate fields against a regular expression", () => {
    const validator = new Validator(
      {
        username: { type: "string", regex: /^[a-zA-Z0-9]+$/ },
      },
      {
        username: {
          type: "Username must be a string",
          regex: "Username must be alphanumeric",
        },
      }
    );

    expect(validator.validate({ username: "JohnDoe123" })).resolves.toBe(true);
    expect(validator.validate({ username: "John Doe!" })).resolves.toBe(false);
  });
});

describe("Validator - Skip Validation", () => {
  it("should skip validation for fields if skip is true", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true, skip: () => true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      }
    );

    expect(validator.validate({ name: "John Doe" })).resolves.toBe(true);
    expect(validator.validate({})).resolves.toBe(true);
  });
});

describe("Validator - Options", () => {
  it("Should track the passed fields", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true },
        age: { type: "number", required: true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
        age: {
          type: "Age must be a number",
          required: "Age is required",
        },
      },
      { trackPassedFields: true }
    );
    validator.validate({ name: "John Doe", age: 20 });

    // Contains { name: "John Doe", age: 20}
    expect(validator.getPassedFields()).toEqual({ name: "John Doe", age: 20 });
  });

  it("Should give error for fields not in rules", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      },
      { trackPassedFields: true, strictMode: true }
    );
    validator.validate({ name: "John Doe", age: 20 });

    // Contains { name: "John Doe", age: 20}
    expect(validator.getErrors()).toEqual({
      age: '"age" is not a recognized field and cannot be processed.',
    });
  });
});

describe("Validator - Functions", () => {
  it("Should get errors", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      }
    );
    validator.validate({});

    expect(validator.getErrors()).toEqual({
      name: "Name is required",
    });
  });

  it("Should get passed fields", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      },
      {
        trackPassedFields: true,
      }
    );
    validator.validate({ name: "John Doe" });

    expect(validator.getPassedFields()).toEqual({
      name: "John Doe",
    });
  });

  it("Should reset the validator", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      },
      {
        trackPassedFields: true,
      }
    );
    validator.validate({ name: "John Doe" });
    validator.reset();

    expect(validator.getPassedFields()).toEqual({});
    expect(validator.getErrors()).toEqual({});
  });

  it("Should update the rules", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      }
    );
    validator.updateRules({ name: { type: "string", required: false } });
    validator.validate({});

    expect(validator.getErrors()).toEqual({});
  });

  it("Should update the messages", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      }
    );
    validator.updateMessages({
      name: {
        type: "Name must be a string",
        required: "Name is not required",
      },
    });
    validator.validate({});

    expect(validator.getErrors()).toEqual({
      name: "Name is not required",
    });
  });

  it("Should update the options", () => {
    const validator = new Validator(
      {
        name: { type: "string", required: true },
      },
      {
        name: {
          type: "Name must be a string",
          required: "Name is required",
        },
      },
      {
        trackPassedFields: true,
      }
    );
    validator.updateOptions({ trackPassedFields: false });
    validator.validate({ name: "John Doe" });

    expect(validator.getPassedFields()).toEqual({});
  });
});

describe("Validator - Specific Types", () => {
  it("should throw when given a number instead of a string", () => {
    const validator = new Validator(
      { name: { type: "string" } },
      { name: { type: "Expected a string" } }
    );
    expect(validator.validate({ name: 1234 })).resolves.toBe(false);
    expect(validator.getErrors().name).toBe("Expected a string");
  });

  it("should throw when given a string instead of a number", () => {
    const validator = new Validator(
      { age: { type: "number" } },
      { age: { type: "Expected a number" } }
    );
    expect(validator.validate({ age: "twenty" })).resolves.toBe(false);
    expect(validator.getErrors().age).toBe("Expected a number");
  });

  it("should throw when given a number instead of a boolean", () => {
    const validator = new Validator(
      { active: { type: "boolean" } },
      { active: { type: "Expected a boolean" } }
    );
    expect(validator.validate({ active: 1 })).resolves.toBe(false);
    expect(validator.getErrors().active).toBe("Expected a boolean");
  });

  it("should throw when given a float instead of an integer", () => {
    const validator = new Validator(
      { count: { type: "integer" } },
      { count: { type: "Expected an integer" } }
    );
    expect(validator.validate({ count: 1.5 })).resolves.toBe(false);
    expect(validator.getErrors().count).toBe("Expected an integer");
  });

  it("should throw when given an integer instead of a float", () => {
    const validator = new Validator(
      { score: { type: "float" } },
      { score: { type: "Expected a float" } }
    );
    expect(validator.validate({ score: 10 })).resolves.toBe(false);
    expect(validator.getErrors().score).toBe("Expected a float");
  });

  it("should throw when given a string instead of a date", () => {
    const validator = new Validator(
      { date: { type: "date" } },
      { date: { type: "Expected a date" } }
    );
    expect(validator.validate({ date: "not a date" })).resolves.toBe(false);
    expect(validator.getErrors().date).toBe("Expected a date");
  });
});
