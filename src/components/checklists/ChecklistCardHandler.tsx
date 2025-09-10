import ChecklistCard, { type checklistCardProps } from "./ChecklistCard";

// This is the shape of the data that the ChecklistCard component expects.
// It's also the shape of the data that this handler receives.
export type { checklistCardProps as ChecklistItem };

interface ChecklistCardHandlerProps {
  items: checklistCardProps[];
}

/**
 * Renders a grid of ChecklistCards.
 */
export default function ChecklistCardHandler({
  items,
}: ChecklistCardHandlerProps) {
  return (
    <section className="flex w-full flex-col gap-4">
      {/* Grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}
      >
        {items.length === 0 ? (
          <div className="col-span-full gap-5 rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
            No checklists found.
          </div>
        ) : (
          items.map((it) => {
            // The `it` object already has the correct shape for the ChecklistCard.
            // We can spread its properties directly as props.
            return <ChecklistCard key={it.id} {...it} />;
          })
        )}
      </div>
    </section>
  );
}