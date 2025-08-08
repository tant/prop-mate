import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { PropsWithChildren } from "react";

interface PropertyFormCardProps {
  title: string;
  collapsible?: boolean;
  triggerAriaLabel?: string;
}

export function PropertyFormCard({ title, collapsible = true, triggerAriaLabel = "Mở/đóng", children }: PropsWithChildren<PropertyFormCardProps>) {
  if (!collapsible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        {children}
      </Card>
    );
  }

  return (
    <Collapsible>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <CollapsibleTrigger asChild>
            <button type="button" className="text-blue-600 p-1 rounded-full hover:bg-blue-50 transition" aria-label={triggerAriaLabel}>
              <ChevronDown size={20} />
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          {children}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
