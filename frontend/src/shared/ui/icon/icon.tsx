import { FC, SVGProps } from "react";

import Four from "@/shared/icons/four.svg";
import { cn } from "@/shared/lib/utils";

const icons = {
  // cart: Cart,
  // instagram: Instagram,
  // telegram: Telegram,
  // phone: Phone,
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
