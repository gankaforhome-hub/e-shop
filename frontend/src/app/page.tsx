import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Section } from "@/shared/ui/section";

export default function Home() {
  return (
    <div className="bg-background text-theme-900 text-center">
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
        <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
          <Section>
            <Link
              href={"./components"}
              className="text-4xl text-rose-500 hover:text-blue-400"
            >
              Example Components
            </Link>
          </Section>
        </main>
        <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
          <Button></Button>
        </footer>
      </div>
    </div>
  );
}
