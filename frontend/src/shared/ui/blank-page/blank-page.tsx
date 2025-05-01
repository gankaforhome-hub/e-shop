import { FC } from "react";

import { cn } from "@/shared/lib/utils";

interface IBlankPageProps {
  className?: string;
}

export const BlankPage: FC<IBlankPageProps> = ({ className }) => {
  return <div className={cn("", className)}>Blank Page</div>;
};
