import Link from "next/link";

import { Box } from "@/shared/ui/box";
import { Container } from "@/shared/ui/container";
import { Section } from "@/shared/ui/section";

const routes = [
  "/components",
  "/about-us",
  "/contacts",
  "/cart",
  "/collections",
  "/collections/collectionSlug",
  "/not-found",
];

export default function Page() {
  return (
    <>
      <Section>
        <Container>
          <Box className="flex flex-col items-start gap-5">
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route}
                className="mx-auto block text-4xl text-rose-500 hover:text-blue-400"
              >
                page {route}
              </Link>
            ))}
          </Box>
        </Container>
      </Section>
    </>
  );
}
