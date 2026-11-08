import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 border px-1.5 text-xs whitespace-nowrap transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a]:hover:bg-secondary/70",
        outline:
          "border-line-strong bg-transparent text-foreground [a]:hover:bg-secondary [a]:hover:border-foreground/40",
        ghost:
          "border-transparent bg-transparent text-muted-foreground [a]:hover:bg-secondary [a]:hover:text-foreground",
        pending:
          "border-status-pending/40 bg-status-pending/10 text-status-pending",
        approved:
          "border-status-approved/40 bg-status-approved/10 text-status-approved",
        rejected:
          "border-status-rejected/40 bg-status-rejected/10 text-status-rejected",
        neutral:
          "border-status-neutral/30 bg-status-neutral/10 text-status-neutral",
        destructive:
          "border-destructive/40 bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
      },
      shape: {
        default: "rounded-sm",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  shape = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, shape }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
