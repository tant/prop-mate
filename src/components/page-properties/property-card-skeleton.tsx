import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconShare } from "@tabler/icons-react";

export function PropertyCardSkeleton() {
  return (
    <Card className="p-4 flex flex-col gap-2 shadow hover:shadow-lg transition animate-pulse">
      <CardHeader>
        <CardDescription>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <Badge variant="outline" className="ml-2 opacity-0">
            <div className="h-4 bg-muted rounded w-16"></div>
          </Badge>
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconShare className="text-muted" />
            <div className="h-4 bg-muted rounded w-12 ml-1"></div>
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex gap-2 h-32 w-full mb-2">
        <div className="w-1/2 h-full">
          <div className="h-full w-full bg-muted rounded"></div>
        </div>
        <div className="w-1/2 h-full">
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted rounded">
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground w-full">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4 mt-1"></div>
        </div>
  <div className="flex gap-4 text-xs text-muted-foreground w-full">
          <div className="h-3 bg-muted rounded w-1/4"></div>
          <div className="h-3 bg-muted rounded w-1/4"></div>
          <div className="h-3 bg-muted rounded w-1/4"></div>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Button size="sm" variant="outline" disabled>
            <div className="h-4 bg-muted rounded w-8"></div>
          </Button>
          <Button size="sm" variant="secondary" disabled>
            <div className="h-4 bg-muted rounded w-8"></div>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}