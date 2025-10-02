import { describe, it, expect } from 'vitest';
import { 
  evaluateVisibility, 
  validateVisibilityGraph, 
  getAvailableComparators,
  clearHiddenFieldValues 
} from '../domain/rules';
import type { FormDefinition, FormProperty, FieldVisibility } from '../domain/formTypes';

// Test data
const mockProperties: FormProperty[] = [
  {
    id: 'name-field',
    key: 'name',
    type: 'text',
    label: 'Name',
    required: true
  },
  {
    id: 'email-field',
    key: 'email',
    type: 'email',
    label: 'Email',
    required: true
  },
  {
    id: 'plan-field',
    key: 'plan',
    type: 'select',
    label: 'Plan',
    required: true,
    options: [
      { id: 'free', label: 'Free', value: 'free' },
      { id: 'pro', label: 'Pro', value: 'pro' },
      { id: 'business', label: 'Business', value: 'business' }
    ]
  },
  {
    id: 'team-size-field',
    key: 'teamSize',
    type: 'number',
    label: 'Team Size',
    required: false
  },
  {
    id: 'company-field',
    key: 'company',
    type: 'text',
    label: 'Company',
    required: false
  }
];

const createMockDefinition = (visibility: FieldVisibility[] = []): FormDefinition => ({
  id: 'test-form',
  title: 'Test Form',
  submitText: 'Submit',
  success: { mode: 'message', message: 'Success' },
  allowAnonymous: true,
  properties: mockProperties,
  visibility,
  backingCollectionId: 'test-collection'
});

