import { } from 'react';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { FormFieldCard } from './FormFieldCard';
import type { FormProperty, FieldVisibility } from '../../domain/formTypes';

interface SortableFieldCardProps {
  property: FormProperty;
  visibility?: FieldVisibility;
  onUpdate: (property: FormProperty) => void;
  onDelete: (propertyId: string) => void;
  onEditLogic: (propertyId: string) => void;
}

function SortableFieldCard({
  property,
  visibility,
  onUpdate,
  onDelete,
  onEditLogic
}: SortableFieldCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FormFieldCard
        property={property}
        visibility={visibility}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEditLogic={onEditLogic}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

interface FormCanvasProps {
  properties: FormProperty[];
  visibility: FieldVisibility[];
  onReorderProperties: (properties: FormProperty[]) => void;
  onUpdateProperty: (property: FormProperty) => void;
  onDeleteProperty: (propertyId: string) => void;
  onEditLogic: (propertyId: string) => void;
}

export function FormCanvas({
  properties,
  visibility,
  onReorderProperties,
  onUpdateProperty,
  onDeleteProperty,
  onEditLogic
}: FormCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = properties.findIndex(p => p.id === active.id);
      const newIndex = properties.findIndex(p => p.id === over.id);

      const reorderedProperties = arrayMove(properties, oldIndex, newIndex);
      onReorderProperties(reorderedProperties);
    }
  };

  const getVisibilityForField = (fieldId: string): FieldVisibility | undefined => {
    return visibility.find(v => v.fieldId === fieldId);
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Form Canvas</CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag to reorder fields, click to edit properties
        </p>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No fields yet</h3>
            <p className="text-sm">
              Add fields from the palette to start building your form
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={properties.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {properties.map((property) => (
                  <SortableFieldCard
                    key={property.id}
                    property={property}
                    visibility={getVisibilityForField(property.id)}
                    onUpdate={onUpdateProperty}
                    onDelete={onDeleteProperty}
                    onEditLogic={onEditLogic}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}
