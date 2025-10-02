import { } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  Type, 
  Mail, 
  Hash, 
  ChevronDown, 
  CheckSquare, 
  Calendar, 
  Upload, 
  Link, 
  Phone,
  Plus
} from 'lucide-react';
import type { PropertyType, FieldPaletteItem } from '../../domain/formTypes';

const FIELD_PALETTE_ITEMS: FieldPaletteItem[] = [
  {
    type: 'text',
    label: 'Text',
    icon: 'Type',
    description: 'Single line text input'
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    description: 'Email address with validation'
  },
  {
    type: 'number',
    label: 'Number',
    icon: 'Hash',
    description: 'Numeric input with validation'
  },
  {
    type: 'select',
    label: 'Select',
    icon: 'ChevronDown',
    description: 'Single choice dropdown'
  },
  {
    type: 'multi_select',
    label: 'Multi-Select',
    icon: 'CheckSquare',
    description: 'Multiple choice selection'
  },
  {
    type: 'date',
    label: 'Date',
    icon: 'Calendar',
    description: 'Date picker input'
  },
  {
    type: 'files',
    label: 'File Upload',
    icon: 'Upload',
    description: 'File upload with validation'
  },
  {
    type: 'url',
    label: 'URL',
    icon: 'Link',
    description: 'URL input with validation'
  },
  {
    type: 'phone',
    label: 'Phone',
    icon: 'Phone',
    description: 'Phone number input'
  }
];

const ICON_MAP = {
  Type,
  Mail,
  Hash,
  ChevronDown,
  CheckSquare,
  Calendar,
  Upload,
  Link,
  Phone
};

interface FieldPaletteProps {
  onAddField: (type: PropertyType) => void;
  usedKeys: Set<string>;
}

export function FieldPalette({ onAddField, usedKeys }: FieldPaletteProps) {

  const handleAddField = (type: PropertyType) => {
    onAddField(type);
  };

  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Field Palette</CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag or click to add fields to your form
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {FIELD_PALETTE_ITEMS.map((item) => {
          const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
          
          return (
            <Button
              key={item.type}
              variant="outline"
              className="w-full justify-start h-auto p-3 hover:bg-accent"
              onClick={() => handleAddField(item.type)}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="flex-shrink-0">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          );
        })}
        
        {usedKeys.size > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              <strong>Used keys:</strong> {Array.from(usedKeys).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
