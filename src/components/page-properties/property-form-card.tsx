import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Separator } from "../ui/separator";

interface PropertyFormCardProps {
  title: string;
  collapsible?: boolean;
  triggerAriaLabel?: string;
  cardFooter?: React.ReactNode;
}

export function PropertyFormCard({ title, collapsible = true, triggerAriaLabel = "Mở/đóng", children, cardFooter }: PropsWithChildren<PropertyFormCardProps>) {
  if (!collapsible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <Separator className="my-0" />
        {children}
        {cardFooter && <CardFooter>{cardFooter}</CardFooter>}
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
        <Separator className="my-0" />
        <CollapsibleContent>
          {children}
          {cardFooter && <CardFooter>{cardFooter}</CardFooter>}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
