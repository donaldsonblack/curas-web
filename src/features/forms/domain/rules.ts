import type { FormDefinition, FieldVisibility, ShowPredicate, VisibilityRuleGroup, RuleDiagnostic, VisibilityGraphValidation, Comparator } from './formTypes';

/**
 * Evaluates a single predicate against the current form answers
 */
function evaluatePredicate(predicate: ShowPredicate, answers: Record<string, unknown>): boolean {
  const { whenFieldId, comparator, value } = predicate;
  const fieldValue = answers[whenFieldId];

  switch (comparator) {
    case 'equals':
      return fieldValue === value;
    
    case 'not_equals':
      return fieldValue !== value;
    
    case 'includes':
      if (Array.isArray(fieldValue) && typeof value === 'string') {
        return fieldValue.includes(value);
      }
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        return fieldValue.includes(value);
      }
      return false;
    
    case 'gt':
      return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue > value;
    
    case 'gte':
      return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue >= value;
    
    case 'lt':
      return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue < value;
    
    case 'lte':
      return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue <= value;
    
    case 'is_set':
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    
    case 'is_not_set':
      return fieldValue === undefined || fieldValue === null || fieldValue === '';
    
    default:
      return false;
  }
}

/**
 * Evaluates a rule group (AND of predicates)
 */
function evaluateRuleGroup(group: VisibilityRuleGroup, answers: Record<string, unknown>): boolean {
  return group.predicates.every(predicate => evaluatePredicate(predicate, answers));
}

/**
 * Evaluates field visibility (OR of AND-groups)
 */
function evaluateFieldVisibility(visibility: FieldVisibility, answers: Record<string, unknown>): boolean {
  if (visibility.groups.length === 0) {
    return true; // No rules means always visible
  }
  
  return visibility.groups.some(group => evaluateRuleGroup(group, answers));
}

/**
 * Main function to evaluate visibility for all fields
 * Returns a Set of visible field IDs
 */
export function evaluateVisibility(
  definition: FormDefinition, 
  answers: Record<string, unknown>
): Set<string> {
  const visibleFields = new Set<string>();
  
  // Start with all fields as potentially visible
  for (const property of definition.properties) {
    visibleFields.add(property.id);
  }
  
  // Apply visibility rules
  for (const visibility of definition.visibility) {
    const isVisible = evaluateFieldVisibility(visibility, answers);
    
    if (!isVisible) {
      visibleFields.delete(visibility.fieldId);
    }
  }
  
  return visibleFields;
}

/**
 * Detects circular dependencies in visibility rules
 */
function detectCircularDependencies(definition: FormDefinition): RuleDiagnostic[] {
  const diagnostics: RuleDiagnostic[] = [];
  const fieldIds = new Set(definition.properties.map(p => p.id));
  
  // Build dependency graph
  const dependencies = new Map<string, Set<string>>();
  
  for (const visibility of definition.visibility) {
    const targetField = visibility.fieldId;
    const deps = new Set<string>();
    
    for (const group of visibility.groups) {
      for (const predicate of group.predicates) {
        deps.add(predicate.whenFieldId);
      }
    }
    
    dependencies.set(targetField, deps);
  }
  
  // Check for circular dependencies using DFS
  function hasCycle(fieldId: string, visited: Set<string>, recursionStack: Set<string>): boolean {
    if (recursionStack.has(fieldId)) {
      return true; // Found a cycle
    }
    
    if (visited.has(fieldId)) {
      return false; // Already processed
    }
    
    visited.add(fieldId);
    recursionStack.add(fieldId);
    
    const deps = dependencies.get(fieldId) || new Set();
    for (const dep of deps) {
      if (hasCycle(dep, visited, recursionStack)) {
        return true;
      }
    }
    
    recursionStack.delete(fieldId);
    return false;
  }
  
  const visited = new Set<string>();
  for (const fieldId of fieldIds) {
    if (!visited.has(fieldId)) {
      const recursionStack = new Set<string>();
      if (hasCycle(fieldId, visited, recursionStack)) {
        diagnostics.push({
          type: 'circular_dependency',
          fieldId,
          message: `Field "${fieldId}" has a circular dependency in its visibility rules`,
          severity: 'error'
        });
      }
    }
  }
  
  return diagnostics;
}

/**
 * Detects unreachable fields (fields that can never be shown)
 */
function detectUnreachableFields(definition: FormDefinition): RuleDiagnostic[] {
  const diagnostics: RuleDiagnostic[] = [];
  
  // Simple heuristic: if a field depends on itself directly, it's unreachable
  for (const visibility of definition.visibility) {
    const targetField = visibility.fieldId;
    
    for (const group of visibility.groups) {
      for (const predicate of group.predicates) {
        if (predicate.whenFieldId === targetField) {
          diagnostics.push({
            type: 'unreachable_field',
            fieldId: targetField,
            message: `Field "${targetField}" depends on itself and may be unreachable`,
            severity: 'warning'
          });
        }
      }
    }
  }
  
  return diagnostics;
}

/**
 * Validates references to ensure all referenced fields exist
 */
function validateFieldReferences(definition: FormDefinition): RuleDiagnostic[] {
  const diagnostics: RuleDiagnostic[] = [];
  const fieldIds = new Set(definition.properties.map(p => p.id));
  
  for (const visibility of definition.visibility) {
    // Check if the target field exists
    if (!fieldIds.has(visibility.fieldId)) {
      diagnostics.push({
        type: 'invalid_reference',
        fieldId: visibility.fieldId,
        message: `Visibility rule references non-existent field "${visibility.fieldId}"`,
        severity: 'error'
      });
    }
    
    // Check if referenced fields in predicates exist
    for (const group of visibility.groups) {
      for (const predicate of group.predicates) {
        if (!fieldIds.has(predicate.whenFieldId)) {
          diagnostics.push({
            type: 'invalid_reference',
            fieldId: visibility.fieldId,
            message: `Predicate references non-existent field "${predicate.whenFieldId}"`,
            severity: 'error'
          });
        }
      }
    }
  }
  
  return diagnostics;
}

/**
 * Validates the visibility graph and returns diagnostics
 */
export function validateVisibilityGraph(definition: FormDefinition): VisibilityGraphValidation {
  const diagnostics: RuleDiagnostic[] = [
    ...detectCircularDependencies(definition),
    ...detectUnreachableFields(definition),
    ...validateFieldReferences(definition)
  ];
  
  const hasErrors = diagnostics.some(d => d.severity === 'error');
  
  return {
    isValid: !hasErrors,
    diagnostics
  };
}

/**
 * Gets available comparators for a given field type
 */
export function getAvailableComparators(fieldType: string): Comparator[] {
  const baseComparators: Comparator[] = ['equals', 'not_equals', 'is_set', 'is_not_set'];
  
  switch (fieldType) {
    case 'number':
      return [...baseComparators, 'gt', 'gte', 'lt', 'lte'];
    
    case 'select':
    case 'multi_select':
      return [...baseComparators, 'includes'];
    
    case 'text':
    case 'email':
    case 'url':
    case 'phone':
      return [...baseComparators, 'includes'];
    
    default:
      return baseComparators;
  }
}

/**
 * Clears values for hidden fields
 */
export function clearHiddenFieldValues(
  answers: Record<string, unknown>,
  visibleFields: Set<string>,
  allFieldKeys: string[]
): Record<string, unknown> {
  const clearedAnswers = { ...answers };
  
  for (const key of allFieldKeys) {
    if (!visibleFields.has(key)) {
      delete clearedAnswers[key];
    }
  }
  
  return clearedAnswers;
}
