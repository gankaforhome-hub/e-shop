import { cva, VariantProps } from "class-variance-authority";
import { FC, HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

export const textVariants = cva("font-text ftext-4/4.5", {
  variants: {
    variant: {
      default: "text-gray-900",
      subtitle: "text-gray-500",
      accent: "text-blue-600",
      danger: "text-red-600",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    // weight: {
    //   normal: "font-normal",
    //   medium: "font-medium",
    //   semibold: "font-semibold",
    //   bold: "font-bold",
    // },
    // align: {
    //   left: "text-left",
    //   center: "text-center",
    //   right: "text-right",
    //   justify: "text-justify",
    // },
  },

  defaultVariants: {
    variant: "default",
    size: "md",
    // weight: "normal",
    // align: "left",
  },
  compoundVariants: [
    // { variant: "default", size: "lg", class: "h-10 w-10" },
  ],
});

interface ITextProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  className?: string;
  as?: "p" | "span";
}

export const Text: FC<ITextProps> = ({
  className,
  variant,
  size,
  as = "p",
  ...props
}) => {
  const Component = as;
  return (
    <Component
      className={cn(textVariants({ variant, size, className }))}
      {...props}
    />
  );
};
