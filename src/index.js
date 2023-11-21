/**
 * @typedef {Object} Rule
 * @property {'string' | 'number' | 'boolean'} type - The data type of the field.
 * @property {boolean} [required] - Whether the field is required.
 * @property {number} [min] - Minimum value/length.
 * @property {number} [max] - Maximum value/length.
 * @property {string} [match] - Field must match the value of this field.
 * @property {string} [validate] - Special validation ('email', etc.).
 * @property {Function} [custom] - Custom validation function. Should return true if valid.
 */

/**
 * @typedef {Object} Message
 * @property {string} type - The error message for incorrect type.
 * @property {string} [required] - The error message for missing required field.
 * @property {string} [min] - The error message for value/length below minimum.
 * @property {string} [max] - The error message for value/length above maximum.
 * @property {string} [match] - The error message for non-matching fields.
 * @property {string} [validate] - The error message for invalid email.
 * @property {string} [custom] - The error message for custom validation failure.
 */

/**
 * @typedef {Object} Options
 * @property {boolean} [trackPassed] - Whether to track fields that passed validation.
 * @property {boolean} [strictMode] - Flag to enable strict mode. If true, fields not defined in rules will be flagged as errors.
 */

/**
 * A validation utility class for checking input against specified rules and outputting error messages.
 */
class Validator {
  /**
   * Creates an instance of the Validator class.
   * @param {{ [key: string]: Rule }} rules - The validation rules for each field.
   * @param {{ [key: string]: message }} messages - The error messages for each rule.
   * @param {Options} [options] - Additional options for validation.
   */
  constructor(rules, messages, options = {}) {
    this.#validateRulesFormat(rules);
    this.#validateMessagesFormat(messages);
    this.#validateOptionsFormat(options);

    this.rules = rules;
    this.messages = messages;
    this.options = options;
    this.errors = {};
    this.passed = {};
  }

  /**
   * Checks if the rules object follows the expected format.
   * @param {Object} rules - The rules object to validate.
   */
  #validateRulesFormat(rules) {
    for (const key in rules) {
      const rule = rules[key];
      if (typeof rule !== "object" || Array.isArray(rule)) {
        throw new Error(`The rule for '${key}' should be an object.`);
      }
      if (rule.type === undefined || typeof rule.type !== "string") {
        throw new Error(
          `The rule for '${key}' must include a 'type' property of type string.`
        );
      }
      if (rule.required !== undefined && typeof rule.required !== "boolean") {
        throw new Error(
          `The 'required' property for '${key}' must be of type boolean.`
        );
      }
      if (rule.min !== undefined && typeof rule.min !== "number") {
        throw new Error(
          `The 'min' property for '${key}' must be of type number.`
        );
      }
      if (rule.max !== undefined && typeof rule.max !== "number") {
        throw new Error(
          `The 'max' property for '${key}' must be of type number.`
        );
      }
      if (rule.match !== undefined && typeof rule.match !== "string") {
        throw new Error(
          `The 'match' property for '${key}' must be of type string.`
        );
      }
      if (rule.validate !== undefined && typeof rule.validate !== "string") {
        throw new Error(
          `The 'validate' property for '${key}' must be of type string.`
        );
      }
    }
  }

  /**
   * Checks if the options object follows the expected format.
   * @param {Object} options - The options object to validate.
   */
  #validateOptionsFormat(options) {
    if (typeof options !== "object" || Array.isArray(options)) {
      throw new Error("The options should be an object.");
    }
    if (
      options.trackPassed !== undefined &&
      typeof options.trackPassed !== "boolean"
    ) {
      throw new Error(
        `The 'trackPassed' property for options must be of type boolean.`
      );
    }
  }

  /**
   * Checks if the messages object follows the expected format.
   * @param {Object} messages - The messages object to validate.
   */
  #validateMessagesFormat(messages) {
    for (const key in messages) {
      const message = messages[key];
      if (typeof message !== "object" || Array.isArray(message)) {
        throw new Error(`The message for '${key}' should be an object.`);
      }
      if (message.type === undefined || typeof message.type !== "string") {
        throw new Error(
          `The message for '${key}' must include a 'type' property of type string.`
        );
      }
      if (
        message.required !== undefined &&
        typeof message.required !== "string"
      ) {
        throw new Error(
          `The 'required' property for '${key}' must be of type string.`
        );
      }
      if (message.min !== undefined && typeof message.min !== "string") {
        throw new Error(
          `The 'min' property for '${key}' must be of type string.`
        );
      }
      if (message.max !== undefined && typeof message.max !== "string") {
        throw new Error(
          `The 'max' property for '${key}' must be of type string.`
        );
      }
      if (message.match !== undefined && typeof message.match !== "string") {
        throw new Error(
          `The 'match' property for '${key}' must be of type string.`
        );
      }
      if (
        message.validate !== undefined &&
        typeof message.validate !== "string"
      ) {
        throw new Error(
          `The 'validate' property for '${key}' must be of type string.`
        );
      }
    }
  }

  /**
   * Validates an email address with a regular expression.
   * @param {string} email - The email address to validate.
   * @returns {boolean} - Returns true if the email is valid, otherwise false.
   */
  #validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Validates the provided input against the predefined rules and sets error messages accordingly.
   * @param {Object} input - The input object with keys and values to validate.
   * @returns {Promise<boolean>} - Returns true if no validation errors, false otherwise. Asynchronous to support async custom validations.
   */
  async validate(input) {
    this.errors = {};
    let isValid = true;

    // Iterate over the rules instead of input
    for (const key in this.rules) {
      const rule = this.rules[key];
      const value = input[key];

      // Check for required field
      if (rule.required && (value === "" || value === undefined)) {
        this.errors[key] = this.messages[key].required;
        isValid = false;
        continue; // Skip further checks if the field is missing
      }

      // If the value is not present, no need to check further rules
      if (value === undefined) continue;

      // Check for correct type
      if (typeof value !== rule.type) {
        this.errors[key] = this.messages[key].type;
        isValid = false;
      }

      // Check for minimum length
      if (rule.min !== undefined && value.length < rule.min) {
        this.errors[key] = this.messages[key].min;
        isValid = false;
      }

      // Check for maximum length
      if (rule.max !== undefined && value.length > rule.max) {
        this.errors[key] = this.messages[key].max;
        isValid = false;
      }

      // Check for valid email
      if (rule.validate === "email" && !this.#validateEmail(value)) {
        this.errors[key] = this.messages[key].validate;
        isValid = false;
      }

      // Check for matching fields
      if (rule.match && value !== input[rule.match]) {
        this.errors[key] = this.messages[key].match;
        isValid = false;
      }

      // Custom validation
      if (rule.custom && typeof rule.custom === "function") {
        const customValid = await Promise.resolve(rule.custom(value));
        if (!customValid) {
          this.errors[key] =
            this.messages[key].custom || "Custom validation failed";
          isValid = false;
        }
      }

      // Strict mode check
      if (this.options.strictMode && !(key in input)) {
        this.errors[key] = "Field is not allowed";
        isValid = false;
      }
    }

    // Iterate over the fields after validation checks
    for (const key in this.rules) {
      if (!this.errors[key] && this.options.trackPassed) {
        this.passed[key] = input[key];
      }
    }

    // If no errors were found, return true
    return isValid;
  }

  /**
   * Get the current validation errors.
   * @returns {Object} The current errors.
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Get the fields that passed validation.
   * @returns {Object} The fields that passed.
   */
  getPassedFields() {
    return this.passed;
  }

  /**
   * Reset the validator state.
   */
  reset() {
    this.errors = {};
    this.passed = {};
  }
}

module.exports = Validator;
