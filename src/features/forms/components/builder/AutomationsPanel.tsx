import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trash2, 
  Settings, 
  Mail, 
  Webhook, 
  User, 
  Info
} from 'lucide-react';
import type { AutomationAction, FormDefinition } from '../../domain/formTypes';

interface AutomationsPanelProps {
  definition: FormDefinition;
  onUpdate: (updates: Partial<FormDefinition>) => void;
}

const AUTOMATION_TYPES = [
  {
    type: 'set_property',
    label: 'Set Property',
    icon: Settings,
    description: 'Set a property value on the submission'
  },
  {
    type: 'assign_owner',
    label: 'Assign Owner',
    icon: User,
    description: 'Assign the submission to a user'
  },
  {
    type: 'webhook',
    label: 'Webhook',
    icon: Webhook,
    description: 'Send data to an external URL'
  },
  {
    type: 'notify',
    label: 'Notification',
    icon: Mail,
    description: 'Send email or Slack notification'
  }
] as const;

export function AutomationsPanel({ definition, onUpdate }: AutomationsPanelProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newAutomation, setNewAutomation] = useState<Partial<AutomationAction> | null>(null);

  const automations = definition.automations || [];

  const addAutomation = (type: AutomationAction['type']) => {
    switch (type) {
      case 'set_property':
        setNewAutomation({ type, key: '', value: '' });
        break;
      case 'assign_owner':
        setNewAutomation({ type, userId: '' });
        break;
      case 'webhook':
        setNewAutomation({ type, url: '', payload: {} });
        break;
      case 'notify':
        setNewAutomation({ type, channel: 'email', to: '', template: '' });
        break;
    }
  };

  const saveAutomation = () => {
    if (!newAutomation) return;

    const updatedAutomations = [...automations, newAutomation as AutomationAction];
    onUpdate({ automations: updatedAutomations });
    setNewAutomation(null);
  };

  const deleteAutomation = (index: number) => {
    const updatedAutomations = automations.filter((_, i) => i !== index);
    onUpdate({ automations: updatedAutomations });
  };

  const updateAutomation = (index: number, updates: Partial<AutomationAction>) => {
    const updatedAutomations = [...automations];
    updatedAutomations[index] = { ...updatedAutomations[index], ...updates } as AutomationAction;
    onUpdate({ automations: updatedAutomations });
  };

  const renderAutomationForm = (automation: Partial<AutomationAction>, isNew: boolean = false) => {
    const handleUpdate = (updates: Partial<AutomationAction>) => {
      if (isNew) {
        setNewAutomation({ ...automation, ...updates });
      } else {
        const index = editingIndex!;
        updateAutomation(index, updates);
      }
    };

    switch (automation.type) {
      case 'set_property':
        return (
          <div className="space-y-3">
            <div>
              <Label>Property Key</Label>
              <Input
                value={(automation as any).key || ''}
                onChange={(e) => handleUpdate({ key: e.target.value })}
                placeholder="property_name"
              />
            </div>
            <div>
              <Label>Value</Label>
              <Input
                value={(automation as any).value || ''}
                onChange={(e) => handleUpdate({ value: e.target.value })}
                placeholder="property value"
              />
            </div>
          </div>
        );

      case 'assign_owner':
        return (
          <div>
            <Label>User ID</Label>
            <Input
              value={(automation as any).userId || ''}
              onChange={(e) => handleUpdate({ userId: e.target.value })}
              placeholder="user@example.com"
            />
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-3">
            <div>
              <Label>Webhook URL</Label>
              <Input
                type="url"
                value={(automation as any).url || ''}
                onChange={(e) => handleUpdate({ url: e.target.value })}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div>
              <Label>Payload (JSON)</Label>
              <Textarea
                value={JSON.stringify((automation as any).payload || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const payload = JSON.parse(e.target.value);
                    handleUpdate({ payload });
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder='{"key": "value"}'
                rows={3}
              />
            </div>
          </div>
        );

      case 'notify':
        return (
          <div className="space-y-3">
            <div>
              <Label>Channel</Label>
              <Select
                value={(automation as any).channel || 'email'}
                onValueChange={(value) => handleUpdate({ channel: value as 'email' | 'slack' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recipient</Label>
              <Input
                value={(automation as any).to || ''}
                onChange={(e) => handleUpdate({ to: e.target.value })}
                placeholder="user@example.com or #channel"
              />
            </div>
            <div>
              <Label>Template</Label>
              <Textarea
                value={(automation as any).template || ''}
                onChange={(e) => handleUpdate({ template: e.target.value })}
                placeholder="New submission from {{name}}"
                rows={2}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getAutomationIcon = (type: AutomationAction['type']) => {
    const config = AUTOMATION_TYPES.find(t => t.type === type);
    return config?.icon || Settings;
  };

  const getAutomationLabel = (type: AutomationAction['type']) => {
    const config = AUTOMATION_TYPES.find(t => t.type === type);
    return config?.label || type;
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Automations</CardTitle>
        <p className="text-sm text-muted-foreground">
          Actions to run after form submission
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Automations run after successful form submission. For demo purposes, they will log to console and show toasts.
          </AlertDescription>
        </Alert>

        {/* Existing Automations */}
        {automations.map((automation, index) => {
          const IconComponent = getAutomationIcon(automation.type);
          const isEditing = editingIndex === index;

          return (
            <Card key={index} className="border-dashed">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {getAutomationLabel(automation.type)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {automation.type}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAutomation(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    {renderAutomationForm(automation)}
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setEditingIndex(null)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    {automation.type === 'set_property' && `Set ${(automation as any).key} = ${(automation as any).value}`}
                    {automation.type === 'assign_owner' && `Assign to ${(automation as any).userId}`}
                    {automation.type === 'webhook' && `POST to ${(automation as any).url}`}
                    {automation.type === 'notify' && `${(automation as any).channel} to ${(automation as any).to}`}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* New Automation Form */}
        {newAutomation && (
          <Card className="border-dashed border-primary">
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="default">New Automation</Badge>
                  <span className="text-sm font-medium">
                    {getAutomationLabel(newAutomation.type!)}
                  </span>
                </div>

                {renderAutomationForm(newAutomation, true)}

                <div className="flex space-x-2">
                  <Button size="sm" onClick={saveAutomation}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setNewAutomation(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Automation Buttons */}
        {!newAutomation && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Add Automation</Label>
            <div className="grid grid-cols-2 gap-2">
              {AUTOMATION_TYPES.map((config) => {
                const IconComponent = config.icon;
                return (
                  <Button
                    key={config.type}
                    size="sm"
                    variant="outline"
                    onClick={() => addAutomation(config.type)}
                    className="h-auto p-2 flex flex-col items-center space-y-1"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{config.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
