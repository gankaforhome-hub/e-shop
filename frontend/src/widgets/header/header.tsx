import { FC } from "react";

import { cn } from "@/shared/lib/utils";
import { Box } from "@/shared/ui/box";
import { Container } from "@/shared/ui/container";

interface IHeaderProps {
  className?: string;
}

export const Header: FC<IHeaderProps> = ({ className }) => {
  return (
    <header className={cn("", className)}>
      <Container className="bg-teal-300">
        <Box className="flex h-20 items-center justify-center">
          <p className="text-6xl font-bold">Header</p>
        </Box>
      </Container>
    </header>
  );
};
