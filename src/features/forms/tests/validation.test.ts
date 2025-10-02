import { describe, it, expect } from 'vitest';
import { 
  coerceAndValidate, 
  validateForm, 
  isFormSubmittable,
  sanitizeAnswers 
} from '../domain/validation';
import type { FormProperty } from '../domain/formTypes';

describe('Validation', () => {
  describe('coerceAndValidate', () => {
    it('should validate text fields', () => {
      const property: FormProperty = {
        id: 'name',
        key: 'name',
        type: 'text',
        label: 'Name',
        required: true
      };

      // Valid text
      let result = coerceAndValidate(property, 'John Doe');
      expect(result.ok).toBe(true);
      expect(result.value).toBe('John Doe');

      // Trim whitespace
      result = coerceAndValidate(property, '  John Doe  ');
      expect(result.ok).toBe(true);
      expect(result.value).toBe('John Doe');

      // Required field empty
      result = coerceAndValidate(property, '');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('required');

      // Non-string value
      result = coerceAndValidate(property, 123);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('must be text');
    });

    it('should validate email fields', () => {
      const property: FormProperty = {
        id: 'email',
        key: 'email',
        type: 'email',
        label: 'Email',
        required: true
      };

      // Valid email
      let result = coerceAndValidate(property, 'test@example.com');
      expect(result.ok).toBe(true);
      expect(result.value).toBe('test@example.com');

      // Invalid email format
      result = coerceAndValidate(property, 'invalid-email');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid email');

      // Empty required email
      result = coerceAndValidate(property, '');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should validate number fields', () => {
      const property: FormProperty = {
        id: 'age',
        key: 'age',
        type: 'number',
        label: 'Age',
        required: true
      };

      // Valid number
      let result = coerceAndValidate(property, 25);
      expect(result.ok).toBe(true);
      expect(result.value).toBe(25);

      // String number
      result = coerceAndValidate(property, '25');
      expect(result.ok).toBe(true);
      expect(result.value).toBe(25);

      // Invalid number
      result = coerceAndValidate(property, 'not-a-number');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid number');

      // Infinity
      result = coerceAndValidate(property, Infinity);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid number');
    });

    it('should validate URL fields', () => {
      const property: FormProperty = {
        id: 'website',
        key: 'website',
        type: 'url',
        label: 'Website',
        required: false
      };

      // Valid URL
      let result = coerceAndValidate(property, 'https://example.com');
      expect(result.ok).toBe(true);
      expect(result.value).toBe('https://example.com');

      // Valid HTTP URL
      result = coerceAndValidate(property, 'http://example.com');
      expect(result.ok).toBe(true);

      // Invalid URL
      result = coerceAndValidate(property, 'not-a-url');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid URL');

      // Empty optional URL
      result = coerceAndValidate(property, '');
      expect(result.ok).toBe(true);
      expect(result.value).toBe(null);
    });

    it('should validate phone fields', () => {
      const property: FormProperty = {
        id: 'phone',
        key: 'phone',
        type: 'phone',
        label: 'Phone',
        required: true
      };

      // Valid phone numbers
      const validPhones = [
        '+1234567890',
        '(555) 123-4567',
        '555-123-4567',
        '+44 20 7946 0958'
      ];

      validPhones.forEach(phone => {
        const result = coerceAndValidate(property, phone);
        expect(result.ok).toBe(true);
      });

      // Invalid phone
      let result = coerceAndValidate(property, 'abc123');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid phone');
    });

    it('should validate date fields', () => {
      const property: FormProperty = {
        id: 'birthday',
        key: 'birthday',
        type: 'date',
        label: 'Birthday',
        required: true
      };

      // Valid date
      let result = coerceAndValidate(property, '2023-12-25');
      expect(result.ok).toBe(true);
      expect(result.value).toBe('2023-12-25');

      // Invalid date
      result = coerceAndValidate(property, 'not-a-date');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid date');

      // Invalid date format
      result = coerceAndValidate(property, '32/13/2023');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid date');
    });

    it('should validate select fields', () => {
      const property: FormProperty = {
        id: 'plan',
        key: 'plan',
        type: 'select',
        label: 'Plan',
        required: true,
        options: [
          { id: 'free', label: 'Free', value: 'free' },
          { id: 'pro', label: 'Pro', value: 'pro' }
        ]
      };

      // Valid selection
      let result = coerceAndValidate(property, 'pro');
      expect(result.ok).toBe(true);
      expect(result.value).toBe('pro');

      // Invalid selection
      result = coerceAndValidate(property, 'enterprise');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('available options');

      // Non-string value
      result = coerceAndValidate(property, 123);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid selection');
    });

    it('should validate multi-select fields', () => {
      const property: FormProperty = {
        id: 'features',
        key: 'features',
        type: 'multi_select',
        label: 'Features',
        required: false,
        options: [
          { id: 'feature1', label: 'Feature 1', value: 'feature1' },
          { id: 'feature2', label: 'Feature 2', value: 'feature2' },
          { id: 'feature3', label: 'Feature 3', value: 'feature3' }
        ]
      };

      // Valid multi-selection
      let result = coerceAndValidate(property, ['feature1', 'feature3']);
      expect(result.ok).toBe(true);
      expect(result.value).toEqual(['feature1', 'feature3']);

      // Empty array
      result = coerceAndValidate(property, []);
      expect(result.ok).toBe(true);
      expect(result.value).toEqual([]);

      // Invalid selection in array
      result = coerceAndValidate(property, ['feature1', 'invalid']);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('invalid selections');

      // Non-array value
      result = coerceAndValidate(property, 'feature1');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('list of selections');
    });

    it('should validate file fields', () => {
      const property: FormProperty = {
        id: 'documents',
        key: 'documents',
        type: 'files',
        label: 'Documents',
        required: true
      };

      // Mock File objects
      const mockFile1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
      const mockFile2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });

      // Valid file array
      let result = coerceAndValidate(property, [mockFile1, mockFile2]);
      expect(result.ok).toBe(true);
      expect(result.value).toEqual([mockFile1, mockFile2]);

      // Empty required files
      result = coerceAndValidate(property, []);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('at least one file');

      // Invalid value
      result = coerceAndValidate(property, 'not-files');
      expect(result.ok).toBe(false);
      expect(result.error).toContain('valid file');
    });
  });

  describe('validateForm', () => {
    const properties: FormProperty[] = [
      {
        id: 'name',
        key: 'name',
        type: 'text',
        label: 'Name',
        required: true
      },
      {
        id: 'email',
        key: 'email',
        type: 'email',
        label: 'Email',
        required: true
      },
      {
        id: 'age',
        key: 'age',
        type: 'number',
        label: 'Age',
        required: false
      }
    ];

    it('should validate all visible fields', () => {
      const answers = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      };
      const visibleFields = new Set(['name', 'email', 'age']);

      const result = validateForm(properties, answers, visibleFields);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid fields', () => {
      const answers = {
        name: '',
        email: 'invalid-email',
        age: 'not-a-number'
      };
      const visibleFields = new Set(['name', 'email', 'age']);

      const result = validateForm(properties, answers, visibleFields);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors.some(e => e.fieldId === 'name')).toBe(true);
      expect(result.errors.some(e => e.fieldId === 'email')).toBe(true);
      expect(result.errors.some(e => e.fieldId === 'age')).toBe(true);
    });

    it('should only validate visible fields', () => {
      const answers = {
        name: 'John Doe',
        email: '', // Invalid but hidden
        age: 25
      };
      const visibleFields = new Set(['name', 'age']); // email is hidden

      const result = validateForm(properties, answers, visibleFields);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('isFormSubmittable', () => {
    const properties: FormProperty[] = [
      {
        id: 'name',
        key: 'name',
        type: 'text',
        label: 'Name',
        required: true
      },
      {
        id: 'email',
        key: 'email',
        type: 'email',
        label: 'Email',
        required: true
      }
    ];

    it('should return true for valid form', () => {
      const answers = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      const visibleFields = new Set(['name', 'email']);

      const result = isFormSubmittable(properties, answers, visibleFields);
      expect(result).toBe(true);
    });

    it('should return false for invalid form', () => {
      const answers = {
        name: '',
        email: 'invalid-email'
      };
      const visibleFields = new Set(['name', 'email']);

      const result = isFormSubmittable(properties, answers, visibleFields);
      expect(result).toBe(false);
    });
  });

  describe('sanitizeAnswers', () => {
    const properties: FormProperty[] = [
      {
        id: 'name',
        key: 'name',
        type: 'text',
        label: 'Name',
        required: true
      },
      {
        id: 'email',
        key: 'email',
        type: 'email',
        label: 'Email',
        required: true
      },
      {
        id: 'age',
        key: 'age',
        type: 'number',
        label: 'Age',
        required: false
      }
    ];

    it('should sanitize and coerce values', () => {
      const answers = {
        name: '  John Doe  ',
        email: 'john@example.com',
        age: '25'
      };
      const visibleFields = new Set(['name', 'email', 'age']);

      const result = sanitizeAnswers(properties, answers, visibleFields);

      expect(result.name).toBe('John Doe'); // Trimmed
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(25); // Coerced to number
    });

    it('should only include visible fields', () => {
      const answers = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      };
      const visibleFields = new Set(['name', 'email']); // age is hidden

      const result = sanitizeAnswers(properties, answers, visibleFields);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBeUndefined();
    });

    it('should exclude invalid values', () => {
      const answers = {
        name: 'John Doe',
        email: 'invalid-email',
        age: 25
      };
      const visibleFields = new Set(['name', 'email', 'age']);

      const result = sanitizeAnswers(properties, answers, visibleFields);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBeUndefined(); // Invalid email excluded
      expect(result.age).toBe(25);
    });
  });
});
