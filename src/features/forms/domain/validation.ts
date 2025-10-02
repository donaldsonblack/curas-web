import type { FormProperty, ValidationResult, ValidationError } from './formTypes';

export type ValidationOutput = {
  ok: boolean;
  error?: string;
  value?: any;
  warnings?: string[];
};

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * URL validation regex
 */
const URL_REGEX = /^https?:\/\/.+/;

/**
 * Phone validation regex (basic international format)
 */
const PHONE_REGEX = /^\+?[\d\s\-\(\)]+$/;

/**
 * Validates and coerces a value for a specific property
 */
export function coerceAndValidate(property: FormProperty, value: unknown): ValidationOutput {
  // Handle empty values
  if (value === undefined || value === null || value === '') {
    if (property.required) {
      return {
        ok: false,
        error: `${property.label} is required`
      };
    }
    return { ok: true, value: null };
  }

  switch (property.type) {
    case 'text':
      if (typeof value !== 'string') {
        return {
          ok: false,
          error: `${property.label} must be text`
        };
      }
      return { ok: true, value: value.trim() };

    case 'email':
      if (typeof value !== 'string') {
        return {
          ok: false,
          error: `${property.label} must be a valid email`
        };
      }
      const email = value.trim();
      if (!EMAIL_REGEX.test(email)) {
        return {
          ok: false,
          error: `${property.label} must be a valid email address`
        };
      }
      return { ok: true, value: email };

    case 'number':
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (typeof num !== 'number' || !isFinite(num)) {
        return {
          ok: false,
          error: `${property.label} must be a valid number`
        };
      }
      return { ok: true, value: num };

    case 'url':
      if (typeof value !== 'string') {
        return {
          ok: false,
          error: `${property.label} must be a valid URL`
        };
      }
      const url = value.trim();
      if (!URL_REGEX.test(url)) {
        return {
          ok: false,
          error: `${property.label} must be a valid URL starting with http:// or https://`
        };
      }
      return { ok: true, value: url };

    case 'phone':
      if (typeof value !== 'string') {
        return {
          ok: false,
          error: `${property.label} must be a valid phone number`
        };
      }
      const phone = value.trim();
      if (!PHONE_REGEX.test(phone)) {
        return {
          ok: false,
          error: `${property.label} must be a valid phone number`
        };
      }
      return { ok: true, value: phone };

    case 'date':
      if (typeof value !== 'string') {
        return {
          ok: false,
          error: `${property.label} must be a valid date`
        };
      }
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return {
          ok: false,
          error: `${property.label} must be a valid date`
        };
      }
      return { ok: true, value: value };

    case 'select':
      if (typeof value !== 'string') {
        return {
          ok: false,
          error: `${property.label} must be a valid selection`
        };
      }
      if (!property.options?.some(opt => opt.value === value)) {
        return {
          ok: false,
          error: `${property.label} must be one of the available options`
        };
      }
      return { ok: true, value };

    case 'multi_select':
      if (!Array.isArray(value)) {
        return {
          ok: false,
          error: `${property.label} must be a list of selections`
        };
      }
      const validValues = property.options?.map(opt => opt.value) || [];
      for (const item of value) {
        if (typeof item !== 'string' || !validValues.includes(item)) {
          return {
            ok: false,
            error: `${property.label} contains invalid selections`
          };
        }
      }
      return { ok: true, value };

    case 'files':
      // For files, we expect either a FileList or File array
      if (value instanceof FileList || Array.isArray(value)) {
        const files = Array.from(value as FileList | File[]);
        if (files.length === 0 && property.required) {
          return {
            ok: false,
            error: `${property.label} requires at least one file`
          };
        }
        return { ok: true, value: files };
      }
      return {
        ok: false,
        error: `${property.label} must be valid file(s)`
      };

    default:
      return {
        ok: false,
        error: `Unknown field type: ${property.type}`
      };
  }
}

/**
 * Validates all visible fields in a form
 */
export function validateForm(
  properties: FormProperty[],
  answers: Record<string, unknown>,
  visibleFieldIds: Set<string>
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const property of properties) {
    // Only validate visible fields
    if (!visibleFieldIds.has(property.id)) {
      continue;
    }

    const value = answers[property.key];
    const validation = coerceAndValidate(property, value);

    if (!validation.ok && validation.error) {
      errors.push({
        fieldId: property.id,
        message: validation.error
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gets a user-friendly error message for a field
 */
export function getFieldError(errors: ValidationError[], fieldId: string): string | undefined {
  return errors.find(error => error.fieldId === fieldId)?.message;
}

/**
 * Checks if a form is ready for submission
 */
export function isFormSubmittable(
  properties: FormProperty[],
  answers: Record<string, unknown>,
  visibleFieldIds: Set<string>
): boolean {
  const validation = validateForm(properties, answers, visibleFieldIds);
  return validation.isValid;
}

/**
 * Sanitizes form answers for submission
 */
export function sanitizeAnswers(
  properties: FormProperty[],
  answers: Record<string, unknown>,
  visibleFieldIds: Set<string>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const property of properties) {
    // Only include visible fields
    if (!visibleFieldIds.has(property.id)) {
      continue;
    }

    const value = answers[property.key];
    const validation = coerceAndValidate(property, value);

    if (validation.ok) {
      sanitized[property.key] = validation.value;
    }
  }

  return sanitized;
}
