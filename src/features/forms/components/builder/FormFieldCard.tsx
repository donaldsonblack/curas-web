import { useState } from 'react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Switch } from '../../../../components/ui/switch';
import { Badge } from '../../../../components/ui/badge';
import { 
  GripVertical, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  EyeOff,
  Settings
} from 'lucide-react';
import type { FormProperty, FieldVisibility } from '../../domain/formTypes';
interface FormFieldCardProps {
  property: FormProperty;
  visibility?: FieldVisibility;
  onUpdate: (property: FormProperty) => void;
  onDelete: (propertyId: string) => void;
  onEditLogic: (propertyId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function FormFieldCard({
  property,
  visibility,
  onUpdate,
  onDelete,
  onEditLogic,
  isDragging = false,
  dragHandleProps
}: FormFieldCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    label: property.label,
    description: property.description || '',
    placeholder: property.placeholder || '',
    required: property.required
  });

  const hasVisibilityRules = visibility && visibility.groups.length > 0;

  const handleSave = () => {
    onUpdate({
      ...property,
      label: editForm.label,
      description: editForm.description || undefined,
      placeholder: editForm.placeholder || undefined,
      required: editForm.required
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      label: property.label,
      description: property.description || '',
      placeholder: property.placeholder || '',
      required: property.required
    });
    setIsEditing(false);
  };

  const getVisibilityDescription = (): string => {
    if (!hasVisibilityRules) return '';
    
    const groupDescriptions = visibility!.groups.map(group => {
      const predicateDescriptions = group.predicates.map(predicate => {
        return `${predicate.whenFieldId} ${predicate.comparator} ${predicate.value}`;
      });
      return predicateDescriptions.join(' AND ');
    });
    
    return `Shown when: ${groupDescriptions.join(' OR ')}`;
  };

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Drag Handle */}
          <div 
            {...dragHandleProps}
            className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`label-${property.id}`}>Label</Label>
                  <Input
                    id={`label-${property.id}`}
                    value={editForm.label}
                    onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                    placeholder="Field label"
                  />
                </div>

                <div>
                  <Label htmlFor={`description-${property.id}`}>Description</Label>
                  <Textarea
                    id={`description-${property.id}`}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Optional field description"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor={`placeholder-${property.id}`}>Placeholder</Label>
                  <Input
                    id={`placeholder-${property.id}`}
                    value={editForm.placeholder}
                    onChange={(e) => setEditForm({ ...editForm, placeholder: e.target.value })}
                    placeholder="Placeholder text"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`required-${property.id}`}
                    checked={editForm.required}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, required: checked })}
                  />
                  <Label htmlFor={`required-${property.id}`}>Required field</Label>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSave}>
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-sm">{property.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {property.type}
                  </Badge>
                  {property.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                  {hasVisibilityRules && (
                    <Badge variant="outline" className="text-xs">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Conditional
                    </Badge>
                  )}
                </div>

                {property.description && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {property.description}
                  </p>
                )}

                {property.placeholder && (
                  <p className="text-xs text-muted-foreground italic mb-2">
                    Placeholder: "{property.placeholder}"
                  </p>
                )}

                <p className="text-xs text-muted-foreground mb-2">
                  Key: <code className="bg-muted px-1 rounded">{property.key}</code>
                </p>

                {hasVisibilityRules && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                    <p className="text-xs text-blue-700">
                      {getVisibilityDescription()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex-shrink-0 flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                title="Edit field"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEditLogic(property.id)}
                title="Edit visibility logic"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(property.id)}
                title="Delete field"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
