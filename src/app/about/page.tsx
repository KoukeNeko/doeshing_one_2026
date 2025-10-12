import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "About",
  description:
    "Design engineer crafting editorial-grade web experiences. Background, experience, and skills.",
};

const skills = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL"],
  frameworks: ["Next.js", "React", "Node.js", "Tailwind"],
  tools: ["Figma", "Notion", "Storybook", "Prisma"],
};

const experience = [
  {
    company: "Narrative Systems Studio",
    role: "Lead Design Engineer",
    period: "2023 – Present",
    summary:
      "Leading cross-functional teams to build narrative-driven web products for editorial brands and creative tech startups.",
    highlights: [
      "Shipped a modular publishing platform serving 250k monthly visitors",
      "Established design engineering workflow bridging Figma, MDX, and deployment",
    ],
  },
  {
    company: "Ink & Interface",
    role: "Senior Product Designer",
    period: "2020 – 2023",
    summary:
      "Owned end-to-end design and prototyping for web experiences blending storytelling and data viz.",
    highlights: [
      "Designed analytics dashboards with <2s interaction response times",
      "Introduced design tokens system adopted across three product lines",
    ],
  },
  {
    company: "Freelance",
    role: "Creative Technologist",
    period: "2016 – 2020",
    summary:
      "Partnered with agencies and indie publishers to craft bespoke editorial microsites and experiments.",
    highlights: [
      "Delivered 40+ interactive storytelling pieces",
      "Prototyped emerging formats mixing AR, sound, and long-form narrative",
    ],
  },
];

const education = [
  {
    school: "National Taiwan University",
    degree: "B.S. in Information Management",
    period: "2012 – 2016",
  },
];

const awards = [
  {
    title: "Awwwards Site of the Day",
    year: "2024",
  },
  {
    title: "CSS Design Awards – Special Kudos",
    year: "2023",
  },
  {
    title: "Google News Initiative Prototype Award",
    year: "2022",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <SectionHeading
        kicker="About"
        title="Design engineer & editorial craftsperson"
        description="Blending code, design thinking, and storytelling to craft web experiences that feel like print but scale like software."
      />
      
      <header className="flex flex-col gap-8 border border-black/10 bg-white px-6 py-10 shadow-editorial dark:border-white/10 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <Image
            src="/images/avatar.svg"
            alt="Doeshing portrait"
            width={120}
            height={120}
            className="h-24 w-24 rounded-full border border-black/10 object-cover dark:border-white/10 dark:invert"
          />
          <div className="space-y-2">
            <h1 className="font-serif text-3xl tracking-tight text-newspaper-ink dark:text-zinc-50">
              Doeshing
            </h1>
            <p className="text-sm text-newspaper-gray dark:text-zinc-400">
              Design engineer crafting editorial-grade web experiences. Bridging
              storytelling, product strategy, and modern frontend stacks.
            </p>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
              <span>Taipei</span>
              <span>&middot;</span>
              <Link
                href="mailto:hello@doeshing.com"
                className="text-newspaper-accent dark:text-red-400"
              >
                hello@doeshing.com
              </Link>
              <span>&middot;</span>
              <Link
                href="https://github.com/doeshing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-newspaper-accent dark:text-red-400"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
        <Link
          href="/cv.pdf"
          target="_blank"
          className="inline-flex items-center gap-2 border border-newspaper-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-ink transition hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
        >
          <Download size={16} strokeWidth={1.5} />
          Download PDF
        </Link>
      </header>

      <section className="space-y-8">
        <SectionHeading
          kicker="Skills"
          title="A blend of code craft, design thinking, and editorial expertise"
        />
        <div className="grid gap-6 md:grid-cols-3">
          <SkillCard title="Languages" items={skills.languages} />
          <SkillCard title="Frameworks" items={skills.frameworks} />
          <SkillCard title="Tools" items={skills.tools} />
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          kicker="Experience"
          title="Selected roles and responsibilities"
        />
        <ol className="relative border-l border-black/10 pl-6 dark:border-white/10">
          {experience.map((job) => (
            <li key={job.company} className="mb-10 last:mb-0">
              <div className="absolute -left-3 mt-1 h-6 w-6 rounded-full border border-newspaper-ink bg-white dark:border-zinc-100 dark:bg-zinc-900" />
              <div className="space-y-3">
                <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400 md:flex-row md:items-center md:gap-4">
                  <span className="font-semibold text-newspaper-ink dark:text-zinc-50">
                    {job.role}
                  </span>
                  <span>{job.company}</span>
                  <span>{job.period}</span>
                </div>
                <p className="text-sm text-newspaper-gray dark:text-zinc-400">{job.summary}</p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-newspaper-ink dark:text-zinc-300">
                  {job.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading kicker="Education" title="Academic foundations" />
          <ul className="space-y-3">
            {education.map((item) => (
              <li
                key={item.school}
                className="border border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-newspaper-accent dark:text-red-400">
                  {item.school}
                </p>
                <p className="font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                  {item.degree}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <SectionHeading kicker="Awards" title="Recognition & mentions" />
          <ul className="space-y-3">
            {awards.map((award) => (
              <li
                key={award.title}
                className="flex items-center justify-between border border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900"
              >
                <span className="font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                  {award.title}
                </span>
                <span className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  {award.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

interface SkillCardProps {
  title: string;
  items: string[];
}

function SkillCard({ title, items }: SkillCardProps) {
  return (
    <div className="border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
        {title}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-sm border border-black/10 px-3 py-1 text-sm text-newspaper-ink dark:border-white/10 dark:text-zinc-100"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
