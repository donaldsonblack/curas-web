# Form Builder & Runtime System

A comprehensive Notion-style form builder and runtime system built with React, TypeScript, and shadcn-ui components.

## Features

### Form Builder (Authoring)
- **Visual Form Designer**: Drag-and-drop interface with field palette
- **Field Types**: Text, email, number, select, multi-select, date, files, URL, phone
- **Conditional Logic**: Advanced visibility rules with AND/OR logic
- **Real-time Validation**: Circular dependency detection and field validation
- **Settings Panel**: Form configuration, success behavior, access controls
- **Share & Embed**: Public links and iframe embedding
- **Automations**: Post-submission actions (webhooks, notifications, etc.)

### Form Runtime (Filler)
- **Dynamic Rendering**: Fields show/hide based on conditional logic
- **Real-time Validation**: Type-specific validation with accessibility
- **Draft Autosave**: Automatic saving to localStorage
- **Responsive Design**: Mobile-friendly form layouts
- **Error Handling**: Comprehensive error states and retry mechanisms
- **Success Handling**: Custom messages or redirect behavior

### Technical Features
- **Type Safety**: Full TypeScript coverage with strict types
- **Accessibility**: WCAG 2.2 AA compliant with ARIA labels
- **Testing**: Comprehensive unit and integration tests
- **Performance**: Optimized re-renders and efficient rule evaluation
- **Extensibility**: Plugin architecture for custom field types

## Architecture

### Domain Layer
- **Types** (`formTypes.ts`): Core TypeScript interfaces and types
- **Rules Engine** (`rules.ts`): Visibility evaluation and validation
- **Validation** (`validation.ts`): Field-level and form-level validation

### Data Layer
- **Repository Interface** (`FormRepository.ts`): Abstraction for data access
- **In-Memory Implementation** (`InMemoryFormRepository.ts`): Demo implementation
- **Dependency Injection**: Context-based repository provider

### Component Layer
- **Builder Components**: Form authoring interface
- **Runtime Components**: Form filling interface  
- **Shared UI**: Reusable components with shadcn-ui

## Getting Started

### Installation

The form system is already integrated into your existing React application. No additional installation required.

### Basic Usage

#### Creating a Form Builder Page

```tsx
import { FormBuilder } from './features/forms/components/builder/FormBuilder';

function MyFormBuilderPage() {
  return (
    <FormBuilder 
      formId="my-form-id"
      onPreview={() => window.open('/forms/my-form-id', '_blank')}
    />
  );
}
```

#### Creating a Form Runtime Page

```tsx
import { FormRuntime } from './features/forms/components/runtime/FormRuntime';

function MyFormPage() {
  return (
    <FormRuntime 
      formId="my-form-id"
      allowDrafts={true}
      onSubmissionSuccess={(id) => console.log('Submitted:', id)}
      onSubmissionError={(error) => console.error('Error:', error)}
    />
  );
}
```

### Routes

The following routes are automatically configured:

- `/forms` - Form index page (list all forms)
- `/forms/:formId/builder` - Form builder interface
- `/forms/:formId` - Public form runtime

## Form Definition Structure

```typescript
interface FormDefinition {
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
}
```

## Field Types

### Supported Field Types

| Type | Description | Validation |
|------|-------------|------------|
| `text` | Single line text | String length, required |
| `email` | Email address | Email format, required |
| `number` | Numeric input | Number format, range |
| `select` | Single choice dropdown | Option membership |
| `multi_select` | Multiple choice checkboxes | Option membership |
| `date` | Date picker | Date format |
| `files` | File upload | File presence, type |
| `url` | URL input | URL format |
| `phone` | Phone number | Phone format |

### Adding Custom Field Types

1. Add the type to `PropertyType` union in `formTypes.ts`
2. Add validation logic in `validation.ts`
3. Add rendering logic in `FieldRenderer.tsx`
4. Add to field palette in `FieldPalette.tsx`

## Conditional Logic

### Visibility Rules

Forms support complex conditional logic using Disjunctive Normal Form (DNF):

```typescript
// Show field when (plan = 'pro' OR plan = 'business') AND teamSize > 5
{
  fieldId: 'company-field',
  groups: [
    {
      predicates: [
        { whenFieldId: 'plan-field', comparator: 'equals', value: 'pro' },
        { whenFieldId: 'team-size-field', comparator: 'gt', value: 5 }
      ]
    },
    {
      predicates: [
        { whenFieldId: 'plan-field', comparator: 'equals', value: 'business' },
        { whenFieldId: 'team-size-field', comparator: 'gt', value: 5 }
      ]
    }
  ]
}
```

### Available Comparators

