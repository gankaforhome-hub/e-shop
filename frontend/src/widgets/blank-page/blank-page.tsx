"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

import { Box } from "@/shared/ui/box";
import { Container } from "@/shared/ui/container";
import { Section } from "@/shared/ui/section";

interface IBlankPageProps {
  className?: string;
}

export const BlankPage: FC<IBlankPageProps> = () => {
  const path = usePathname();
  return (
    <Section>
      <Container>
        <Box className="mb-10 flex justify-center">
          <Link
            href="/"
            className="rounded-2xl border bg-amber-200 p-4 px-10 text-4xl text-rose-500 hover:text-red-800"
          >
            Back
          </Link>
        </Box>
        <Box>
          <p className="red text-2xl">
            Blank Page -<span className="text-teal-900 underline"> {path}</span>
          </p>
        </Box>
      </Container>
    </Section>
  );
};
