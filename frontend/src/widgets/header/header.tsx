import { FC } from "react";

import { cn } from "@/shared/lib/utils";
import { Box } from "@/shared/ui/box";
import { Container } from "@/shared/ui/container";
import { Separator } from "@/shared/ui/separator";

interface IHeaderProps {
  className?: string;
}

export const Header: FC<IHeaderProps> = ({ className }) => {
  return (
    <header className={cn("", className)}>
      <Separator variant="accent" className="border-5" />
      <Container className="bg-teal-300">
        <Box className="flex h-20 items-center justify-center">
          <p className="text-6xl font-bold">Header</p>
        </Box>
      </Container>
    </header>
  );
};
