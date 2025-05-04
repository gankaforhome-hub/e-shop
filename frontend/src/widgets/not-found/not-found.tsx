import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import { Box } from "@/shared/ui/box";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Icon } from "@/shared/ui/icon";
import { Section } from "@/shared/ui/section";

interface ContactLink {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
}

const contactLinks: ContactLink[] = [
  {
    href: "tel:+123456789",
    label: "Phone number",
    icon: "📞",
  },
  {
    href: "https://t.me/yourchannel",
    label: "Telegram",
    icon: "💬",
    external: true,
  },
  {
    href: "https://instagram.com/yourprofile",
    label: "Instagram",
    icon: "📸",
    external: true,
  },
  {
    href: "/collections",
    label: "Find a store",
    icon: "📍",
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
    <Section className="py-25 h-full">
      <Container className="h-full">
        <Box className="mb-16 flex flex-col items-center justify-center border-b-[1px] pb-16">
          <Box className="relative mb-16 flex items-center">
            <Icon name="four" className="w-25 h-37.5 shrink-0 fill-[#080808]" />
            <Image
              src="/images/pages/not-found/plate.png"
              alt={t.ImageAlt}
              width={250}
              height={250}
              className="-translate-x-8 rounded-full"
            />
            <Icon
              name="four"
              className="w-25 h-37.5 shrink-0 -translate-x-16 fill-[#080808]"
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
        <Box className="px-40">
          <p className="font-text mb-11 text-center text-xl">{t.CanWeHelp}</p>
          <ul className="card-set items-center [--card-gap:1rem]">
            {contactLinks.map(({ href, label, icon, external }) => (
              <li key={href} className="card-set-item [--card-item:2]">
                <Button
                  asChild
                  className="font-text px-13 flex border-2 py-5 text-lg"
                >
                  <Link href={href} target={external ? "_blank" : undefined}>
                    {icon} {label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>

          <Button
            asChild
            className="font-text px-13 flex border-2 py-5 text-lg"
          >
            <Link href="/">Go to collections!</Link>
          </Button>
        </Box>
      </Container>
    </Section>
  );
};
