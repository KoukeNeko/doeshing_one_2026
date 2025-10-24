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

// ============================================
// Content Display Limits
// ============================================

// Homepage: Number of featured posts to highlight with large cards
export const HOMEPAGE_FEATURED_COUNT = 2;

// Homepage: Total number of posts to fetch for the homepage blog grid
export const HOMEPAGE_POSTS_FETCH_LIMIT = 6;

// Post detail pages: Number of related posts to show in "You might also enjoy" section
export const RELATED_POSTS_FEATURED_COUNT = 3;

// Homepage: Number of featured projects to display in the projects section
export const FEATURED_PROJECT_LIMIT = 3;

// Work page: Number of projects to highlight with large cards (usually 1-2)
export const WORK_PAGE_FEATURED_COUNT = 1;

// Archive/Category/Search pages: Number of posts to display per page for pagination
export const POSTS_PER_PAGE = 9;
