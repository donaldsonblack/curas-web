import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '../../../../components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '../../../../components/ui/badge';
import { Skeleton } from '../../../../components/ui/skeleton';
import { 
  AlertTriangle,
  Lock,
  Eye
} from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';
import { SubmitBar } from './SubmitBar';
import { SuccessView } from './SuccessView';
import { ErrorBanner, getErrorType } from './ErrorBanner';
import type { 
  FormDefinition, 
  Submission,
  ValidationError
} from '../../domain/formTypes';
import { 
  evaluateVisibility, 
  clearHiddenFieldValues 
} from '../../domain/rules';
import { 
  validateForm, 
  sanitizeAnswers,
  getFieldError 
} from '../../domain/validation';
import { useFormRepository } from '../../api/FormRepository';
import { useToast } from '../../../../hooks/useToast';

interface FormRuntimeProps {
  formId: string;
  allowDrafts?: boolean;
  onSubmissionSuccess?: (submissionId: string) => void;
  onSubmissionError?: (error: string) => void;
}

type FormState = 'loading' | 'ready' | 'submitting' | 'success' | 'error';

export function FormRuntime({ 
  formId, 
  allowDrafts = true,
  onSubmissionSuccess,
  onSubmissionError
}: FormRuntimeProps) {
  const [state, setState] = useState<FormState>('loading');
  const [definition, setDefinition] = useState<FormDefinition | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const repository = useFormRepository();
  const { toast } = useToast();

  // Load form definition
  useEffect(() => {
    const loadForm = async () => {
      try {
        setState('loading');
        const form = await repository.getForm(formId);
        setDefinition(form);
        
        // Load draft if available
        if (allowDrafts) {
          loadDraft(form.id);
        }
        
        setState('ready');
      } catch (error) {
        console.error('Failed to load form:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load form');
        setState('error');
      }
    };

    loadForm();
  }, [formId, repository, allowDrafts]);

  // Load draft from localStorage
  const loadDraft = useCallback((formId: string) => {
    try {
      const draftKey = `form:${formId}:draft`;
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setAnswers(parsedDraft);
        toast({
          title: "Draft loaded",
          description: "Your previous progress has been restored",
        });
      }
    } catch (error) {
      console.warn('Failed to load draft:', error);
    }
  }, [toast]);

  // Save draft to localStorage
  const saveDraft = useCallback((formId: string, answers: Record<string, unknown>) => {
    if (!allowDrafts) return;
    
    try {
      const draftKey = `form:${formId}:draft`;
      localStorage.setItem(draftKey, JSON.stringify(answers));
    } catch (error) {
      console.warn('Failed to save draft:', error);
    }
  }, [allowDrafts]);

  // Clear draft from localStorage
  const clearDraft = useCallback((formId: string) => {
    if (!allowDrafts) return;
    
    try {
      const draftKey = `form:${formId}:draft`;
      localStorage.removeItem(draftKey);
    } catch (error) {
      console.warn('Failed to clear draft:', error);
    }
  }, [allowDrafts]);

  // Calculate visible fields
  const visibleFields = definition ? evaluateVisibility(definition, answers) : new Set<string>();

  // Update answers and validate
  const updateAnswer = useCallback((propertyKey: string, value: unknown) => {
    if (!definition) return;

    const newAnswers = { ...answers, [propertyKey]: value };
    
    // Clear hidden field values
    const clearedAnswers = clearHiddenFieldValues(
      newAnswers,
      visibleFields,
      definition.properties.map(p => p.key)
    );
    
    setAnswers(clearedAnswers);
    
    // Validate form
    const validation = validateForm(definition.properties, clearedAnswers, visibleFields);
    setErrors(validation.errors);
    
    // Save draft
    saveDraft(definition.id, clearedAnswers);
  }, [definition, answers, visibleFields, saveDraft]);

  // Submit form
  const handleSubmit = async () => {
    if (!definition || state !== 'ready') return;

    // Final validation
    const validation = validateForm(definition.properties, answers, visibleFields);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setState('submitting');
    setSubmitError(null);

    try {
      // Sanitize answers
      const sanitizedAnswers = sanitizeAnswers(definition.properties, answers, visibleFields);
      
      // Create submission
      const submission: Submission = {
        formId: definition.id,
        answers: sanitizedAnswers,
        meta: {
          anonymous: definition.allowAnonymous,
          userId: undefined, // Would be set by auth system
          ts: Date.now()
        }
      };

      const result = await repository.createSubmission(submission);
      setSubmissionId(result.id);
      
      // Clear draft
      clearDraft(definition.id);
      
      setState('success');
      
      // Notify parent
      onSubmissionSuccess?.(result.id);
      
      toast({
        title: "Success!",
        description: "Your form has been submitted successfully",
      });
      
    } catch (error) {
      console.error('Failed to submit form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setSubmitError(errorMessage);
      setState('ready');
      
      // Notify parent
      onSubmissionError?.(errorMessage);
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Reset form
  const handleReset = () => {
    setAnswers({});
    setErrors([]);
    setSubmissionId(null);
    setSubmitError(null);
    setState('ready');
    
    if (definition) {
      clearDraft(definition.id);
    }
  };

  // Retry loading
  const retryLoad = () => {
    setLoadError(null);
    // Trigger reload by changing key
    window.location.reload();
  };

  // Loading state
  if (state === 'loading') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (state === 'error' || !definition) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorBanner
          error={loadError || 'Failed to load form'}
          type={getErrorType(loadError)}
          onRetry={retryLoad}
        />
      </div>
    );
  }

  // Success state
  if (state === 'success') {
    return (
      <SuccessView
        success={definition.success}
        formTitle={definition.title}
        submissionId={submissionId || undefined}
        onReset={handleReset}
      />
    );
  }

  // Main form state
  const visibleProperties = definition.properties.filter(p => visibleFields.has(p.id));
  const isValid = errors.length === 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Form Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{definition.title}</h1>
              {definition.intro && (
                <p className="text-muted-foreground mt-2">{definition.intro}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {definition.allowAnonymous ? (
                <Badge variant="secondary">
                  <Eye className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge variant="outline">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Submit Error */}
      {submitError && (
        <ErrorBanner
          error={submitError}
          type={getErrorType(submitError)}
          onRetry={handleSubmit}
          onDismiss={() => setSubmitError(null)}
          retryLabel="Try Again"
        />
      )}

      {/* Form Fields */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {visibleProperties.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No fields are currently visible. This may be due to conditional logic.
                </AlertDescription>
              </Alert>
            ) : (
              visibleProperties.map((property) => (
                <FieldRenderer
                  key={property.id}
                  property={property}
                  value={answers[property.key]}
                  error={getFieldError(errors, property.id)}
                  onChange={(value) => updateAnswer(property.key, value)}
                  disabled={state === 'submitting'}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Bar */}
      <SubmitBar
        submitText={definition.submitText}
        isValid={isValid}
        isSubmitting={state === 'submitting'}
        errors={errors}
        onSubmit={handleSubmit}
        disabled={visibleProperties.length === 0}
      />

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <details className="text-xs">
              <summary className="cursor-pointer font-medium mb-2">Debug Info</summary>
              <div className="space-y-2 text-muted-foreground">
                <div>Visible Fields: {Array.from(visibleFields).join(', ')}</div>
                <div>Answers: {JSON.stringify(answers, null, 2)}</div>
                <div>Errors: {errors.length}</div>
              </div>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
