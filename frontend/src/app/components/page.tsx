import Link from "next/link";

import { Box } from "@/shared/ui/box";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Section } from "@/shared/ui/section";

// const btnSizes: IButtonProps["size"][] = ["sm", "lg", "xl"];
// const btnBorder: IButtonProps["border"][] = ["border", "withOutBorder"];

// const btnOption: IButtonProps["variant"][] = [
//   "default",
//   "destructive",
//   "outline",
//   "secondary",
//   "ghost",
//   "link",
// ];

export default function ComponentsPage() {
  return (
    <Section className="py-10">
      <Container>
        <Box className="mb-10">
          <Link
            href="/"
            className="inline-flex rounded-2xl border bg-amber-200 p-4 px-10 text-4xl text-rose-500 hover:text-red-800"
          >
            Back
          </Link>
        </Box>
        <Box className="grid place-items-center gap-10">
          <Box className="flex items-center justify-center gap-6">
            <Button>View Collection</Button>
            <Button border={"withOutBorder"}>View Collection</Button>
          </Box>

          <Box className="flex items-center justify-center gap-6">
            <Button size={"xl"}>View More</Button>
          </Box>

          <Box className="flex items-center justify-center gap-6">
            <Button variant={"secondary"} size={"sm"}>
              Discover more
            </Button>
          </Box>

          <Box className="flex items-center justify-center gap-6">
            <Button variant={"secondary"} size={"sm"}>
              Discover more
            </Button>
          </Box>

          <Box className="w-50 h-50 bg-btn-bg-subscribe flex items-center justify-center gap-6">
            <Button variant={"subscribe"} size={"sm"}>
              Discover more
            </Button>
          </Box>

          <Box className="w-100 flex items-center justify-center gap-6">
            <Button variant={"addToBag"} size={"spaced"} className="w-full">
              <p>50$</p>
              <p>Discover more</p>
            </Button>
          </Box>

          <Box className="h-50 w-50 bg-btn-bg-ghost flex items-center justify-center gap-6">
            <Button variant={"ghost"} size={"sm"}>
              <p>Download</p>
            </Button>
          </Box>

          {/* Icons */}
          <Box className="flex items-center justify-center gap-6">
            <Button>View Collection</Button>
            <Button border={"withOutBorder"}>View Collection</Button>
          </Box>
        </Box>
        {/* <Box className="mt-16 grid place-items-center gap-12">
            {btnOption.map(variant => (
              <Box
                key={variant}
                className="flex items-center justify-center gap-6"
              >
                {btnBorder.map(border => (
                  <Box key={border}>
                    <h2
                      key={border}
                      className="mb-2 text-xl font-bold uppercase tracking-wide"
                    >
                      {border} Buttons
                    </h2>
                    <Box className="grid gap-2">
                      <h2 className="mb-2 text-xl font-bold uppercase tracking-wide">
                        {variant} Buttons
                      </h2>
                      <Box className="fle flex flex-wrap items-center justify-center gap-4">
                        {btnSizes.map((size, index) => (
                          <Button
                            key={size}
                            size={size}
                            border={border}
                            variant={variant}
                            disabled={index == 4}
                          >
                            <span>Learn more</span>
                          </Button>
                        ))}
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
                  </Box>
                ))}
              </Box>
            ))}
          </Box> */}
      </Container>
    </Section>
  );
}
