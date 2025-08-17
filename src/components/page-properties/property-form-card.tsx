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
  hasError?: boolean;
  defaultOpen?: boolean;
}

export function PropertyFormCard({ title, collapsible = true, triggerAriaLabel = "Mở/đóng", children, cardFooter, hasError, defaultOpen }: PropsWithChildren<PropertyFormCardProps>) {
  if (!collapsible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={hasError ? "text-destructive" : undefined}>{title}</CardTitle>
        </CardHeader>
        <Separator className="my-0" />
        {children}
        {cardFooter && <CardFooter>{cardFooter}</CardFooter>}
      </Card>
    );
  }

  return (
    <Collapsible defaultOpen={hasError || defaultOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className={hasError ? "text-destructive" : undefined}>{title}</CardTitle>
          <CollapsibleTrigger asChild>
            <button type="button" className="text-primary p-1 rounded-full hover:bg-primary/10 transition" aria-label={triggerAriaLabel}>
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