describe('Rules Engine', () => {
  describe('evaluateVisibility', () => {
    it('should show all fields when no visibility rules exist', () => {
      const definition = createMockDefinition();
      const answers = {};
      
      const visibleFields = evaluateVisibility(definition, answers);
      
      expect(visibleFields.size).toBe(5);
      expect(visibleFields.has('name-field')).toBe(true);
      expect(visibleFields.has('email-field')).toBe(true);
      expect(visibleFields.has('plan-field')).toBe(true);
      expect(visibleFields.has('team-size-field')).toBe(true);
      expect(visibleFields.has('company-field')).toBe(true);
    });

    it('should hide fields based on simple equals condition', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'team-size-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'equals',
                  value: 'pro'
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      
      // When plan is not 'pro', team-size should be hidden
      let answers = { plan: 'free' };
      let visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('team-size-field')).toBe(false);
      
      // When plan is 'pro', team-size should be visible
      answers = { plan: 'pro' };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('team-size-field')).toBe(true);
    });

    it('should handle OR logic between rule groups', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'company-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'equals',
                  value: 'pro'
                }
              ]
            },
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'equals',
                  value: 'business'
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      
      // Should be hidden for 'free'
      let answers = { plan: 'free' };
      let visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(false);
      
      // Should be visible for 'pro'
      answers = { plan: 'pro' };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(true);
      
      // Should be visible for 'business'
      answers = { plan: 'business' };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(true);
    });

    it('should handle AND logic within rule groups', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'company-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'equals',
                  value: 'pro'
                },
                {
                  whenFieldId: 'team-size-field',
                  comparator: 'gt',
                  value: 5
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      
      // Should be hidden when only one condition is met
      let answers = { plan: 'pro', teamSize: 3 };
      let visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(false);
      
      // Should be visible when both conditions are met
      answers = { plan: 'pro', teamSize: 10 };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(true);
    });

    it('should handle includes comparator for multi-select', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'company-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'includes',
                  value: 'pro'
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      
      // Test with string value
      let answers = { plan: 'pro' };
      let visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(true);
      
      // Test with array value (for multi-select scenarios)
      answers = { plan: ['free', 'pro'] as any };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(true);
      
      // Test with non-matching value
      answers = { plan: 'free' };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(false);
    });

    it('should handle is_set and is_not_set comparators', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'company-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'name-field',
                  comparator: 'is_set'
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      
      // Should be hidden when field is not set
      let answers = {};
      let visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(false);
      
      // Should be visible when field is set
      answers = { name: 'John Doe' };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(true);
      
      // Should be hidden when field is empty string
      answers = { name: '' };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(false);
    });

    it('should handle numeric comparisons', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'company-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'team-size-field',
                  comparator: 'gte',
                  value: 10
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      
      // Should be hidden for small team
      let answers = { teamSize: 5 };
      let visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(false);
      
      // Should be visible for large team
      answers = { teamSize: 15 };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(true);
      
      // Should be visible for exactly 10
      answers = { teamSize: 10 };
      visibleFields = evaluateVisibility(definition, answers);
      expect(visibleFields.has('company-field')).toBe(true);
    });
  });

  describe('validateVisibilityGraph', () => {
    it('should pass validation for valid rules', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'team-size-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'plan-field',
                  comparator: 'equals',
                  value: 'pro'
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      const validation = validateVisibilityGraph(definition);
      
      expect(validation.isValid).toBe(true);
      expect(validation.diagnostics).toHaveLength(0);
    });

    it('should detect circular dependencies', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'team-size-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'company-field',
                  comparator: 'is_set'
                }
              ]
            }
          ]
        },
        {
          fieldId: 'company-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'team-size-field',
                  comparator: 'gt',
                  value: 0
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      const validation = validateVisibilityGraph(definition);
      
      expect(validation.isValid).toBe(false);
      expect(validation.diagnostics.some(d => d.type === 'circular_dependency')).toBe(true);
    });

    it('should detect self-referencing fields', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'team-size-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'team-size-field',
                  comparator: 'gt',
                  value: 0
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      const validation = validateVisibilityGraph(definition);
      
      expect(validation.diagnostics.some(d => d.type === 'unreachable_field')).toBe(true);
    });

    it('should detect invalid field references', () => {
      const visibility: FieldVisibility[] = [
        {
          fieldId: 'team-size-field',
          groups: [
            {
              predicates: [
                {
                  whenFieldId: 'non-existent-field',
                  comparator: 'equals',
                  value: 'test'
                }
              ]
            }
          ]
        }
      ];

      const definition = createMockDefinition(visibility);
      const validation = validateVisibilityGraph(definition);
      
      expect(validation.isValid).toBe(false);
      expect(validation.diagnostics.some(d => d.type === 'invalid_reference')).toBe(true);
    });
  });

  describe('getAvailableComparators', () => {
    it('should return correct comparators for text fields', () => {
      const comparators = getAvailableComparators('text');
      expect(comparators).toContain('equals');
      expect(comparators).toContain('not_equals');
      expect(comparators).toContain('includes');
      expect(comparators).toContain('is_set');
      expect(comparators).toContain('is_not_set');
    });

    it('should return numeric comparators for number fields', () => {
      const comparators = getAvailableComparators('number');
      expect(comparators).toContain('gt');
      expect(comparators).toContain('gte');
      expect(comparators).toContain('lt');
      expect(comparators).toContain('lte');
    });

    it('should return includes for select fields', () => {
      const comparators = getAvailableComparators('select');
      expect(comparators).toContain('includes');
    });
  });

  describe('clearHiddenFieldValues', () => {
    it('should remove values for hidden fields', () => {
      const answers = {
        name: 'John',
        email: 'john@example.com',
        plan: 'free',
        teamSize: 5,
        company: 'Acme Corp'
      };
      
      const visibleFields = new Set(['name-field', 'email-field', 'plan-field']);
      const allFieldKeys = ['name', 'email', 'plan', 'teamSize', 'company'];
      
      const clearedAnswers = clearHiddenFieldValues(answers, visibleFields, allFieldKeys);
      
      expect(clearedAnswers.name).toBe('John');
      expect(clearedAnswers.email).toBe('john@example.com');
      expect(clearedAnswers.plan).toBe('free');
      expect(clearedAnswers.teamSize).toBeUndefined();
      expect(clearedAnswers.company).toBeUndefined();
    });

    it('should not modify original answers object', () => {
      const answers = {
        name: 'John',
        teamSize: 5
      };
      
      const visibleFields = new Set(['name-field']);
      const allFieldKeys = ['name', 'teamSize'];
      
      const clearedAnswers = clearHiddenFieldValues(answers, visibleFields, allFieldKeys);
      
      expect(answers.teamSize).toBe(5); // Original should be unchanged
      expect(clearedAnswers.teamSize).toBeUndefined();
    });
  });
});
