# JS Validator: Comprehensive Guide

[![Quality Gate Status](https://sonar.vmgware.dev/api/project_badges/measure?project=VMGWARE_js-validator_AYzNAnwTPR--spDn0sJy&metric=alert_status&token=sqb_14de9039b8c9f81b8e94e43da4a0d4f64dac90c6)](https://sonar.vmgware.dev/dashboard?id=VMGWARE_js-validator_AYzNAnwTPR--spDn0sJy)

JS Validator is a comprehensive JavaScript validation library designed to ensure the accuracy and integrity of data inputs in various applications. It offers a flexible and powerful approach to data validation, making it suitable for everything from simple form validations to complex business logic.

## Key Features

- **Versatile Data Type Support**: Validates strings, numbers, booleans, integers, floats, and dates.
- **Extensive Validation Rules**: Includes rules for minimum/maximum values, regex patterns, custom functions, and more.
- **Asynchronous Validation**: Supports async functions, ideal for validations that require database checks or API calls.
- **Customizable Error Messages**: Define specific messages for different validation failures.
- **Strict Mode Option**: Enforces validation against all input fields, flagging any that aren't explicitly defined in the rules.
- **Error and Success Tracking**: Methods to retrieve fields that failed or passed validation.
- **Documentation**: Comprehensive documentation for ease of use.
- **TypeScript Support**: Provides type safety for TypeScript applications.
  - Should be noted that it is still in development. So issues may arise.
- **Lightweight**: Small library size with no external dependencies.
- **Open Source**: MIT License allows for wide usage and modification.

## Installation

To start using JS Validator, install it via npm:

```bash
npm install @vmgware/js-validator
```

## Detailed Usage Examples

### JavaScript Example: Form Validation

Here's a basic example to validate a user registration form:

```javascript
const Validator = require("@vmgware/js-validator");

// Define validation rules
const rules = {
  username: { type: "string", required: true, min: 3 },
  email: { type: "string", required: true, validate: "email" },
  age: { type: "number", min: 18 },
};

// Custom error messages for each rule
const messages = {
  username: {
    type: "Username must be a string",
    required: "Username is required",
    min: "Username must be at least 3 characters",
  },
  email: {
    type: "Email must be a string",
    required: "Email is required",
    validate: "Invalid email format",
  },
  age: { type: "Age must be a number", min: "Age must be at least 18" },
};

// Initialize the validator
const validator = new Validator(rules, messages);

// Sample data to validate
const userData = { username: "johndoe", email: "john@example.com", age: 20 };

// Perform validation
validator.validate(userData).then((isValid) => {
  if (isValid) {
    console.log("Registration valid");
  } else {
    console.log("Validation errors:", validator.getErrors());
  }
});
```

### TypeScript Example: Validating a User Profile

In this example, we'll validate a user profile form using TypeScript. TypeScript allows us to define interfaces for our data, making the code more robust and easier to understand.

First, define an interface for the user data:

```typescript
interface UserProfile {
  username: string;
  email: string;
  birthdate: Date;
}
```

Now, let's use JS Validator to validate this data:

```typescript
import Validator from "@vmgware/js-validator";

// Define validation rules according to the UserProfile interface
const rules = {
  username: { type: "string", required: true, min: 3 },
  email: { type: "string", required: true, validate: "email" },
  birthdate: { type: "date", required: true },
};

// Custom error messages
const messages = {
  username: {
    type: "Username must be a string",
    required: "Username is required",
    min: "Username must be at least 3 characters",
  },
  email: {
    type: "Email must be a string",
    required: "Email is required",
    validate: "Invalid email format",
  },
  birthdate: {
    type: "Birthdate must be a date",
    required: "Birthdate is required",
  },
};

// Initialize the validator
const validator = new Validator<UserProfile>(rules, messages);

// Sample user data to validate
const userProfile: UserProfile = {
  username: "janedoe",
  email: "jane@example.com",
  birthdate: new Date("1990-01-01"),
};

// Perform validation
validator.validate(userProfile).then((isValid) => {
  if (isValid) {
    console.log("User profile is valid");
  } else {
    console.log("Validation errors:", validator.getErrors());
  }
});
```

In this TypeScript example:

- We define an interface `UserProfile` to enforce the structure of user data.
- The validation rules and messages are set up in a similar way as in JavaScript.
- The `Validator` is initialized with the type parameter `UserProfile` to ensure type safety.
- The `validate` method is used to check if the user data conforms to the specified rules.

### Why Use Custom Error Messages?

Custom error messages enhance the user experience by providing clear, context-specific feedback. This is crucial in form validations where users need to understand what went wrong and how to correct it.

### Asynchronous Validation: Checking Username Availability

Asynchronous validation is useful for scenarios that require external data checks, such as verifying if a username is already taken:

```javascript
// Asynchronous function to check username availability
async function isUsernameAvailable(username) {
  // Example: Call to a database or external API
  // Returns true if the username is available
}

// Adding async validation to rules
rules.username.custom = async (username) => {
  return await isUsernameAvailable(username);
};

messages.username.custom = "Username is already taken";

// Usage remains the same as before
```

### Strict Mode: Ensuring Comprehensive Validation

Strict mode is useful in API endpoints or data processing scripts where you need to validate incoming data against all defined rules and reject any additional, undefined fields. This helps prevent unexpected data from being processed or stored.

```javascript
// Enable strict mode in options
const options = { strictMode: true };

// Initialize the validator with options
const validator = new Validator(rules, messages, options);

// If the input contains fields not defined in the rules, those will be flagged as errors
```

## API Reference

### Constructor: `Validator(rules, messages, [options])`

- `rules`: Defines validation rules.
- `messages`: Corresponding error messages.
- `options`: Additional configuration like enabling strict mode.

### Methods

- `validate(input)`: Validates the input data.
- `getErrors()`: Retrieves current validation errors.
- `getPassedFields()`: Gets fields that passed validation.
- `reset()`: Resets the validator's state.
- `updateRules(rules)`: Updates the validation rules.
- `updateMessages(messages)`: Updates the error messages.
- `updateOptions(options)`: Updates the validator's options.

## Contributing

We welcome contributions to this library. Feel free to submit issues and pull requests to help improve the library.

For those writing commits, please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps us maintain a consistent commit history and generate changelogs automatically.

Also, when making changes, only push to the `develop` branch. The `main` branch is reserved for stable releases as semantic-release will automatically publish to npm from there. The `develop` branch is used for development and testing, PR's will be squashed and merged into `develop` and then when ready, `develop` will be merged into `main`.

## License

This library is open-sourced under the MIT License, allowing for wide usage and modification. See the [LICENSE](LICENSE) file for details. Feel free to submit issues and pull requests to help improve the library.

## Who should use this library?

This library is ideal for developers who want a simple, yet powerful validation library for their JavaScript or TypeScript applications. It's suitable for a wide range of use cases, from simple form validations to complex business logic.

Now that the random text is over, I would like to say that this library is for anyone who wants to use it. I made it for projects of VMG Ware as a central validation library. But I thought it would be nice to share it with the world. So here it is. I hope you enjoy it.
