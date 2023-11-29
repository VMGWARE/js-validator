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
interface Rule {
  type: "string" | "number" | "boolean" | "integer" | "float" | "date";
  required?: boolean;
  min?: number;
  max?: number;
  match?: string;
  validate?: string;
  custom?: (value: any) => boolean | Promise<boolean>;
  skip?: (input: any) => boolean;
  regex?: RegExp;
}

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
interface Message {
  type: string;
  required?: string;
  min?: string;
  max?: string;
  match?: string;
  validate?: string;
  custom?: string;
  regex?: string;
}

/**
 * @typedef {Object} Options
 * @property {boolean} [trackPassedFields] - Whether to track fields that passed validation.
 * @property {boolean} [strictMode] - Flag to enable strict mode. If true, fields not defined in rules will be flagged as errors.
 */
interface Options {
  trackPassedFields?: boolean;
  strictMode?: boolean;
}

/**
 * A validation utility class for checking input against specified rules and outputting error messages.
 *
 * @class
 */
export default class Validator {
  /**
   * The validation rules for each field.
   * @type {{ [key: string]: Rule }}
   */
  private rules: { [key: string]: Rule };

  /**
   * The error messages for each rule.
   * @type {{ [key: string]: Message }}
   */
  private messages: { [key: string]: Message };

  /**
   * Additional options for validation.
   * @type {Options}
   */
  private options: Options;

  /**
   * The current validation errors.
   * @type {{ [key: string]: string }}
   */
  private errors: { [key: string]: string };

  /**
   * The fields that passed validation.
   * @type {{ [key: string]: any }}
   */
  private passed: { [key: string]: any };

  /**
   * Creates an instance of the Validator class.
   * @param {{ [key: string]: Rule }} rules - The validation rules for each field.
   * @param {{ [key: string]: Message }} messages - The error messages for each rule.
   * @param {Options} [options] - Additional options for validation.
   */
  constructor(
    rules: { [key: string]: Rule },
    messages: { [key: string]: Message },
    options?: Options
  ) {
    this.rules = rules;
    this.messages = messages;
    this.options = options || {};
    this.errors = {};
    this.passed = {};
  }

  /**
   * Validates an email address with a regular expression.
   * @param {string} email - The email address to validate.
   * @returns {boolean} Returns true if the email is valid, otherwise false.
   */
  #validateEmail(email: string): boolean {
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
  #validateRegex(value: string, regex: RegExp): boolean {
    return regex.test(value);
  }

  /**
   * Validates if a value is an integer.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is an integer, otherwise false.
   */
  #isInteger(value: any): boolean {
    return Number.isInteger(value);
  }

  /**
   * Validates if a value is a float.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is a float, otherwise false.
   */
  #isFloat(value: any): boolean {
    return typeof value === "number" && !Number.isInteger(value);
  }

  /**
   * Validates if a value is a valid date.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is a valid date, otherwise false.
   */
  #isDate(value: any): boolean {
    return value instanceof Date && !Number.isNaN(value);
  }

  /**
   * Validates the input against the defined rules.
   * @param {any} input - The input to validate.
   * @returns {Promise<boolean>} - True if validation passes, false otherwise.
   */
  async validate(input: any): Promise<boolean> {
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
   * @returns {{ [key: string]: string }} - The current errors.
   */
  getErrors(): { [key: string]: string } {
    return this.errors;
  }

  /**
   * Get the fields that passed validation.
   * @returns {{ [key: string]: any }} - The fields that passed.
   */
  getPassedFields(): { [key: string]: any } {
    return this.passed;
  }

  /**
   * Reset the validator state.
   */
  reset(): void {
    this.errors = {};
    this.passed = {};
  }

  /**
   * Update the validation rules.
   * @param {{ [key: string]: Rule }} newRules - The new rules to update.
   */
  updateRules(newRules: { [key: string]: Rule }): void {
    this.rules = { ...this.rules, ...newRules };
  }

  /**
   * Update the validation messages.
   * @param {{ [key: string]: Message }} newMessages - The new messages to update.
   */
  updateMessages(newMessages: { [key: string]: Message }): void {
    this.messages = { ...this.messages, ...newMessages };
  }

  /**
   * Update the validation options.
   * @param {Options} newOptions - The new options to update.
   */
  updateOptions(newOptions: Options): void {
    this.options = { ...this.options, ...newOptions };
  }
}
