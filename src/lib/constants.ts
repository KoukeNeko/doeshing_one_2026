// ============================================
// Site Configuration
// ============================================

/**
 * Site name displayed across the application
 * Used in: Footer (components/layout/Footer.tsx)
 */
export const SITE_NAME = "Doeshing Gazette — Editorial Portfolio";

/**
 * Site description for SEO and meta tags
 * Currently defined but not actively used - reserved for future meta tag implementation
 */
export const SITE_DESCRIPTION =
  "A magazine-inspired personal site featuring articles, work, and credentials.";

// ============================================
// Navigation Configuration
// ============================================

/**
 * Main navigation links for the site
 * Used in:
 * - Header navigation (components/layout/NavigationClient.tsx) - both desktop and mobile menus
 * - Footer sitemap section (components/layout/Footer.tsx)
 *
 * Note: The /archive route has special handling in NavigationClient for dropdown menu
 */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Social media links with platform info and icon mapping
 * Used in:
 * - Footer social links section (components/layout/Footer.tsx)
 * - Contact page social channels (app/(site)/contact/page.tsx)
 *
 * Icon values are mapped to lucide-react icons in the consuming components
 */
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

/**
 * Friend/partner site links displayed in footer
 * Used in: Footer "友站連結" section (components/layout/Footer.tsx)
 *
 * Supports both Chinese and English descriptions
 */
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

/**
 * Number of featured posts to highlight with large cards on the homepage
 * Used in: Homepage (app/(site)/page.tsx) - passed to BlogGrid component
 *
 * This controls how many posts in the "Featured Stories" section are displayed
 * as large, prominent cards vs standard cards
 */
export const HOMEPAGE_FEATURED_COUNT = 2;

/**
 * Total number of posts to fetch for the homepage blog grid
 * Used in: Homepage (app/(site)/page.tsx) - passed to getFeaturedPosts()
 *
 * Determines how many posts are loaded in total on the homepage.
 * The first HOMEPAGE_FEATURED_COUNT will be styled as featured cards.
 */
export const HOMEPAGE_POSTS_FETCH_LIMIT = 6;

/**
 * Number of related posts to show in "You might also enjoy" sections
 * Used in:
 * - Blog post detail pages (app/(site)/blog/[slug]/page.tsx)
 * - Archive post detail pages (app/(site)/archive/[slug]/page.tsx)
 * - Archive listing page (app/(site)/archive/page.tsx)
 * - Category pages (app/(site)/category/[...slug]/page.tsx)
 * - Default parameter in lib/blog.ts functions: getFeaturedPosts() and getRelatedPosts()
 *
 * Controls featured post count across all listing and detail pages for consistent display
 */
export const RELATED_POSTS_FEATURED_COUNT = 3;

/**
 * Number of featured projects to display on the homepage
 * Used in: Homepage (app/(site)/page.tsx) - to slice the projects array
 *
 * Limits the projects shown in the "Studio Work" section on the homepage.
 * Projects are displayed in a 3-column grid on large screens.
 */
export const FEATURED_PROJECT_LIMIT = 3;

/**
 * Number of projects to highlight with large cards on the work page
 * Used in: Work page (app/(site)/work/page.tsx) - passed to ProjectGrid component
 *
 * Controls how many projects at the top of the work page are displayed as
 * large, prominent cards. Usually set to 1-2 to emphasize the most important work.
 */
export const WORK_PAGE_FEATURED_COUNT = 1;

/**
 * Number of posts to display per page for pagination
 * Used in:
 * - Archive page (app/(site)/archive/page.tsx)
 * - Category pages (app/(site)/category/[...slug]/page.tsx)
 * - Search page (app/(site)/search/page.tsx)
 *
 * Controls pagination across all blog listing pages. Also used to calculate
 * total page count (totalPages = Math.ceil(total / POSTS_PER_PAGE))
 */
export const POSTS_PER_PAGE = 9;

// ============================================
// AdSense Configuration
// ============================================

/**
 * Google AdSense Publisher ID
 * Used in: Root layout (app/layout.tsx) for AdSense script
 */
export const ADSENSE_PUBLISHER_ID = "pub-3252699819735273";

/**
 * AdSense ad slot ID for sidebar ads
 * Used in:
 * - Blog post pages (app/(site)/blog/[slug]/page.tsx)
 * - Project pages (app/(site)/projects/[slug]/page.tsx)
 *
 * This is the ad unit ID created in Google AdSense dashboard
 */
export const ADSENSE_SIDEBAR_SLOT_ID = "2944317010";
