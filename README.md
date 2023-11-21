# JS Validator: Comprehensive Guide

JS Validator is a comprehensive JavaScript validation library designed to ensure the accuracy and integrity of data inputs in various applications. It offers a flexible and powerful approach to data validation, making it suitable for everything from simple form validations to complex business logic.

## Key Features

- **Versatile Data Type Support**: Validates strings, numbers, booleans, integers, floats, and dates.
- **Extensive Validation Rules**: Includes rules for minimum/maximum values, regex patterns, custom functions, and more.
- **Asynchronous Validation**: Supports async functions, ideal for validations that require database checks or API calls.
- **Customizable Error Messages**: Define specific messages for different validation failures.
- **Strict Mode Option**: Enforces validation against all input fields, flagging any that aren't explicitly defined in the rules.
- **Error and Success Tracking**: Methods to retrieve fields that failed or passed validation.
- **Documentation**: Comprehensive documentation for ease of use.

## Installation

To start using JS Validator, install it via npm:

```bash
npm install @vmgware/js-validator
```

## Detailed Usage Examples

### Basic Example: Form Validation

Here's a basic example to validate a user registration form:

```javascript
const Validator = require('@vmgware/js-validator');

// Define validation rules
const rules = {
  username: { type: 'string', required: true, min: 3 },
  email: { type: 'string', required: true, validate: 'email' },
  age: { type: 'number', min: 18 }
};

// Custom error messages for each rule
const messages = {
  username: { required: 'Username is required', min: 'Username must be at least 3 characters' },
  email: { required: 'Email is required', validate: 'Invalid email format' },
  age: { min: 'You must be at least 18 years old' }
};

// Initialize the validator
const validator = new Validator(rules, messages);

// Sample data to validate
const userData = { username: 'johndoe', email: 'john@example.com', age: 20 };

// Perform validation
validator.validate(userData).then(isValid => {
  if (isValid) {
    console.log('Registration valid');
  } else {
    console.log('Validation errors:', validator.getErrors());
  }
});
```

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

messages.username.custom = 'Username is already taken';

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

## License

This library is open-sourced under the MIT License, allowing for wide usage and modification.

By understanding and utilizing the features of JS Validator, developers can ensure robust and user-friendly data validation in their JavaScript applications.
