import { } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { FormBuilder } from '../components/builder/FormBuilder';

export function FormBuilderPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  if (!formId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The form you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/forms')}>
            Back to Forms
          </Button>
        </div>
      </div>
    );
  }

  const handlePreview = () => {
    // Open form in new tab for preview
    window.open(`/forms/${formId}`, '_blank');
  };

  const handleBack = () => {
    navigate('/forms');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation */}
      <div className="border-b bg-background px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forms
        </Button>
      </div>

      {/* Form Builder */}
      <div className="flex-1 overflow-hidden">
        <FormBuilder
          formId={formId}
          onPreview={handlePreview}
        />
      </div>
    </div>
  );
}
