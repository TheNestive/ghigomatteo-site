import Link from "next/link";

/** Bloc contact commun aux pages secondaires. */
export default function ContactCta() {
  return (
    <section className="border-t border-line-soft px-5 py-24 md:px-8">
      <p className="t-caps mb-8 text-muted">Contact</p>
      <p className="max-w-3xl text-[clamp(20px,2.8vw,32px)] leading-snug text-ink">
        Si vous avez un projet, une date ou une idée, je suis disponible
        pour en discuter. Dites-moi ce que vous souhaitez créer, et nous
        le créerons ensemble.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/contact"
          className="t-caps-md rounded-md border border-ink bg-ink px-8 py-4 text-center text-bg transition-opacity hover:opacity-80"
        >
          Me contacter&nbsp;→
        </Link>
        <a
          href="https://www.instagram.com/matteo.ghgo/"
          target="_blank"
          rel="noopener noreferrer"
          className="t-caps-md rounded-md border border-ink px-8 py-4 text-center text-ink transition-colors hover:bg-ink hover:text-bg"
        >
          Instagram&nbsp;↗
        </a>
      </div>
    </section>
  );
}
