export const SITE_NAME = "Doeshing Gazette — Editorial Portfolio";
export const SITE_DESCRIPTION =
  "A magazine-inspired personal site featuring articles, work, and credentials.";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const SOCIAL_LINKS = [
  {
    platform: "GitHub",
    href: "https://github.com/KoukeNeko",
    icon: "github",
  },
  {
    platform: "LinkedIn",
    href: "https://www.linkedin.com/in/doeshing",
    icon: "linkedin",
  },
  {
    platform: "Twitter",
    href: "https://twitter.com/doeshing",
    icon: "twitter",
  },
  {
    platform: "Medium",
    href: "https://medium.com/@doeshing",
    icon: "pen",
  },
] as const;

export const FRIEND_LINKS = [
  {
    name: "毛哥EM資訊密技",
    href: "https://emtech.cc/",
    description: "毛哥EM資訊密技是毛哥EM的資訊密技",
  },
  {
    name: "OsGa.dev",
    href: "https://www.osga.dev",
    description: "A student from NYUST, YunHack Leader, passionate about cybersecurity and development, currently a CTF player in the B33F 50μP and OhYeahSeC team.",
  },
] as const;

export const FEATURED_POST_LIMIT = 3;
export const FEATURED_PROJECT_LIMIT = 3;
export const POSTS_PER_PAGE = 9;
