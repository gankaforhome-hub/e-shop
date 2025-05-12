import type { CommonIcon, LogoIcon, SocialIcon } from "./";

type SocialLink = {
  icon: SocialIcon;
  title: string;
  href: string;
  ariaLabel: string;
};

type Logo = {
  icon: LogoIcon;
  ariaLLabel: string;
  href: string;
};

type UserAction = {
  icon: CommonIcon;
  title: string;
  ariaLabel: string;
};

type TopBar = {
  socialLink: SocialLink[];
  logo: Logo;
  userActions: {
    contactUs: UserAction;
    language: UserAction;
    favorite: UserAction;
    basket: UserAction;
  };
};

type NavMenuItem = {
  id: string;
  title: string;
  href: string;
  ariaLabel: string;
};

type HeaderData = {
  topBar: TopBar;
  navMenu: NavMenuItem[];
};

type CommonDictionary = {
  header: HeaderData;
  footer: string;
};

declare module "@/dictionary/common.json" {
  const value: CommonDictionary;
  export default value;
}
