import Image from "next/image";
import { FC } from "react";

import { cn } from "@/shared/lib/utils";
import { Box } from "@/shared/ui/box";
import { Button } from "@/shared/ui/button";
import { ExternalLink } from "@/shared/ui/external-link";
import { Icon } from "@/shared/ui/icon";
import { Section } from "@/shared/ui/section";

interface ContactLink {
  href: string;
  label: string;
  icon: "phone" | "telegram" | "instagram" | "location";
  external?: boolean;
}

const contactLinks: ContactLink[] = [
  {
    href: "tel:+123456789",
    label: "Phone number",
    icon: "phone",
  },
  {
    href: "https://t.me/",
    label: "Telegram",
    icon: "telegram",
    external: true,
  },
  {
    href: "https://instagram.com/",
    label: "Instagram",
    icon: "instagram",
    external: true,
  },
  {
    href: "/collections",
    label: "Find a store",
    icon: "location",
  },
];

interface INotFoundWidgetProps {
  className?: string;
}

const t = {
  ImageAlt: "clay plate",
  PageNotFound: "page not found",
  Description:
    "We cannot find the page you were looking for. Please check the URL or navigate to another page. We apologize for inconvenience.",
  CanWeHelp: "Can we help you?",
};

export const NotFoundWidget: FC<INotFoundWidgetProps> = () => {
  return (
    <Section>
      {/* <Container className="h-full"> */}
      <Box
        className={cn(
          "flex flex-col items-center justify-center border-b-[1px] pb-14"
        )}
      >
        <Box className="relative mb-12 flex items-center">
          <Icon name="four" className="w-22 h-34 shrink-0 fill-[#080808]" />
          <Image
            src="/images/pages/not-found/plate.png"
            alt={t.ImageAlt}
            width={224}
            height={224}
            className="h-56 w-56 -translate-x-8 overflow-hidden rounded-full"
          />
          <Icon
            name="four"
            className="w-22 h-34 shrink-0 -translate-x-16 fill-[#080808]"
          />
        </Box>

        <Box>
          <h1 className="mb-7.5 font-header text-center text-3xl uppercase">
            {t.PageNotFound}
          </h1>
          <p className="max-w-181 font-text text-center text-lg tracking-tighter">
            {t.Description}
          </p>
        </Box>
      </Box>
      <Box className="px-50 bg-amber-100">
        <p className="font-text mb-11 text-center text-xl">{t.CanWeHelp}</p>
        {/* grid grid-cols-1 gap-4 sm:grid-cols-2 */}
        <ul className={cn("card-set-1/5 xl:card-set-2/5")}>
          {contactLinks.map(({ href, label, icon }) => (
            <li key={href} className="card-set-item">
              <Button size={"lg"} asChild className="">
                <ExternalLink
                  href={href}
                  className="stroke-btn-text-primary hover:fill-btn-text-primary hover:stroke-btn-text-accent-primary gap-2.5 fill-none"
                >
                  <Icon name={icon} className="flex h-6 w-6 shrink-0"></Icon>
                  <span>{label}</span>
                </ExternalLink>
              </Button>
            </li>
          ))}
        </ul>
        {/* //TODO add button move to collection */}
      </Box>
      {/* </Container> */}
    </Section>
  );
};
