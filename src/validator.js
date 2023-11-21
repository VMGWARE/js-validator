/**
 * @typedef {Object} Rule
 * @property {'string' | 'number' | 'boolean' | 'integer' | 'float' | 'date'} type - The data type of the field.
 * @property {boolean} [required] - Whether the field is required.
 * @property {number} [min] - Minimum value/length.
 * @property {number} [max] - Maximum value/length.
 * @property {string} [match] - Field must match the value of this field.
 * @property {string} [validate] - Special validation ('email', etc.).
 * @property {Function} [custom] - Custom validation function. Should return true if valid.
 * @property {RegExp} [regex] - Regular expression to validate the field.
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
 * @property {string} [regex] - The error message for regex validation failure.
 */

/**
 * @typedef {Object} Options
 * @property {boolean} [trackPassedFields] - Whether to track fields that passed validation.
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
  constructor(rules = {}, messages = {}, options = {}) {
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
      if (rule.custom !== undefined && typeof rule.custom !== "function") {
        throw new Error(
          `The 'custom' property for '${key}' must be of type function.`
        );
      }
      if (rule.regex !== undefined && !(rule.regex instanceof RegExp)) {
        throw new Error(
          `The 'regex' property for '${key}' must be of type RegExp.`
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
      options.trackPassedFields !== undefined &&
      typeof options.trackPassedFields !== "boolean"
    ) {
      throw new Error(
        `The 'trackPassedFields' property for options must be of type boolean.`
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
      if (message.custom !== undefined && typeof message.custom !== "string") {
        throw new Error(
          `The 'custom' property for '${key}' must be of type string.`
        );
      }
      if (message.regex !== undefined && typeof message.regex !== "string") {
        throw new Error(
          `The 'regex' property for '${key}' must be of type string.`
        );
      }
    }
  }

  /**
   * Validates an email address with a regular expression.
   * @param {string} email - The email address to validate.
   * @returns {boolean} Returns true if the email is valid, otherwise false.
   */
  #validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Validates a value with a regular expression.
   * @param {string} value - The value to validate.
   * @param {RegExp} regex - The regular expression to use.
   * @returns {boolean} Returns true if the regex is valid, otherwise false.
   */
  #validateRegex(value, regex) {
    return regex.test(value);
  }

  /**
   * Validates if a value is an integer.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is an integer, otherwise false.
   */
  #isInteger(value) {
    return Number.isInteger(value);
  }

  /**
   * Validates if a value is a float.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is a float, otherwise false.
   */
  #isFloat(value) {
    return typeof value === "number" && !Number.isInteger(value);
  }

  /**
   * Validates if a value is a valid date.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is a valid date, otherwise false.
   */
  #isDate(value) {
    return value instanceof Date && !Number.isNaN(value);
  }

  /**
   * Validates the provided input against the predefined rules and sets error messages accordingly.
   * @param {Object} input - The input object with keys and values to validate.
   * @returns {Promise<boolean>} Returns true if no validation errors, false otherwise. Asynchronous to support async custom validations.
   */
  async validate(input) {
    // Ensure input is an object
    if (typeof input !== "object" || Array.isArray(input)) {
      throw new Error("Input must be an object.");
    }

    this.errors = {};
    let isValid = true;

    // Iterate over the rules instead of input
    for (const key in this.rules) {
      const rule = this.rules[key];
      const value = input[key];

      // Skipping validation under certain conditions
      if (rule.skip && typeof rule.skip === "function" && rule.skip(input)) {
        continue; // Skip further validation if the condition is met
      }

      // Check for required field
      if (rule.required && (value === "" || value === undefined)) {
        this.errors[key] = this.messages[key].required || "Field is required";
        isValid = false;
        continue; // Skip further checks if the field is missing
      }

      // If the value is not present, no need to check further rules
      if (value === undefined) continue;

      // Type-specific validations
      if (rule.type === "string" && typeof value !== "string") {
        this.errors[key] = this.messages[key].type || "Invalid string";
        isValid = false;
      }

      if (rule.type === "number" && typeof value !== "number") {
        this.errors[key] = this.messages[key].type || "Invalid number";
        isValid = false;
      }

      if (rule.type === "boolean" && typeof value !== "boolean") {
        this.errors[key] = this.messages[key].type || "Invalid boolean";
        isValid = false;
      }

      if (rule.type === "integer" && !this.#isInteger(value)) {
        this.errors[key] = this.messages[key].type || "Invalid integer";
        isValid = false;
      }

      if (rule.type === "float" && !this.#isFloat(value)) {
        this.errors[key] = this.messages[key].type || "Invalid float";
        isValid = false;
      }

      if (rule.type === "date" && !this.#isDate(value)) {
        this.errors[key] = this.messages[key].type || "Invalid date";
        isValid = false;
      }

      // Check for minimum value
      if (rule.min !== undefined) {
        // If the value is a string, check the length
        if (typeof value === "string" && value.length < rule.min) {
          this.errors[key] = this.messages[key].min || "Too short";
          isValid = false;
        }
        // If the value is a number, check the value
        if (typeof value === "number" && value < rule.min) {
          this.errors[key] = this.messages[key].min || "Too short";
          isValid = false;
        }
      }

      // Check for maximum value
      if (rule.max !== undefined) {
        // If the value is a string, check the length
        if (typeof value === "string" && value.length > rule.max) {
          this.errors[key] = this.messages[key].max || "Too long";
          isValid = false;
        }
        // If the value is a number, check the value
        if (typeof value === "number" && value > rule.max) {
          this.errors[key] = this.messages[key].max || "Too long";
          isValid = false;
        }
      }

      // Check for valid email
      if (rule.validate === "email" && !this.#validateEmail(value)) {
        this.errors[key] = this.messages[key].validate || "Invalid email";
        isValid = false;
      }

      // Check for matching fields
      if (rule.match && value !== input[rule.match]) {
        this.errors[key] = this.messages[key].match || "Fields do not match";
        isValid = false;
      }

      // Check for regex
      if (rule.regex && !this.#validateRegex(value, rule.regex)) {
        this.errors[key] = this.messages[key].regex || "Invalid value";
        isValid = false;
      }

      // Asynchronous custom validation
      if (rule.custom && typeof rule.custom === "function") {
        const customValid = await rule.custom(value);
        if (!customValid) {
          this.errors[key] =
            this.messages[key].custom || "Custom validation failed";
          isValid = false;
        }
      }
    }

    // If strict mode is enabled, check for fields that are not defined in rules
    if (this.options.strictMode) {
      for (const key in input) {
        if (!this.rules[key]) {
          this.errors[key] = "Field is not allowed";
          isValid = false;
        }
      }
    }

    // Iterate over the fields after validation checks
    for (const key in this.rules) {
      if (!this.errors[key] && this.options.trackPassedFields) {
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

  /**
   * Update the validation rules.
   * @param {Object} newRules - The new rules to update.
   */
  updateRules(newRules) {
    this.#validateRulesFormat(newRules);
    this.rules = { ...this.rules, ...newRules };
  }

  /**
   * Update the validation messages.
   * @param {Object} newMessages - The new messages to update.
   */
  updateMessages(newMessages) {
    this.#validateMessagesFormat(newMessages);
    this.messages = { ...this.messages, ...newMessages };
  }

  /**
   * Update the validation options.
   * @param {Object} newOptions - The new options to update.
   */
  updateOptions(newOptions) {
    this.#validateOptionsFormat(newOptions);
    this.options = { ...this.options, ...newOptions };
  }
}

module.exports = Validator;
