import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { 
  Copy, 
  ExternalLink, 
  AlertTriangle,
  Check,
  Link,
  Code
} from 'lucide-react';
import type { FormDefinition } from '../../domain/formTypes';
import { useToast } from '../../../../hooks/useToast';

interface SharePanelProps {
  definition: FormDefinition;
}

export function SharePanel({ definition }: SharePanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const publicUrl = `${window.location.origin}/forms/${definition.id}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = () => {
    window.open(publicUrl, '_blank');
  };

  const hasFileUpload = definition.properties.some(p => p.type === 'files');
  const showAbuseWarning = definition.allowAnonymous && hasFileUpload;

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Share Form</CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your form with others
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warnings */}
        {showAbuseWarning && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Anonymous file uploads enabled. Consider the abuse risk.
            </AlertDescription>
          </Alert>
        )}

        {/* Form Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Form Status</span>
          <Badge variant="default">
            {definition.properties.length > 0 ? 'Ready' : 'Draft'}
          </Badge>
        </div>

        {/* Share Options */}
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">
              <Link className="h-4 w-4 mr-1" />
              Link
            </TabsTrigger>
            <TabsTrigger value="embed">
              <Code className="h-4 w-4 mr-1" />
              Embed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div>
              <Label htmlFor="public-url">Public URL</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="public-url"
                  value={publicUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(publicUrl, 'Link')}
                >
                  {copied === 'Link' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={openInNewTab}
              className="w-full"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div>
              <Label htmlFor="embed-code">Embed Code</Label>
              <Textarea
                id="embed-code"
                value={embedCode}
                readOnly
                rows={4}
                className="mt-1 font-mono text-xs"
              />
            </div>

            <Button
              onClick={() => copyToClipboard(embedCode, 'Embed code')}
              className="w-full"
              variant="outline"
            >
              {copied === 'Embed code' ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Copy Embed Code
            </Button>

            <Alert>
              <AlertDescription className="text-xs">
                Paste this code into any website to embed your form
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Form Info */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Form ID: <code className="bg-muted px-1 rounded">{definition.id}</code></div>
            <div>Collection: <code className="bg-muted px-1 rounded">{definition.backingCollectionId}</code></div>
            <div>Anonymous: {definition.allowAnonymous ? 'Allowed' : 'Disabled'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
