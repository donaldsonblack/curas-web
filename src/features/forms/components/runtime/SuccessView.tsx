import { useEffect } from 'react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  ExternalLink, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { SuccessBehavior } from '../../domain/formTypes';

interface SuccessViewProps {
  success: SuccessBehavior;
  formTitle: string;
  onReset?: () => void;
  submissionId?: string;
}

export function SuccessView({ 
  success, 
  formTitle, 
  onReset,
  submissionId 
}: SuccessViewProps) {
  // Handle redirect after a short delay
  useEffect(() => {
    if (success.mode === 'redirect') {
      const timer = setTimeout(() => {
        window.location.href = success.url;
      }, 3000); // 3 second delay to show success message

      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-green-900 mb-2">
                Submission Successful!
              </h2>
              <p className="text-green-700">
                Thank you for completing "{formTitle}"
              </p>
            </div>

            {/* Custom Message or Redirect Info */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              {success.mode === 'message' ? (
                <p className="text-gray-700">{success.message}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    You will be redirected automatically in a few seconds...
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <ExternalLink className="h-4 w-4" />
                    <span>{success.url}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submission ID */}
            {submissionId && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  <div className="text-sm">
                    <strong>Submission ID:</strong> 
                    <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">
                      {submissionId}
                    </code>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex justify-center space-x-4 pt-4">
              {success.mode === 'redirect' && (
                <Button
                  onClick={() => window.location.href = success.url}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go Now
                </Button>
              )}
              
              {onReset && (
                <Button
                  variant="outline"
                  onClick={onReset}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Submit Another
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