- `equals`, `not_equals` - Exact matching
- `includes` - String/array contains
- `gt`, `gte`, `lt`, `lte` - Numeric comparisons
- `is_set`, `is_not_set` - Presence checks

## Validation

### Field-Level Validation

Each field type has specific validation rules:

```typescript
// Example: Email validation
const result = coerceAndValidate(emailProperty, 'user@example.com');
if (result.ok) {
  console.log('Valid email:', result.value);
} else {
  console.error('Validation error:', result.error);
}
```

### Form-Level Validation

```typescript
const validation = validateForm(properties, answers, visibleFields);
if (validation.isValid) {
  // Form is ready for submission
} else {
  // Show validation errors
  validation.errors.forEach(error => {
    console.log(`Field ${error.fieldId}: ${error.message}`);
  });
}
```

## Data Integration

### Repository Pattern

The system uses a repository pattern for data access:

```typescript
interface FormRepository {
  getForm(formId: string): Promise<FormDefinition>;
  saveForm(def: FormDefinition): Promise<void>;
  listForms(): Promise<Pick<FormDefinition, 'id' | 'title'>[]>;
  createSubmission(sub: Submission): Promise<{ id: string }>;
}
```

### Connecting to Your Backend

1. Implement the `FormRepository` interface
2. Replace the in-memory implementation with your backend calls
3. Provide your implementation via the `FormRepositoryProvider`

```typescript
import { MyBackendFormRepository } from './MyBackendFormRepository';

function App() {
  const repository = new MyBackendFormRepository();
  
  return (
    <FormRepositoryProvider value={repository}>
      {/* Your app */}
    </FormRepositoryProvider>
  );
}
```

## Testing

### Running Tests

```bash
npm test features/forms
```

### Test Coverage

- **Rules Engine**: Visibility evaluation, circular dependency detection
- **Validation**: All field types, form-level validation
- **Runtime**: Form rendering, submission, error handling
- **Integration**: End-to-end form workflows

### Test Structure

```
tests/
├── rules.test.ts          # Rules engine unit tests
├── validation.test.ts     # Validation unit tests
└── runtime.test.tsx       # Runtime integration tests
```

## Accessibility

### WCAG 2.2 AA Compliance

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Logical focus order and visible focus indicators
- **Error Handling**: Clear error messages with proper associations
- **Color Contrast**: High contrast design with non-color-only indicators

### Accessibility Features

- Form fields have proper `<label>` associations
- Error messages use `aria-describedby`
- Required fields are marked with `aria-required`
- Invalid fields use `aria-invalid`
- Groups use proper `role` attributes

## Performance

### Optimization Strategies

- **Memoization**: React.memo and useMemo for expensive computations
- **Lazy Loading**: Dynamic imports for large components
- **Efficient Updates**: Minimal re-renders on form state changes
- **Rule Evaluation**: O(fields + predicates) complexity

### Bundle Size

The form system is designed to be tree-shakeable and adds minimal bundle size to your application.

## Security Considerations

### Input Sanitization

All form inputs are validated and sanitized before submission:

```typescript
const sanitizedAnswers = sanitizeAnswers(properties, answers, visibleFields);
```

### File Upload Security

- File type validation
- Size limits (configurable)
- Virus scanning integration points
- Secure upload endpoints

### Anonymous Forms

When `allowAnonymous` is enabled:
- No authentication required
- Consider rate limiting
- Monitor for abuse (especially with file uploads)

## Deployment

### Environment Variables

No environment variables are required for basic functionality. The system uses:

- `NODE_ENV` for development features (debug info, etc.)
- `localStorage` for draft saving (client-side only)

### Production Considerations

1. **Backend Integration**: Replace in-memory repository
2. **File Storage**: Configure file upload destinations
3. **Rate Limiting**: Implement submission rate limits
4. **Monitoring**: Add analytics and error tracking
5. **Caching**: Cache form definitions for performance

## Troubleshooting

### Common Issues

**Forms not loading**
- Check repository implementation
- Verify form ID exists
- Check network connectivity

**Validation errors**
- Ensure field types match validation rules
- Check required field configurations
- Verify visibility rule logic

**Submission failures**
- Check repository `createSubmission` implementation
- Verify network connectivity
- Check form validation state

### Debug Mode

In development, forms show debug information:

```typescript
// Enable debug info in development
process.env.NODE_ENV === 'development'
```

## Contributing

### Adding New Features

1. **Domain Layer**: Add types and business logic
2. **Component Layer**: Create UI components
3. **Tests**: Add comprehensive test coverage
4. **Documentation**: Update README and inline docs

### Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Maintain test coverage above 90%

## License

This form system is part of the Curas application and follows the same licensing terms.
