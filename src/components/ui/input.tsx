import type * as React from "react"

import { cn } from "@/lib/utils"

function Input(props: React.ComponentProps<"input">) {
  return (
    <input
      type={props.type}
      data-slot="input"
      className={cn(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-secondary px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        props.className
      )}
      {...props}
    />
  )
}

export { Input }
