export default function BlogLoading() {
  const placeholders = ["s1", "s2", "s3", "s4", "s5", "s6"];

  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse bg-black/5" />
      <div className="h-12 animate-pulse bg-black/5" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((key) => (
          <div key={key} className="h-64 animate-pulse bg-black/5" />
        ))}
      </div>
    </div>
  );
}
