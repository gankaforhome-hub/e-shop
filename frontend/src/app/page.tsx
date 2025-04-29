import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Section } from "@/shared/ui/section";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center">
        <Container className="max-sm:bg-red-300 sm:bg-amber-200 md:bg-amber-400 lg:bg-amber-600 xl:bg-amber-900 2xl:bg-black">
          <Section>
            <Link
              href={"./components"}
              className="mx-auto block text-4xl text-rose-500 hover:text-blue-400"
            >
              Example Components
            </Link>
          </Section>
        </Container>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <Button></Button>
      </footer>
    </>
  );
}
