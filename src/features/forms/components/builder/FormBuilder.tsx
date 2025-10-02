import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Share,
  Zap
} from 'lucide-react';
import { FieldPalette } from './FieldPalette';
import { FormCanvas } from './FormCanvas';
import { LogicEditor } from './LogicEditor';
import { SettingsPanel } from './SettingsPanel';
import { SharePanel } from './SharePanel';
import { AutomationsPanel } from './AutomationsPanel';
import type { 
  FormDefinition, 
  FormProperty, 
  PropertyType, 
  FieldVisibility,
  RuleDiagnostic
} from '../../domain/formTypes';
import { validateVisibilityGraph } from '../../domain/rules';
import { useFormRepository } from '../../api/FormRepository';
import { useToast } from '@/hooks/useToast';

interface FormBuilderProps {
  formId: string;
  onPreview?: () => void;
}

export function FormBuilder({ formId, onPreview }: FormBuilderProps) {
  const [definition, setDefinition] = useState<FormDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingLogicField, setEditingLogicField] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<RuleDiagnostic[]>([]);
  
  const repository = useFormRepository();
  const { toast } = useToast();

  // Load form definition
  useEffect(() => {
    const loadForm = async () => {
      try {
        const form = await repository.getForm(formId);
        setDefinition(form);
        validateForm(form);
      } catch (error) {
        console.error('Failed to load form:', error);
        toast({
          title: "Error",
          description: "Failed to load form definition",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId, repository, toast]);

  const validateForm = (form: FormDefinition) => {
    const validation = validateVisibilityGraph(form);
    setDiagnostics(validation.diagnostics);
  };

  const saveForm = async () => {
    if (!definition) return;

    setSaving(true);
    try {
      await repository.saveForm(definition);
      toast({
        title: "Saved",
        description: "Form definition saved successfully",
      });
    } catch (error) {
      console.error('Failed to save form:', error);
      toast({
        title: "Error",
        description: "Failed to save form definition",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateDefinition = (updates: Partial<FormDefinition>) => {
    if (!definition) return;
    
    const updated = { ...definition, ...updates };
    setDefinition(updated);
    validateForm(updated);
  };

  const addField = (type: PropertyType) => {
    if (!definition) return;

    const usedKeys = new Set(definition.properties.map(p => p.key));
    let baseKey = type;
    let counter = 1;
    let key: string = baseKey;
    
    while (usedKeys.has(key)) {
      key = `${baseKey}_${counter}`;
      counter++;
    }

    const newProperty: FormProperty = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      key,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      ...(type === 'select' || type === 'multi_select' ? {
        options: [
          { id: 'option-1', label: 'Option 1', value: 'option1' },
          { id: 'option-2', label: 'Option 2', value: 'option2' }
        ]
      } : {})
    };

    updateDefinition({
      properties: [...definition.properties, newProperty]
    });
  };

  const updateProperty = (property: FormProperty) => {
    if (!definition) return;

    const updatedProperties = definition.properties.map(p => 
      p.id === property.id ? property : p
    );

    updateDefinition({ properties: updatedProperties });
  };

  const deleteProperty = (propertyId: string) => {
    if (!definition) return;

    const updatedProperties = definition.properties.filter(p => p.id !== propertyId);
    const updatedVisibility = definition.visibility.filter(v => v.fieldId !== propertyId);

    updateDefinition({
      properties: updatedProperties,
      visibility: updatedVisibility
    });
  };

  const reorderProperties = (properties: FormProperty[]) => {
    updateDefinition({ properties });
  };

  const updateVisibility = (visibility: FieldVisibility) => {
    if (!definition) return;

    const existingIndex = definition.visibility.findIndex(v => v.fieldId === visibility.fieldId);
    let updatedVisibility: FieldVisibility[];

    if (existingIndex >= 0) {
      updatedVisibility = [...definition.visibility];
      updatedVisibility[existingIndex] = visibility;
    } else {
      updatedVisibility = [...definition.visibility, visibility];
    }

    // Remove empty visibility rules
    updatedVisibility = updatedVisibility.filter(v => v.groups.length > 0);

    updateDefinition({ visibility: updatedVisibility });
    setEditingLogicField(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!definition) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load form definition. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const usedKeys = new Set(definition.properties.map(p => p.key));
  const hasErrors = diagnostics.some(d => d.severity === 'error');
  const hasWarnings = diagnostics.some(d => d.severity === 'warning');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold">{definition.title}</h1>
            <p className="text-sm text-muted-foreground">Form Builder</p>
          </div>
          
          {/* Status Badges */}
          <div className="flex space-x-2">
            {hasErrors && (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Errors
              </Badge>
            )}
            {hasWarnings && (
              <Badge variant="outline">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Warnings
              </Badge>
            )}
            {!hasErrors && !hasWarnings && (
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {onPreview && (
            <Button variant="outline" onClick={onPreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
          <Button onClick={saveForm} disabled={saving || hasErrors}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Diagnostics */}
      {diagnostics.length > 0 && (
        <div className="p-4 border-b bg-muted/50">
          <div className="space-y-2">
            {diagnostics.map((diagnostic, index) => (
              <Alert key={index} variant={diagnostic.severity === 'error' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{diagnostic.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Field Palette */}
        <div className="w-80 border-r bg-muted/30 p-4 overflow-y-auto">
          <FieldPalette onAddField={addField} usedKeys={usedKeys} />
        </div>

        {/* Center - Form Canvas */}
        <div className="flex-1 p-4 overflow-y-auto">
          <FormCanvas
            properties={definition.properties}
            visibility={definition.visibility}
            onReorderProperties={reorderProperties}
            onUpdateProperty={updateProperty}
            onDeleteProperty={deleteProperty}
            onEditLogic={setEditingLogicField}
          />
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-80 border-l bg-muted/30 overflow-y-auto">
          <Tabs defaultValue="settings" className="h-full">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="share">
                  <Share className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="automations">
                  <Zap className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4">
              <TabsContent value="settings" className="mt-0">
                <SettingsPanel definition={definition} onUpdate={updateDefinition} />
              </TabsContent>
              
              <TabsContent value="share" className="mt-0">
                <SharePanel definition={definition} />
              </TabsContent>
              
              <TabsContent value="automations" className="mt-0">
                <AutomationsPanel definition={definition} onUpdate={updateDefinition} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Logic Editor Modal */}
      {editingLogicField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <LogicEditor
              fieldId={editingLogicField}
              fieldLabel={definition.properties.find(p => p.id === editingLogicField)?.label || ''}
              visibility={definition.visibility.find(v => v.fieldId === editingLogicField)}
              allProperties={definition.properties}
              onSave={updateVisibility}
              onClose={() => setEditingLogicField(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
