# JS Validator: Comprehensive Guide

[![Quality Gate Status](https://sonar.vmgware.dev/api/project_badges/measure?project=VMGWARE_js-validator_AYzNAnwTPR--spDn0sJy&metric=alert_status&token=sqb_14de9039b8c9f81b8e94e43da4a0d4f64dac90c6)](https://sonar.vmgware.dev/dashboard?id=VMGWARE_js-validator_AYzNAnwTPR--spDn0sJy)

JS Validator is a robust JavaScript library designed for validating data inputs across applications. It offers a versatile and effective approach to ensuring data integrity, making it suitable for various scenarios, from form validation to complex rule-based data checks.

## Key Features

- **Support for Various Data Types**: Validates strings, numbers, booleans, integers, floats, and dates, catering to a wide range of data validation needs.
- **Comprehensive Validation Rules**: Equipped with a rich set of rules for checking minimum/maximum values or lengths, matching patterns through regex, and more, ensuring thorough data validation.
- **Asynchronous Validation Capabilities**: Facilitates async validations, perfect for use cases requiring database queries or API calls for validation.
- **Customizable Error Messaging**: Allows for the definition of custom error messages for different validation scenarios, enhancing clarity and user experience.
- **Strict Mode for Rigorous Validation**: Offers an option to enable strict mode, ensuring that only fields defined in the validation rules are accepted, enhancing security and data integrity.
- **Tracking of Validation Outcomes**: Provides methods to easily retrieve fields that either passed or failed the validation, aiding in response handling and user feedback.
- **Comprehensive Documentation**: Includes detailed documentation for easy integration and use.
- **TypeScript Compatibility**: Offers type definitions for seamless integration in TypeScript projects, enhancing code quality and maintainability.
- **Minimalistic Design**: Lightweight with no dependencies, ensuring quick load times and efficient performance.
- **Open Source and Community-Driven**: Licensed under MIT, encouraging community contributions and widespread use.

## Installation

You can easily integrate JS Validator into your project by installing it through npm:

```bash
npm install @vmgware/js-validator
```

## Usage Examples

### Validating a User Registration Form in JavaScript

This example demonstrates how to validate a simple user registration form:

```javascript
const Validator = require("@vmgware/js-validator");

// Define validation rules for user data
const rules = {
  username: { type: "string", required: true, min: 3 },
  email: { type: "string", required: true, validate: "email" },
  age: { type: "number", min: 18 },
};

// Define custom error messages for validation failures
const messages = {
  username: {
    required: "Username is required",
    min: "Username must be at least 3 characters long",
  },
  email: {
    required: "Email is required",
    validate: "Please enter a valid email address",
  },
  age: {
    min: "You must be at least 18 years old",
  },
};

// Initialize the validator with the defined rules and messages
const validator = new Validator(rules, messages);

// Sample user data to be validated
const userData = {
  username: "johndoe",
  email: "john.doe@example.com",
  age: 25,
};

// Validate the user data
validator.validate(userData).then(isValid => {
  if (isValid) {
    console.log("User data is valid");
  } else {
    console.error("Validation errors:", validator.getErrors());
  }
});
```

### TypeScript Example: Validating a User Profile

In this TypeScript example, we validate a user profile form, leveraging TypeScript's type safety:

```typescript
import Validator from "@vmgware/js-validator";

interface UserProfile {
  username: string;
  email: string;
  birthdate: Date;
}

// Validation rules according to the UserProfile interface
const rules = {
  username: { type: "string", required: true, min: 3 },
  email: { type: "string", required: true, validate: "email" },
  birthdate: { type: "date", required: true },
};

// Custom error messages for validation failures
const messages = {
  username: {
    required: "Username is required",
    min: "Username must be at least 3 characters long",
  },
  email: {
    required: "Email is required",
    validate: "Please enter a valid email address",
  },
  birthdate: {
    required: "Birthdate is required",
  },
};

// Initialize the validator with rules and messages tailored for UserProfile
const validator = new Validator<UserProfile>(rules, messages);

// Sample user profile data to be validated
const userProfile: UserProfile = {
  username: "janedoe",
  email: "jane.doe@example.com",
  birthdate: new Date("1990-04-15"),
};

// Validate the user profile
validator.validate(userProfile).then(isValid => {
  if (isValid) {
    console.log("User profile is valid");
  } else {
    console.error("Validation errors:", validator.getErrors());
  }
});
```

## Why Custom Error Messages?

Custom error messages provide clear, user-friendly feedback, helping users correct their inputs effectively.

## Asynchronous Validation Example

Asynchronous validation is particularly useful for checks that require external data, such as verifying if a username is available:

```javascript
// Asynchronous function to check if a username is available
async function isUsernameAvailable(username) {
  // Simulate an API call to check username availability
  // Returns true if available
}

// Add asynchronous custom validation to the username field
rules.username.custom = async username => await isUsernameAvailable(username);

// Define a custom error message for the username availability check
messages.username.custom = "This username is already taken";

// Validation process remains the same as shown in previous examples
```

## Using Strict Mode for Enhanced Validation

Strict mode ensures that the input strictly adheres to the defined rules, rejecting any extraneous fields:

```javascript
// Enable strict mode in the validator options
const options = { strictMode: true };

// Initialize the validator with rules, messages, and options
const validator = new Validator(rules, messages, options);

// With strict mode, any fields not defined in the rules will result in a validation error
```

## Contributing

Contributions are welcome! Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard for commit messages.

## License

JS Validator is open-sourced under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Who Should Use JS Validator?

JS Validator is designed for developers seeking a straightforward yet versatile validation library for their JavaScript or TypeScript projects. Whether you're validating simple forms or complex data structures, JS Validator provides the tools you need to ensure data integrity with minimal effort.
