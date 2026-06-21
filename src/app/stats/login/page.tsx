export default async function StatsLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/stats";

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-serif text-2xl mb-2">Stats — Private</h1>
      <p className="text-sm text-muted mb-6">
        This section contains collection valuation data and is password protected.
      </p>
      <form action="/api/stats-login" method="post" className="space-y-3">
        <input type="hidden" name="next" value={next} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          className="w-full border border-border rounded-md px-3 py-2 bg-card"
        />
        <button
          type="submit"
          className="w-full bg-foreground text-background rounded-full px-4 py-2 text-sm"
        >
          Enter
        </button>
        {params.error && (
          <p className="text-sm text-accent">Incorrect password, try again.</p>
        )}
      </form>
    </div>
  );
}
