import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "bg-lagoon text-salt hover:bg-lagoon-deep",
        ghost:
          "bg-transparent text-ink hover:bg-sand/40",
        outline:
          "bg-transparent text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.16)] hover:bg-salt",
        pill: "rounded-full bg-ink text-salt hover:bg-lagoon",
      },
      size: {
        sm: "h-10 px-4 text-sm rounded-sm",
        md: "h-11 px-5 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-md",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
