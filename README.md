# JS Validator

A versatile and easy-to-use JavaScript validation library, JS Validator ensures the integrity of your data inputs with a range of customization options. Ideal for projects that require detailed, flexible validation rules, from simple forms to complex data structures.

## Features

- Supports a wide range of data types (string, number, boolean).
- Customizable validation rules (required, min/max length, regex matching, etc.).
- Asynchronous and custom validation functions.
- Easy error message customization.
- Options for strict mode validation.
- Methods for retrieving passed fields and current errors.
- Fully documented and TypeScript friendly.

## Installation

```bash
npm install @vmgware/js-validator
```

## Usage

Below is a quick example of how to use the JS Validator:

```javascript
const Validator = require('@vmgware/js-validator');

const rules = {
  email: { type: 'string', required: true, validate: 'email' },
  age: { type: 'number', min: 18 },
};

const messages = {
  email: { required: 'Email is required', validate: 'Invalid email' },
  age: { min: 'Age must be at least 18' },
};

const validator = new Validator(rules, messages);

const data = { email: 'example@email.com', age: 20 };

validator.validate(data).then(isValid => {
  if (isValid) {
    console.log('Validation successful');
  } else {
    console.log('Validation failed', validator.getErrors());
  }
});
```

## API Reference

### `Validator(rules, messages, [options])`

- `rules`: Object containing validation rules.
- `messages`: Corresponding error messages for each rule.
- `options`: Optional settings like strict mode.

### Methods

- `validate(input)`: Validates the input against the rules.
- `getErrors()`: Returns validation errors.
- `getPassedFields()`: Returns fields that passed validation.
- `reset()`: Resets the validation state.

## License

This project is licensed under the [MIT License](LICENSE).