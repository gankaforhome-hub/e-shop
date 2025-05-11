import { FC, SVGProps } from "react";

import Four from "@/shared/icons/four.svg";
import LogoFull from "@/shared/icons/logo/logo_full_ganka_for_home.svg";
import LogoMin from "@/shared/icons/logo/logo_min_ganka_for_home.svg";
import Instagram from "@/shared/icons/social/instagram.svg";
import Location from "@/shared/icons/social/location.svg";
import Phone from "@/shared/icons/social/phone.svg";
import Telegram from "@/shared/icons/social/telegram.svg";
import { cn } from "@/shared/lib/utils";

const icons = {
  logoFull: LogoFull,
  logoMin: LogoMin,
  location: Location,
  instagram: Instagram,
  telegram: Telegram,
  phone: Phone,
  four: Four,
  // cart: Cart,
};

type IconName = keyof typeof icons;

interface IIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export const Icon: FC<IIconProps> = ({ name, className = "", ...props }) => {
  const SvgIcon = icons[name];
  return <SvgIcon className={cn("", className)} {...props} />;
};
