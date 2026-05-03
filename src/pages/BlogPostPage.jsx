import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBlogPost } from "../core/api/backendApi.js";
import { Breadcrumbs } from "../shared/components/Breadcrumbs.jsx";
import { BlogCover } from "./BlogPage.jsx";
import { useLocalizedCatalog } from "../shared/hooks/useLocalizedCatalog.js";
import { useReveal } from "../shared/hooks/useReveal.js";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";
import ReactMarkdown from 'react-markdown'

const IMPORTED_BODY_MARKERS = ["This article is imported", "Django admin", "frontend"];

export function BlogPostPage() {
  const { slug } = useParams();
  const { language, t } = usePreferences();
  const { blogPosts } = useLocalizedCatalog();
  const preview = useMemo(() => blogPosts.find((post) => post.slug === slug), [blogPosts, slug]);
  const [post, setPost] = useState(preview || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useReveal(`blog:${slug}:${loading ? "loading" : "ready"}:${post?.slug || ""}`);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchBlogPost(slug, language, controller.signal)
      .then((data) => {
        setPost({ ...(preview || {}), ...data });
        setLoading(false);
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        setPost(preview || null);
        setError(preview ? null : requestError);
        setLoading(false);
      });

    return () => controller.abort();
  }, [language, preview, slug]);

  if (loading) {
    return <BlogPostState title={t("server.loadingTitle")} />;
  }

  if (error || !post) {
    return <BlogPostState title={t("search.empty")} />;
  }

  const publishedDate = post.published_at ? new Date(post.published_at).toLocaleDateString() : "";
  const body = getReadableBody(post, t);

  return (
    <section className="bg-paper px-5 pb-20">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[{ label: t("nav.blog"), href: "/blog" }, { label: post.title }]} />

        <article>
          <p className="label" data-reveal="fade-up">{publishedDate || t("blog.label")}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight md:text-6xl" data-reveal="fade-up">{post.title}</h1>
          {post.excerpt && <p className="mt-6 max-w-3xl text-lg leading-8 text-muted" data-reveal="fade-up">{post.excerpt}</p>}

          <div className="mt-10" data-reveal="scale-in">
            <BlogCover post={post} className="aspect-[16/9] rounded-2xl text-5xl" />
          </div>

          <div
            className="mt-10 max-w-3xl text-lg leading-9 text-text"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </div>

          <Link className="mt-10 inline-flex rounded-full border border-ink px-5 py-3 text-xs uppercase tracking-[0.1em] transition hover:border-accent hover:text-accent" to="/blog">
            {t("nav.blog")}
          </Link>
        </article>
      </div>
    </section>
  );
}

function getReadableBody(post, t) {
  const body = (post.body || "").trim();
  const isImportedPlaceholder = IMPORTED_BODY_MARKERS.some((marker) => body.includes(marker));
  const source = body && !isImportedPlaceholder ? body : post.excerpt || t("blog.missingBody");
  return source.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function BlogPostState({ title }) {
  return (
    <section className="grid min-h-[55vh] place-items-center bg-paper px-5 text-center">
      <h1 className="font-display text-4xl text-text">{title}</h1>
    </section>
  );
}
