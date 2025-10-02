import { } from 'react';
import { Button } from '../../../../components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '../../../../components/ui/badge';
import { 
  Send, 
  AlertTriangle, 
  Loader2,
  CheckCircle 
} from 'lucide-react';
import type { ValidationError } from '../../domain/formTypes';

interface SubmitBarProps {
  submitText: string;
  isValid: boolean;
  isSubmitting: boolean;
  errors: ValidationError[];
  onSubmit: () => void;
  disabled?: boolean;
}

export function SubmitBar({
  submitText,
  isValid,
  isSubmitting,
  errors,
  onSubmit,
  disabled = false
}: SubmitBarProps) {
  const canSubmit = isValid && !isSubmitting && !disabled;
  const hasErrors = errors.length > 0;

  return (
    <div className="space-y-4">
      {/* Error Summary */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                Please fix the following errors before submitting:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isValid ? (
            <Badge variant="default" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Ready to submit
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {errors.length} error{errors.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          size="lg"
          className="min-w-32"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {submitText}
            </>
          )}
        </Button>
      </div>

      {/* Submission Status */}
      {isSubmitting && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Please wait while we process your submission...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
