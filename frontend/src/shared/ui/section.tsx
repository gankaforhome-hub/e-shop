import { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface ISectionProps {
  className?: string;
  children: ReactNode;
}

export const Section = ({ className, children }: ISectionProps) => {
  return (
    <>
      <section className={cn("py-12.5", className)}>{children}</section>
    </>
  );
};
