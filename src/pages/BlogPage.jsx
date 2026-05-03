import { Link } from "react-router-dom";
import { useState } from "react";
import { useLocalizedCatalog } from "../shared/hooks/useLocalizedCatalog.js";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export function BlogPage() {
  const { blogPosts } = useLocalizedCatalog();
  const { t } = usePreferences();

  return (
    <section className="bg-paper px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="label" data-reveal="fade-up">{t("blog.label")}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl" data-reveal="fade-up">
          {t("blog.title")[0]} <span className="italic">{t("blog.title")[1]}</span>
        </h1>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-1 hover:shadow-editorial" data-reveal="scale-in" key={post.slug}>
              <BlogCover post={post} className="aspect-[4/3] rounded-xl text-3xl" />
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</p>
              <h2 className="mt-3 text-2xl">{post.title}</h2>
              <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
              <div className="mt-auto pt-5">
                <Link className="inline-flex w-fit rounded-full border border-ink px-4 py-3 text-xs uppercase tracking-[0.1em] transition hover:border-accent hover:text-accent" to={`/blog/${post.slug}`}>
                  {t("actions.details")}
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!blogPosts.length && <p className="mt-10 text-muted">{t("search.empty")}</p>}
      </div>
    </section>
  );
}

export function BlogCover({ post, className = "" }) {
  const [failed, setFailed] = useState(false);
  const source = normalizeMediaSource(post.cover_image_url);

  return (
    <div className={`grid place-items-center overflow-hidden bg-surfaceAlt font-display uppercase tracking-[0.08em] text-muted ${className}`}>
      {source && !failed ? (
        <img className="h-full w-full object-cover" src={source} alt={post.title} onError={() => setFailed(true)} />
      ) : (
        <span>{post.title.slice(0, 2)}</span>
      )}
    </div>
  );
}

function normalizeMediaSource(source) {
  if (!source || typeof window === "undefined") return source;

  try {
    const url = new URL(source, window.location.origin);
    if (url.pathname.startsWith("/media/") && ["localhost", "127.0.0.1"].includes(url.hostname)) {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    return source;
  }

  return source;
}
