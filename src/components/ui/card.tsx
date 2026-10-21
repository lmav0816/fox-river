import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

function Card({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="card"
      className={cn(
        "border bg-card p-6 text-card-foreground sm:p-8",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
