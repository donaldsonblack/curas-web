export type PropertyType =
  | 'text' | 'email' | 'number' | 'select' | 'multi_select'
  | 'date' | 'files' | 'url' | 'phone';

export type Option = { 
  id: string; 
  label: string; 
  value: string; 
};

export type FormProperty = {
  id: string;            // stable id for the form field
  key: string;           // collection column key
  type: PropertyType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: Option[];    // for select/multi_select
};

export type Comparator =
  | 'equals' | 'not_equals' | 'includes'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'is_set' | 'is_not_set';

export type ShowPredicate = {
  whenFieldId: string;
  comparator: Comparator;
  value?: string | number | boolean | string[];
};

export type VisibilityRuleGroup = {
  /** All predicates in a group are ANDed, groups are ORed (DNF). */
  predicates: ShowPredicate[];
};

export type FieldVisibility = {
  fieldId: string;
  groups: VisibilityRuleGroup[];   // OR of AND-groups
};

export type SuccessBehavior =
  | { mode: 'message'; message: string }
  | { mode: 'redirect'; url: string };

export type AutomationAction =
  | { type: 'set_property'; key: string; value: unknown }
  | { type: 'assign_owner'; userId: string }
  | { type: 'webhook'; url: string; payload?: Record<string, unknown> }
  | { type: 'notify'; channel: 'email' | 'slack'; to: string; template?: string };

export type FormDefinition = {
  id: string;
  title: string;
  intro?: string;
  submitText: string;
  success: SuccessBehavior;
  allowAnonymous: boolean;
  properties: FormProperty[];
  visibility: FieldVisibility[];
  backingCollectionId: string;
  automations?: AutomationAction[];
};

export type Submission = {
  formId: string;
  answers: Record<string /*property.key*/, unknown>;
  meta: { anonymous: boolean; userId?: string; ts: number };
};

// Additional types for builder UI
export type FieldPaletteItem = {
  type: PropertyType;
  label: string;
  icon: string;
  description: string;
};

export type ValidationError = {
  fieldId: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

// Types for rules diagnostics
export type RuleDiagnostic = {
  type: 'circular_dependency' | 'unreachable_field' | 'invalid_reference';
  fieldId: string;
  message: string;
  severity: 'error' | 'warning';
};

export type VisibilityGraphValidation = {
  isValid: boolean;
  diagnostics: RuleDiagnostic[];
};
