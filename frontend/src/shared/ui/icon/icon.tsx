import { FC, SVGProps } from "react";

import Four from "@/shared/icons/four.svg";
import Instagram from "@/shared/icons/instagram.svg";
import Location from "@/shared/icons/location.svg";
import Phone from "@/shared/icons/phone.svg";
import Telegram from "@/shared/icons/telegram.svg";
import { cn } from "@/shared/lib/utils";

const icons = {
  // cart: Cart,
  location: Location,
  instagram: Instagram,
  telegram: Telegram,
  phone: Phone,
  four: Four,
};

export type IconName = keyof typeof icons;

interface IIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export const Icon: FC<IIconProps> = ({ name, className = "", ...props }) => {
  const SvgIcon = icons[name];
  return <SvgIcon className={cn("", className)} {...props} />;
};
