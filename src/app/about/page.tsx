export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <h1 className="font-serif text-3xl sm:text-4xl mb-6">About this Archive</h1>
      <div className="space-y-4 text-muted leading-relaxed">
        <p>
          This collection has been assembled over decades — tin toys, clockwork
          mechanisms, battery-operated novelties, and the printed history that
          surrounds them.
        </p>
        <p>
          Every piece in this archive is catalogued with its manufacturer,
          materials, mechanism, condition, and place in the published
          literature, allowing the collection to be browsed not just as
          objects, but as a record of toy-making history.
        </p>
        <p>
          The catalogue is maintained as a living document and updated
          periodically as new pieces are added, researched, or
          re-photographed.
        </p>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl mt-14 mb-6">About the Collector</h2>
      <div className="space-y-4 text-muted leading-relaxed">
        <p>
          José António Covas is a lifelong tinkerer with a soft spot for
          anything that winds up, clicks, whirs, or rattles across a table.
          He&rsquo;s been gathering these toys for decades, one flea market
          and antique fair at a time.
        </p>
        <p>
          His training is in Mechanical Engineering, and it shows in what
          draws him to these pieces: the resourcefulness and creativity of
          squeezing such complex, memorable movements out of such simple
          engines has always fascinated him. He&rsquo;s spent his career as a
          university professor studying the very materials that, fittingly,
          make up half the toys on these shelves. It&rsquo;s a fun bit of
          overlap: decades of research into plastics and polymers, and decades
          of collecting the toys made from them.
        </p>
        <p>
          This has always been a family affair. Treasure hunts at flea
          markets and fairs became a shared pastime, with a few pieces added
          to the collection by other hands, and a couple of side-collections
          of our own along the way — our mother, in particular, has been a
          constant and willing partner in crime.
        </p>
        <p>
          This website exists so the collection can be shared a little more
          widely. Questions, stories about a toy you recognize, or leads on a
          missing piece are always welcome — reach out at{" "}
          <a href="mailto:jacgcovas@gmail.com" className="text-accent hover:underline">
            jacgcovas@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
