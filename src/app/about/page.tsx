import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificationsList } from "@/components/about/CertificationsList";
import cvData from "@/../../content/cv-data.json";

export const metadata = {
  title: "About - De-Sheng Chen | Doeshing Gazette",
  avator_img: "https://scontent.fkhh1-2.fna.fbcdn.net/v/t39.30808-6/496947431_1221429682941302_6506391249836038991_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=FqS-PZD61QsQ7kNvwE7c7hq&_nc_oc=Admd3fQ7IYRibM9jiAmnfGAhf-xJKu-RcO8fBdyrZYTwAxnSUmryW3oN8A8UOYJlCRLwTcIscYsIsNTB_IJZHnjS&_nc_zt=23&_nc_ht=scontent.fkhh1-2.fna&_nc_gid=830pCqS9B8JuGG7J8fJXfA&oh=00_AffuV0FAJF6JLkopHOqguZhsjuPOLslphju2-kJn39g2aw&oe=68F15F90",
  description:
    "陳德生 - 畢業於國立雲林科技大學資訊工程系。專研全端開發與行動應用程式開發，同時正在學習雲端技術的路上狂奔。",
};

const skills = {
  frontend: ["React.js", "React Native", "HTML5", "CSS", "Kotlin", "Android Jetpack"],
  backend: ["C#", ".NET", "Python", "Java", "資料結構"],
  tools: ["Docker", "軟體設計", "TensorFlow", "AWS Cloud", "Google Gemini"],
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <SectionHeading
        kicker="About"
        title="Software Engineer & Full-Stack Developer"
        description="Hello World! 我是陳德生，畢業於國立雲林科技大學資訊工程系。專研全端開發與行動應用程式開發，同時正在學習雲端技術的路上狂奔。"
      />
      
      <header className="flex flex-col gap-8 border border-black/10 bg-white px-6 py-10 shadow-editorial dark:border-white/10 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <Image
            src={metadata.avator_img}
            alt="De-Sheng Chen portrait"
            width={120}
            height={120}
            className="h-24 w-24 rounded-full border border-black/10 object-cover dark:border-white/10 dark:invert"
          />
          <div className="space-y-2">
            <h1 className="font-serif text-3xl tracking-tight text-newspaper-ink dark:text-zinc-50">
              {cvData.personal.name} (De-Sheng Chen)
            </h1>
            <p className="text-sm text-newspaper-gray dark:text-zinc-400">
              {cvData.personal.title}
            </p>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
              <span>{cvData.personal.location}</span>
              <span>&middot;</span>
              <Link
                href={cvData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-newspaper-accent dark:text-red-400"
              >
                LinkedIn
              </Link>
              <span>&middot;</span>
              <span>{cvData.personal.connections} connections</span>
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

      {/* Open to Work */}
      <section className="border-l-4 border-newspaper-accent bg-red-50 px-6 py-4 dark:border-red-400 dark:bg-red-950/20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-accent dark:text-red-400">
          Open to Work
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cvData.personal.openToWork.roles.map((role) => (
            <span
              key={role}
              className="rounded-sm border border-newspaper-accent bg-white px-3 py-1 text-sm text-newspaper-ink dark:border-red-400 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {role}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          kicker="Skills"
          title="Technical expertise across the stack"
        />
        <div className="grid gap-6 md:grid-cols-3">
          <SkillCard title="Frontend" items={skills.frontend} />
          <SkillCard title="Backend" items={skills.backend} />
          <SkillCard title="Tools & Cloud" items={skills.tools} />
        </div>
        <div className="border border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
            Top Skills
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {cvData.topSkills.map((skill) => (
              <span
                key={skill}
                className="font-serif text-lg text-newspaper-accent dark:text-red-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          kicker="Experience"
          title="Professional experience"
        />
        <ol className="relative border-l border-black/10 pl-6 dark:border-white/10">
          {cvData.experience.map((job) => (
            <li key={job.title} className="mb-10 last:mb-0">
              <div className="absolute -left-3 mt-1 h-6 w-6 rounded-full border border-newspaper-ink bg-white dark:border-zinc-100 dark:bg-zinc-900" />
              <div className="space-y-3">
                <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400 md:flex-row md:items-center md:gap-4">
                  <span className="font-semibold text-newspaper-ink dark:text-zinc-50">
                    {job.title}
                  </span>
                  <span>{job.company}</span>
                  <span>{job.period}</span>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  {job.type} · {job.location}
                </p>
                <p className="whitespace-pre-line text-sm text-newspaper-ink dark:text-zinc-300">{job.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>


      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading kicker="Education" title="Academic background" />
          <ul className="space-y-3">
            {cvData.education.map((item) => (
              <li
                key={item.school}
                className="border border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-newspaper-accent dark:text-red-400">
                  {item.schoolChinese || item.school}
                </p>
                <p className="font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                  {item.type} - {item.degree}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  {item.period}
                </p>
                {item.achievement && (
                  <p className="mt-2 text-xs text-newspaper-accent dark:text-red-400">
                    🏆 {item.achievement}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <SectionHeading kicker="Certifications" title="Professional credentials" />
          <CertificationsList certifications={cvData.certifications} />
        </div>
      </section>

      {/* Projects Section */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Featured Project"
          title="Award-winning work"
        />
        {cvData.projects.map((project) => (
          <div
            key={project.name}
            className="border border-black/10 bg-white px-8 py-8 shadow-editorial dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl text-newspaper-ink dark:text-zinc-50">
                  {project.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  {project.period} · {project.associatedWith}
                </p>
              </div>
              <span className="rounded-sm bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-accent dark:bg-red-950/20 dark:text-red-400">
                {project.achievement}
              </span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-newspaper-gray dark:text-zinc-400">
              {project.description.zh}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-sm border border-black/10 px-3 py-1 text-xs text-newspaper-ink dark:border-white/10 dark:text-zinc-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Volunteering Section */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Volunteering"
          title="Community contributions"
        />
        <ol className="relative border-l border-black/10 pl-6 dark:border-white/10">
          {cvData.volunteering.map((volunteer, index) => (
            <li key={volunteer.role + index} className="mb-8 last:mb-0">
              <div className="absolute -left-2 mt-1 h-4 w-4 rounded-full border border-newspaper-accent bg-white dark:border-red-400 dark:bg-zinc-900" />
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                    {volunteer.role}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                    {volunteer.organization}
                  </span>
                  {volunteer.period && (
                    <span className="text-xs text-newspaper-gray dark:text-zinc-400">
                      {volunteer.period}
                    </span>
                  )}
                  {volunteer.cause && (
                    <span className="inline-block rounded-sm border border-newspaper-accent px-2 py-0.5 text-xs font-medium text-newspaper-accent dark:border-red-400 dark:text-red-400">
                      {volunteer.cause}
                    </span>
                  )}
                </div>
                {volunteer.description && (
                  <p className="whitespace-pre-line text-sm text-newspaper-gray dark:text-zinc-400">
                    {volunteer.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Test Scores */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
            Language Proficiency
          </p>
          <ul className="mt-4 space-y-3">
            {cvData.languages.map((lang) => (
              <li key={lang.name} className="flex justify-between">
                <span className="font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                  {lang.name}
                </span>
                <span className="text-sm text-newspaper-gray dark:text-zinc-400">
                  {lang.proficiency}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
            Test Scores
          </p>
          <ul className="mt-4 space-y-3">
            {cvData.testScores.map((test) => (
              <li key={test.name} className="flex justify-between">
                <span className="font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                  {test.name}
                </span>
                <span className="text-sm text-newspaper-accent dark:text-red-400">
                  {test.score}
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
