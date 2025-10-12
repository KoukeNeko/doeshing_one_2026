import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function NewsletterPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        kicker="Newsletter"
        title="Stay in the loop"
        description="Subscribe to receive monthly editorial digests featuring new articles, project recaps, and behind-the-scenes notes."
      />
      <form className="border border-black/10 bg-white px-6 py-8 shadow-editorial">
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray">
          Email Address
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="border border-black/10 px-4 py-3 text-sm uppercase tracking-[0.25em] text-newspaper-ink outline-none placeholder:text-newspaper-gray"
          />
        </label>
        <p className="mt-3 text-xs text-newspaper-gray">
          Updates ship once a month. No spam—just curated reads and new
          releases.
        </p>
        <Button type="submit" className="mt-6">
          Request Invite
        </Button>
      </form>
    </div>
  );
}
