import Link from "next/link";

import { Box } from "@/shared/ui/box";
import { Button, IButtonProps } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Section } from "@/shared/ui/section";

const btnSizes: IButtonProps["size"][] = ["sm", "lg", "xl"];
const btnOption: IButtonProps["variant"][] = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
];

export default function ComponentsPage() {
  return (
    <main className="bg-background text-theme-900 text-center">
      <Section>
        <Container>
          <Box className="mb-10">
            <Link
              href="/"
              className="rounded-2xl border bg-amber-200 p-4 px-10 text-4xl text-rose-500 hover:text-red-800"
            >
              Back
            </Link>
          </Box>
          <Box className="mt-16 grid place-items-center gap-12">
            {btnOption.map(variant => (
              <Box
                key={variant}
                className="flex items-center justify-center gap-6"
              >
                <Box className="grid gap-2">
                  <h2 className="mb-2 text-xl font-bold uppercase tracking-wide">
                    {variant} Buttons
                  </h2>
                  <Box className="fle flex flex-wrap items-center justify-center gap-4">
                    {btnSizes.map((size, index) => (
                      <Button
                        key={size}
                        size={size}
                        variant={variant}
                        disabled={index == 4}
                      >
                        <span>Learn more</span>
                        <span>&rarr;</span>
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box className="grid gap-2">
                  <h2 className="mb-2 text-xl font-bold uppercase tracking-wide">
                    {variant} Buttons
                  </h2>
                  <Box className="flex flex-wrap items-center justify-center gap-4">
                    {btnSizes.map((size, index) => (
                      <Button
                        key={size}
                        size={size}
                        variant={variant}
                        disabled={index == 4}
                        btnType={"icon"}
                      >
                        +
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Section>
    </main>
  );
}
