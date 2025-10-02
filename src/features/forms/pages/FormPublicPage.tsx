import { } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { FormRuntime } from '../components/runtime/FormRuntime';

export function FormPublicPage() {
  const { formId } = useParams<{ formId: string }>();

  if (!formId) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <Alert variant="destructive">
            <AlertDescription>
              <div className="space-y-4">
                <h2 className="font-semibold">Form Not Found</h2>
                <p>The form you're looking for doesn't exist or is no longer available.</p>
                <Button asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleSubmissionSuccess = (submissionId: string) => {
    console.log('Form submitted successfully:', submissionId);
    // Could trigger analytics, notifications, etc.
  };

  const handleSubmissionError = (error: string) => {
    console.error('Form submission failed:', error);
    // Could trigger error tracking, notifications, etc.
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">
                Public Form
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={`/forms/${formId}/builder`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Edit Form
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <FormRuntime
          formId={formId}
          allowDrafts={true}
          onSubmissionSuccess={handleSubmissionSuccess}
          onSubmissionError={handleSubmissionError}
        />
      </div>

      {/* Footer */}
      <div className="bg-background border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Powered by{' '}
              <Link to="/" className="hover:underline font-medium">
                Curas Forms
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
