import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle,
  Info,
  X,
  Trash2,
  Plus
} from 'lucide-react';
import type {
  FieldVisibility,
  VisibilityRuleGroup,
  ShowPredicate,
  FormProperty,
  Comparator,
  RuleDiagnostic
} from '../../domain/formTypes';
import { getAvailableComparators, validateVisibilityGraph } from '../../domain/rules';

interface LogicEditorProps {
  fieldId: string;
  fieldLabel: string;
  visibility?: FieldVisibility;
  allProperties: FormProperty[];
  onSave: (visibility: FieldVisibility) => void;
  onClose: () => void;
}

export function LogicEditor({
  fieldId,
  fieldLabel,
  visibility,
  allProperties,
  onSave,
  onClose
}: LogicEditorProps) {
  const [groups, setGroups] = useState<VisibilityRuleGroup[]>(
    visibility?.groups || []
  );
  const [diagnostics, setDiagnostics] = useState<RuleDiagnostic[]>([]);

  // Get available source fields (exclude the current field to prevent self-reference)
  const availableFields = allProperties.filter(p => p.id !== fieldId);

  const addGroup = () => {
    setGroups([...groups, { predicates: [{ whenFieldId: '', comparator: 'equals', value: '' }] }]);
  };

  const removeGroup = (groupIndex: number) => {
    setGroups(groups.filter((_, i) => i !== groupIndex));
  };

  const addPredicate = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].predicates.push({
      whenFieldId: '',
      comparator: 'equals',
      value: ''
    });
    setGroups(newGroups);
  };

  const removePredicate = (groupIndex: number, predicateIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].predicates = newGroups[groupIndex].predicates.filter(
      (_, i) => i !== predicateIndex
    );
    setGroups(newGroups);
  };

  const updatePredicate = (
    groupIndex: number,
    predicateIndex: number,
    updates: Partial<ShowPredicate>
  ) => {
    const newGroups = [...groups];
    newGroups[groupIndex].predicates[groupIndex] = {
      ...newGroups[groupIndex].predicates[predicateIndex],
      ...updates
    };
    setGroups(newGroups);
  };

  const getFieldType = (fieldId: string): string => {
    const field = allProperties.find(p => p.id === fieldId);
    return field?.type || 'text';
  };

  const getFieldOptions = (fieldId: string) => {
    const field = allProperties.find(p => p.id === fieldId);
    return field?.options || [];
  };

  const handleSave = () => {
    const newVisibility: FieldVisibility = {
      fieldId,
      groups: groups.filter(group => 
        group.predicates.length > 0 && 
        group.predicates.every(p => p.whenFieldId && p.comparator)
      )
    };

    // Validate the rules
    const mockDefinition = {
      id: 'temp',
      title: 'temp',
      submitText: 'temp',
      success: { mode: 'message' as const, message: 'temp' },
      allowAnonymous: true,
      properties: allProperties,
      visibility: [newVisibility],
      backingCollectionId: 'temp'
    };

    const validation = validateVisibilityGraph(mockDefinition);
    setDiagnostics(validation.diagnostics);

    if (validation.isValid) {
      onSave(newVisibility);
    }
  };

  const renderPredicateValue = (
    predicate: ShowPredicate,
    groupIndex: number,
    predicateIndex: number
  ) => {
    const fieldType = getFieldType(predicate.whenFieldId);
    const fieldOptions = getFieldOptions(predicate.whenFieldId);

    if (predicate.comparator === 'is_set' || predicate.comparator === 'is_not_set') {
      return null; // No value needed for these comparators
    }

    if ((fieldType === 'select' || fieldType === 'multi_select') && fieldOptions.length > 0) {
      return (
        <Select
          value={predicate.value as string}
          onValueChange={(value) => updatePredicate(groupIndex, predicateIndex, { value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {fieldOptions.map(option => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={fieldType === 'number' ? 'number' : 'text'}
        value={predicate.value as string}
        onChange={(e) => updatePredicate(groupIndex, predicateIndex, { 
          value: fieldType === 'number' ? parseFloat(e.target.value) : e.target.value 
        })}
        placeholder="Enter value"
      />
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Visibility Logic: {fieldLabel}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Define when this field should be visible
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Diagnostics */}
        {diagnostics.length > 0 && (
          <div className="space-y-2">
            {diagnostics.map((diagnostic, index) => (
              <Alert key={index} variant={diagnostic.severity === 'error' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{diagnostic.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Logic Explanation */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This field will be visible when <strong>any</strong> of the rule groups below are true. 
            Within each group, <strong>all</strong> conditions must be met (AND logic). 
            Between groups, only one needs to be true (OR logic).
          </AlertDescription>
        </Alert>

        {/* Rule Groups */}
        <div className="space-y-4">
          {groups.map((group, groupIndex) => (
            <Card key={groupIndex} className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">
                    Group {groupIndex + 1} {groups.length > 1 && `(OR)`}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeGroup(groupIndex)}
                    disabled={groups.length === 1}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {group.predicates.map((predicate, predicateIndex) => (
                    <div key={predicateIndex} className="flex items-center space-x-2">
                      {predicateIndex > 0 && (
                        <Badge variant="secondary" className="text-xs">AND</Badge>
                      )}

                      {/* Field Selection */}
                      <div className="flex-1">
                        <Select
                          value={predicate.whenFieldId}
                          onValueChange={(value) => updatePredicate(groupIndex, predicateIndex, { whenFieldId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFields.map(field => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.label} ({field.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Comparator Selection */}
                      <div className="flex-1">
                        <Select
                          value={predicate.comparator}
                          onValueChange={(value) => updatePredicate(groupIndex, predicateIndex, { comparator: value as Comparator })}
                          disabled={!predicate.whenFieldId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Comparator" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableComparators(getFieldType(predicate.whenFieldId)).map(comp => (
                              <SelectItem key={comp} value={comp}>
                                {comp.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Value Input */}
                      <div className="flex-1">
                        {renderPredicateValue(predicate, groupIndex, predicateIndex)}
                      </div>

                      {/* Remove Predicate */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removePredicate(groupIndex, predicateIndex)}
                        disabled={group.predicates.length === 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addPredicate(groupIndex)}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Condition (AND)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Group Button */}
        <Button
          variant="outline"
          onClick={addGroup}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rule Group (OR)
        </Button>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={diagnostics.some(d => d.severity === 'error')}>
            Save Logic
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
