import { } from 'react';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, File } from 'lucide-react';
import type { FormProperty } from '../../domain/formTypes';

interface FieldRendererProps {
  property: FormProperty;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}

export function FieldRenderer({ 
  property, 
  value, 
  error, 
  onChange, 
  disabled = false 
}: FieldRendererProps) {
  const fieldId = `field-${property.id}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const descriptionId = property.description ? `${fieldId}-description` : undefined;

  const renderField = () => {
    switch (property.type) {
      case 'text':
        return (
          <Input
            id={fieldId}
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            disabled={disabled}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
          />
        );

      case 'email':
        return (
          <Input
            id={fieldId}
            type="email"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            disabled={disabled}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
          />
        );

      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            value={(value as number) || ''}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder={property.placeholder}
            disabled={disabled}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
          />
        );

      case 'url':
        return (
          <Input
            id={fieldId}
            type="url"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            disabled={disabled}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
          />
        );

      case 'phone':
        return (
          <Input
            id={fieldId}
            type="tel"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            disabled={disabled}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
          />
        );

      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
          />
        );

      case 'select':
        return (
          <Select
            value={(value as string) || ''}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={fieldId}
              aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
              aria-invalid={!!error}
            >
              <SelectValue placeholder={property.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi_select':
        const selectedValues = (value as string[]) || [];
        return (
          <div 
            className="space-y-2"
            role="group"
            aria-labelledby={`${fieldId}-label`}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
          >
            {property.options?.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldId}-${option.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange([...selectedValues, option.value]);
                      } else {
                        onChange(selectedValues.filter(v => v !== option.value));
                      }
                    }}
                    disabled={disabled}
                  />
                  <Label 
                    htmlFor={`${fieldId}-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case 'files':
        const files = (value as File[]) || [];
        return (
          <div className="space-y-2">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <input
                id={fieldId}
                type="file"
                multiple
                onChange={(e) => {
                  const fileList = e.target.files;
                  if (fileList) {
                    onChange(Array.from(fileList));
                  }
                }}
                disabled={disabled}
                className="hidden"
                aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
              />
              <Label
                htmlFor={fieldId}
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {property.placeholder || 'Click to upload files'}
                </span>
                <span className="text-xs text-muted-foreground">
                  or drag and drop
                </span>
              </Label>
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(file.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const newFiles = files.filter((_, i) => i !== index);
                        onChange(newFiles);
                      }}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Alert variant="destructive">
            <AlertDescription>
              Unsupported field type: {property.type}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={fieldId}
        id={`${fieldId}-label`}
        className="text-sm font-medium"
      >
        {property.label}
        {property.required && (
          <span className="text-destructive ml-1" aria-label="required">*</span>
        )}
      </Label>

      {property.description && (
        <p 
          id={descriptionId}
          className="text-xs text-muted-foreground"
        >
          {property.description}
        </p>
      )}

      {renderField()}

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription id={errorId} className="text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
