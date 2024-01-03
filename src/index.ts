/**
 * The validation rules for each field.
 */
interface Rule {
  /**
   * The data type of the field.
   */
  type?: "string" | "number" | "boolean" | "integer" | "float" | "date";
  /**
   * Whether the field is required.
   */
  required?: boolean;
  /**
   * Minimum value/length.
   */
  min?: number;
  /**
   * Maximum value/length.
   */
  max?: number;
  /**
   * Field must match the value of this field.
   */
  match?: string;
  /**
   * Special validation ('email', etc.).
   */
  validate?: string;
  /**
   * Custom validation function. Should return true if valid.
   */
  custom?: (value: any) => boolean | Promise<boolean>;
  /**
   * Regular expression to validate the field.
   */
  skip?: (input: any) => boolean;
  /**
   * Regular expression to validate the field.
   */
  regex?: RegExp;
}

/**
 * The error messages for each rule.
 */
interface Message {
  /**
   * The error message for incorrect type.
   */
  type?: string;
  /**
   * The error message for missing required field.
   */
  required?: string;
  /**
   * The error message for value/length below minimum.
   */
  min?: string;
  /**
   * The error message for value/length above maximum.
   */
  max?: string;
  /**
   * The error message for non-matching fields.
   */
  match?: string;
  /**
   * The error message for invalid email.
   */
  validate?: string;
  /**
   * The error message for custom validation failure.
   */
  custom?: string;
  /**
   * The error message for regex validation failure.
   */
  regex?: string;
}

/**
 * The validation rules for entire input.
 */
interface Rules {
  /**
   * Key-value pairs of validation rules for each field.
   */
  [key: string]: Rule;
}

/**
 * The error messages for each rule.
 */
interface Messages {
  /**
   * Key-value pairs of error messages for each rule.
   */
  [key: string]: Message;
}

/**
 * Additional options for validation.
 */
interface Options {
  /**
   * Whether to track fields that passed validation.
   */
  trackPassedFields?: boolean;
  /**
   * Flag to enable strict mode. If true, fields not defined in rules will be flagged as errors.
   */
  strictMode?: boolean;
}

/**
 * A validation utility class for checking input against specified rules and outputting error messages.
 *
 * @class
 */
class Validator {
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
   * @param {Rules} rules - The validation rules for each field.
   * @param {Messages} messages - The error messages for each rule.
   * @param {Options} [options] - Additional options for validation.
   */
  constructor(rules: Rules, messages: Messages, options?: Options) {
    this.rules = rules;
    this.messages = messages;
    this.options = options ?? {};
    this.errors = {};
    this.passed = {};
  }

