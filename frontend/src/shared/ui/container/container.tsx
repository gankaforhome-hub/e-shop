import { FC, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface IContainerProps {
  className?: string;
  children: ReactNode;
}
//;
export const Container: FC<IContainerProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "container mx-auto my-0 w-full max-w-screen-xl px-6",
        className
      )}
    >
      {children}
    </div>
  );
};
