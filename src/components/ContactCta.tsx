import Link from "next/link";
import { localizePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dict";

/** Bloc contact commun aux pages secondaires. */
export default function ContactCta({ locale = "fr" }: { locale?: Locale }) {
  const t = getDict(locale).contactCta;

  return (
    <section className="border-t border-line-soft px-5 py-24 md:px-8">
      <p className="t-caps mb-8 text-muted">{t.kicker}</p>
      <p className="max-w-3xl text-[clamp(20px,2.8vw,32px)] leading-snug text-ink">
        {t.body}
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href={localizePath("/contact", locale)}
          className="t-caps-md rounded-md border border-ink bg-ink px-8 py-4 text-center text-bg transition-opacity hover:opacity-80"
        >
          {t.contactMe}
        </Link>
        <a
          href="https://www.instagram.com/matteo.ghgo/"
          target="_blank"
          rel="noopener noreferrer"
          className="t-caps-md rounded-md border border-ink px-8 py-4 text-center text-ink transition-colors hover:bg-ink hover:text-bg"
        >
          {t.instagram}
        </a>
      </div>
    </section>
  );
}
