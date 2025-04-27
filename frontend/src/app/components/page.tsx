import { Button, IButton } from "@/shared/ui/button";

const btnSizes: IButton["size"][] = ["sm", "lg", "xl"];
const btnOption: IButton["variant"][] = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
];

export default function ComponentsPage() {
  return (
    <div className="bg-background text-theme-900 text-center">
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
        <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
          <div className="mx-auto">
            <div className="mt-16 grid place-items-center gap-12">
              {btnOption.map(variant => (
                <div
                  key={variant}
                  className="flex items-center justify-center gap-6"
                >
                  <div className="grid gap-2">
                    <h2 className="mb-2 text-xl font-bold uppercase tracking-wide">
                      {variant} Buttons
                    </h2>
                    <div className="fle flex flex-wrap items-center justify-center gap-4">
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
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <h2 className="mb-2 text-xl font-bold uppercase tracking-wide">
                      {variant} Buttons
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-4">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
          Footer
        </footer>
      </div>
    </div>
  );
}
