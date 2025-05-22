import { FC } from 'react';

export type CommonIcon =
  | 'four'
  | 'contactUs'
  | 'cart'
  | 'delivery'
  | 'favorite'
  | 'gift'
  | 'language'
  | 'phone'
  | 'plus'
  | 'arrow';

export type LogoIcon = 'logoFull' | 'logoMin';

export type SocialIcon = 'map' | 'instagram' | 'facebook' | 'telegram';

export type MedialIcon = 'play' | 'pause' | 'mute' | 'sound';

export type IconName = CommonIcon | LogoIcon | SocialIcon | MedialIcon;

export type IconComponent = FC<React.SVGProps<SVGSVGElement>>;

export type IconMap = {
  [K in IconName]: IconComponent;
};
