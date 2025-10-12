import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import cvData from "@/../../content/cv-data.json";

export const metadata = {
  title: "About - De-Sheng Chen | Doeshing Gazette",
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
            src="/images/avatar.svg"
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
          <ul className="space-y-3">
            {cvData.certifications.slice(0, 6).map((cert) => (
              <li
                key={cert.name}
                className="border border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900"
              >
                <p className="font-serif text-base text-newspaper-ink dark:text-zinc-50">
                  {cert.name}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  {cert.issuer} · {cert.issued}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-center text-newspaper-gray dark:text-zinc-400">
            + {cvData.certifications.length - 6} more certifications
          </p>
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
