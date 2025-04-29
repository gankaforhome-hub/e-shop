import { FC, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface IBoxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Box: FC<IBoxProps> = ({ children, className, ...rest }) => {
  return (
    <>
      <div className={cn("", className)} {...rest}>
        {children}
      </div>
    </>
  );
};
