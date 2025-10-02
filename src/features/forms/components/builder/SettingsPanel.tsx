import { } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { FormDefinition, SuccessBehavior } from '../../domain/formTypes';

interface SettingsPanelProps {
  definition: FormDefinition;
  onUpdate: (updates: Partial<FormDefinition>) => void;
}

export function SettingsPanel({ definition, onUpdate }: SettingsPanelProps) {
  const handleSuccessModeChange = (mode: 'message' | 'redirect') => {
    const newSuccess: SuccessBehavior = mode === 'message' 
      ? { mode: 'message', message: definition.success.mode === 'message' ? definition.success.message : 'Thank you for your submission!' }
      : { mode: 'redirect', url: definition.success.mode === 'redirect' ? definition.success.url : 'https://example.com/thank-you' };
    
    onUpdate({ success: newSuccess });
  };

  const handleSuccessValueChange = (value: string) => {
    const newSuccess: SuccessBehavior = definition.success.mode === 'message'
      ? { mode: 'message', message: value }
      : { mode: 'redirect', url: value };
    
    onUpdate({ success: newSuccess });
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Form Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure form behavior and appearance
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={definition.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter form title"
            />
          </div>

          <div>
            <Label htmlFor="form-intro">Introduction Text</Label>
            <Textarea
              id="form-intro"
              value={definition.intro || ''}
              onChange={(e) => onUpdate({ intro: e.target.value })}
              placeholder="Optional introduction text"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="submit-text">Submit Button Text</Label>
            <Input
              id="submit-text"
              value={definition.submitText}
              onChange={(e) => onUpdate({ submitText: e.target.value })}
              placeholder="Submit"
            />
          </div>
        </div>

        <Separator />

        {/* Success Behavior */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="success-mode">After Submission</Label>
            <Select
              value={definition.success.mode}
              onValueChange={(value: 'message' | 'redirect') => handleSuccessModeChange(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="message">Show Message</SelectItem>
                <SelectItem value="redirect">Redirect to URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="success-value">
              {definition.success.mode === 'message' ? 'Success Message' : 'Redirect URL'}
            </Label>
            {definition.success.mode === 'message' ? (
              <Textarea
                id="success-value"
                value={definition.success.message}
                onChange={(e) => handleSuccessValueChange(e.target.value)}
                placeholder="Thank you for your submission!"
                rows={3}
              />
            ) : (
              <Input
                id="success-value"
                type="url"
                value={definition.success.url}
                onChange={(e) => handleSuccessValueChange(e.target.value)}
                placeholder="https://example.com/thank-you"
              />
            )}
          </div>
        </div>

        <Separator />

        {/* Access Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-anonymous">Allow Anonymous Submissions</Label>
              <p className="text-xs text-muted-foreground">
                Allow users to submit without logging in
              </p>
            </div>
            <Switch
              id="allow-anonymous"
              checked={definition.allowAnonymous}
              onCheckedChange={(checked) => onUpdate({ allowAnonymous: checked })}
            />
          </div>
        </div>

        <Separator />

        {/* Collection Settings */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="collection-id">Backing Collection ID</Label>
            <Input
              id="collection-id"
              value={definition.backingCollectionId}
              onChange={(e) => onUpdate({ backingCollectionId: e.target.value })}
              placeholder="collection-id"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The collection where form submissions will be stored
            </p>
          </div>
        </div>

        {/* Form Stats */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Fields: {definition.properties.length}</div>
            <div>Visibility Rules: {definition.visibility.length}</div>
            <div>Automations: {definition.automations?.length || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
