import { cva } from "class-variance-authority";
import { createElement, FC, HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

export const textVariants = cva("", {
  variants: {
    variant: {
      default: "font-header",
      section: "font-text",
      items: "font-text",
    },
    size: {
      h1: "text-xs",
      h2: "text-sm",
      h3: "text-base",
      h4: "text-lg",
      h5: "text-xl",
    },
  },

  defaultVariants: {
    variant: "default",
    size: "h2",
  },
  compoundVariants: [],
});

interface IHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading: FC<IHeadingProps> = ({
  headingLevel = "h1",
  children,
  className,
}) => {
  const Head = ({ ...props }: HTMLAttributes<HTMLHeadingElement>) =>
    createElement(headingLevel, props, children);

  return (
    <>
      <Head className={cn("", className)}>{children}</Head>
    </>
  );
};
