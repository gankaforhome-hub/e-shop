import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";

import { cn } from "@/shared/lib/utils";

export const buttonVariants = cva(
  "font-button duration-250 inline-flex shrink-0 items-center justify-center whitespace-nowrap text-lg font-normal outline-none transition",
  {
    variants: {
      variant: {
        default:
          "text-button text-btn-text-primary bg-btn-bg-primary focus:text-btn-text-accent-primary hover:text-btn-text-accent-primary focus:bg-btn-bg-accent-primary hover:bg-btn-bg-accent-primary hover:shadow-lg",
        secondary:
          "text-button text-btn-text-secondary bg-btn-bg-secondary focus:text-btn-text-accent-secondary hover:text-btn-text-accent-secondary focus:bg-btn-bg-accent-secondary hover:bg-btn-bg-accent-secondary hover:shadow-lg",
        subscribe:
          "text-button text-btn-text-subscribe bg-btn-bg-subscribe focus:text-btn-text-accent-subscribe hover:text-btn-text-accent-subscribe focus:bg-btn-bg-accent-subscribe hover:bg-btn-bg-accent-subscribe hover:shadow-lg",
        ghost:
          "text-button text-btn-text-ghost bg-btn-bg-ghost focus:text-btn-text-accent-ghost hover:text-btn-text-accent-ghost focus:bg-btn-bg-accent-ghost hover:bg-btn-bg-accent-ghost hover:shadow-lg",
        addToBag:
          "text-button text-btn-text-addToBag bg-btn-bg-addToBag focus:text-btn-text-accent-addToBag hover:text-btn-text-accent-addToBag focus:bg-btn-bg-accent-addToBag hover:bg-btn-bg-accent-addToBag hover:shadow-lg",
      },
      size: {
        default: "px-6 py-5",
        sm: "px-5 py-4",
        lg: "",
        xl: "px-21 py-5",
        spaced: "justify-between px-5 py-4",
        // sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        // lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        // xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
      },
      border: {
        border: "border-btn-border border",
        withOutBorder: "",
      },
      btnType: {
        button: "",
        icon: "rounded-full px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      border: "border",
      btnType: "button",
    },
    compoundVariants: [
      // { variant: "default", size: "lg", class: "h-10 w-10" },
      // { variant: "addToBag", size: "default", class: "w-full" },
      // { btnType: "icon", size: "xl", class: "h-12 w-12" },
    ],
  }
);
export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button: FC<IButtonProps> = ({
  className,
  variant,
  size,
  border,
  btnType,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, border, btnType, className })
      )}
      {...props}
    />
  );
};
