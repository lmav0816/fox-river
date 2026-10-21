import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex w-fit items-center gap-1.5 text-[9px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-sm bg-secondary px-2.5 py-1.5 text-secondary-foreground",
        // Sits on top of a photo, so it carries its own light background.
        photo: "bg-background/95 px-[11px] py-[7px] text-foreground",
        outline: "rounded-sm border border-primary px-2.5 py-1.5 text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Tag({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof tagVariants>) {
  return (
    <span
      data-slot="tag"
      data-variant={variant}
      className={cn(tagVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Tag, tagVariants };