  /**
   * Validates an email address.
   * @param {string} email - The email address to validate.
   * @returns {boolean} Returns true if the email is valid, otherwise false.
   */
  static isEmail(email: string): boolean {
    // This regular expression is more efficient and less prone to backtracking issues.
    // It simplifies the check for an email format by eliminating unnecessary repetition patterns.
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Validates a string against a regular expression.
   * @param {string} value - The value to validate.
   * @param {RegExp} regex - The regular expression to use.
   * @returns {boolean} Returns true if the regex is valid, otherwise false.
   */
  static isValidRegex(value: string, regex: RegExp): boolean {
    return regex.test(value);
  }

  /**
   * Validates if a value is an integer.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is an integer, otherwise false.
   */
  static isInteger(value: any): boolean {
    return Number.isInteger(value);
  }

  /**
   * Validates if a value is a float.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is a float, otherwise false.
   */
  static isFloat(value: any): boolean {
    return typeof value === "number" && !Number.isInteger(value);
  }

  /**
   * Validates if a value is a valid date.
   * @param {any} value - The value to validate.
   * @returns {boolean} Returns true if the value is a valid date, otherwise false.
   */
  static isDate(value: any): boolean {
    return value instanceof Date && !Number.isNaN(value);
  }

  /**
   * Validates the input against the defined rules.
   * @param {any} input - The input to validate.
   * @returns {Promise<boolean>} True if validation passes, false otherwise.
   */
  async validate(input: any): Promise<boolean> {
    // Ensure input is an object
    if (typeof input !== "object" || Array.isArray(input)) {
      throw new Error("Input must be an object.");
    }

    this.errors = {};
    let isValid = true;

    // Cache the keys of the rules for optimization
    const ruleKeys = Object.keys(this.rules);

    // Iterate over the rules instead of input
    for (const key of ruleKeys) {
      const rule = this.rules[key];
      const value = input[key];

      // Skipping validation under certain conditions
      if (rule.skip && typeof rule.skip === "function" && rule.skip(input)) {
        continue; // Skip further validation if the condition is met
      }

      // Check for required field
      if (rule.required && (value === "" || value === undefined)) {
        this.errors[key] =
          this.messages[key].required ??
          `"${key}" is a required field and cannot be empty.`;
        isValid = false;
        continue; // Skip further checks if the field is missing
      }

      // If the value is not present, no need to check further rules
      if (value === undefined) continue;

      // Type-specific validations
      if (rule.type === "string" && typeof value !== "string") {
        this.errors[key] =
          this.messages[key].type ??
          `Expected a ${rule.type}, but received ${typeof value}`;
        isValid = false;
      }

      if (rule.type === "number" && typeof value !== "number") {
        this.errors[key] =
          this.messages[key].type ??
          `Expected a ${rule.type}, but received ${typeof value}`;
        isValid = false;
      }

      if (rule.type === "boolean" && typeof value !== "boolean") {
        this.errors[key] =
          this.messages[key].type ??
          `Expected a ${rule.type}, but received ${typeof value}`;
        isValid = false;
      }

      if (rule.type === "integer" && !Validator.isInteger(value)) {
        this.errors[key] =
          this.messages[key].type ??
          `Expected a ${rule.type}, but received ${typeof value}`;
        isValid = false;
      }

      if (rule.type === "float" && !Validator.isFloat(value)) {
        this.errors[key] =
          this.messages[key].type ??
          `Expected a ${rule.type}, but received ${typeof value}`;
        isValid = false;
      }

      if (rule.type === "date" && !Validator.isDate(value)) {
        this.errors[key] =
          this.messages[key].type ??
          `Expected a ${rule.type}, but received ${typeof value}`;
        isValid = false;
      }

      // Check for minimum value
      if (rule.min !== undefined) {
        // If the value is a string, check the length
        if (typeof value === "string" && value.length < rule.min) {
          this.errors[key] =
            this.messages[key].min ??
            `"${key}" should be at least ${rule.min} characters long (or greater if a number).`;
          isValid = false;
        }
        // If the value is a number, check the value
        if (typeof value === "number" && value < rule.min) {
          this.errors[key] =
            this.messages[key].min ??
            `"${key}" should be at least ${rule.min} characters long (or greater if a number).`;
          isValid = false;
        }
      }

      // Check for maximum value
      if (rule.max !== undefined) {
        // If the value is a string, check the length
        if (typeof value === "string" && value.length > rule.max) {
          this.errors[key] =
            this.messages[key].max ??
            `"${key}" should not exceed ${rule.max} characters (or be less if a number).`;
          isValid = false;
        }
        // If the value is a number, check the value
        if (typeof value === "number" && value > rule.max) {
          this.errors[key] =
            this.messages[key].max ??
            `"${key}" should not exceed ${rule.max} characters (or be less if a number).`;
          isValid = false;
        }
      }

      // Check for valid email
      if (rule.validate === "email" && !Validator.isEmail(value)) {
        this.errors[key] =
          this.messages[key].validate ??
          `"${key}" is not a valid email address. Please enter a valid email.`;
        isValid = false;
      }

      // Check for matching fields
      if (rule.match && value !== input[rule.match]) {
        this.errors[key] =
          this.messages[key].match ??
          `"${key}" must match with the "${rule.match}" field.`;
        isValid = false;
      }

      // Check for regex
      if (rule.regex && !Validator.isValidRegex(value, rule.regex)) {
        this.errors[key] =
          this.messages[key].regex ??
          `"${key}" does not match the required format.`;
        isValid = false;
      }

      // Asynchronous custom validation
      if (rule.custom && typeof rule.custom === "function") {
        const customValid = await rule.custom(value);
        if (!customValid) {
          this.errors[key] =
            this.messages[key].custom ??
            `Custom validation for "${key}" failed. Ensure it meets the specific requirements.`;
          isValid = false;
        }
      }
    }

    // If strict mode is enabled, check for fields that are not defined in rules
    if (this.options.strictMode) {
      for (const key in input) {
        if (!this.rules[key]) {
          this.errors[
            key
          ] = `"${key}" is not a recognized field and cannot be processed.`;
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
   * @returns {{ [key: string]: string }} The current errors.
   */
  getErrors(): { [key: string]: string } {
    return this.errors;
  }

  /**
   * Get the fields that passed validation.
   * @returns {{ [key: string]: any }} The fields that passed.
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

// Export types
export type {
  Rule as RuleType,
  Rules as RulesType,
  Message as MessageType,
  Messages as MessagesType,
  Options as OptionsType,
};

// Export class
export default Validator;
// module.exports = Validator;