"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Certification {
  name: string;
  issuer: string;
  issued: string;
  expires?: string;
  credentialId?: string;
  skills?: string[];
  description?: string;
}

interface CertificationsListProps {
  certifications: Certification[];
}

export function CertificationsList({ certifications }: CertificationsListProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedCerts = showAll ? certifications : certifications.slice(0, 6);

  return (
    <>
      <ul className="space-y-3">
        {displayedCerts.map((cert) => (
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
      
      {certifications.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="group mt-4 flex w-full items-center justify-center gap-2 border border-black/10 bg-white px-4 py-3 text-xs uppercase tracking-[0.3em] text-newspaper-gray transition-colors hover:bg-newspaper-accent/5 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-red-400/5"
        >
          <span>
            {showAll 
              ? "Show less" 
              : `Show ${certifications.length - 6} more certifications`}
          </span>
          {showAll ? (
            <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          ) : (
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          )}
        </button>
      )}
    </>
  );
}
