import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Quote,
  UserRound,
} from "lucide-react";
import ContactCTA from "@/components/common/ContactCTA";
import PageHero from "@/components/common/PageHero";
import { DynamicIcon } from "@/components/common/Cards";
import { getBlogBySlug, isNotFoundError } from "@/lib/blogs";
import { formatBlogDate } from "@/lib/blog-utils";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type ContentRecord = Record<string, unknown>;

function asRecord(value: unknown): ContentRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ContentRecord)
    : null;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeContent(content: unknown): ContentRecord[] {
  if (Array.isArray(content)) {
    return content
      .map(asRecord)
      .filter((item): item is ContentRecord => Boolean(item));
  }

  const contentObject = asRecord(content);

  if (!contentObject) return [];

  for (const key of ["blocks", "sections", "content"]) {
    const nested = contentObject[key];

    if (Array.isArray(nested)) {
      return nested
        .map(asRecord)
        .filter((item): item is ContentRecord => Boolean(item));
    }
  }

  return [contentObject];
}

function renderContentBlock(block: ContentRecord, index: number) {
  const type = asString(block.type).toLowerCase();
  const heading = asString(block.heading) || asString(block.title);
  const body =
    asString(block.body) ||
    asString(block.text) ||
    asString(block.paragraph) ||
    asString(block.content);
  const imageUrl =
    asString(block.imageUrl) || asString(block.url) || asString(block.src);
  const imageAlt = asString(block.alt) || heading || "Blog image";
  const items =
    asStringArray(block.bullets).length > 0
      ? asStringArray(block.bullets)
      : asStringArray(block.items);

  if (type === "image" && imageUrl) {
    return (
      <figure key={index} className="overflow-hidden rounded-lg border border-border/80">
        <div className="relative aspect-[16/9]">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
          />
        </div>
        {body && (
          <figcaption className="bg-white px-4 py-3 text-sm text-muted-foreground">
            {body}
          </figcaption>
        )}
      </figure>
    );
  }

  if (type === "quote") {
    return (
      <blockquote
        key={index}
        className="rounded-lg border border-primary/15 bg-primary/5 p-5 text-base font-semibold leading-8 text-foreground/85"
      >
        <Quote className="mb-3 h-5 w-5 text-primary" />
        {body || heading}
      </blockquote>
    );
  }

  if (type === "list" && items.length > 0) {
    return (
      <section key={index}>
        {heading && (
          <h2 className="text-2xl font-extrabold leading-tight text-foreground">
            {heading}
          </h2>
        )}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-lg border border-primary/10 bg-primary/5 p-4 text-sm font-semibold leading-6 text-foreground/85"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section key={index}>
      {heading && (
        <h2 className="text-2xl font-extrabold leading-tight text-foreground">
          {heading}
        </h2>
      )}
      {body && (
        <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
          {body}
        </p>
      )}
      {items.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-lg border border-primary/10 bg-primary/5 p-4 text-sm font-semibold leading-6 text-foreground/85"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getBlogBySlug(slug);

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `/blogs/${post.slug}`,
        images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      },
    };
  } catch {
    return {
      title: "Blog Not Found",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post;

  try {
    post = await getBlogBySlug(slug);
  } catch (error) {
    if (isNotFoundError(error)) notFound();

    return (
      <div className="pt-24 pb-0 space-y-0">
        <PageHero
          eyebrow="Engineering Insights"
          title="Blogs are unavailable right now"
          description={
            error instanceof Error
              ? error.message
              : "Unable to fetch this blog. Please try again later."
          }
          backHref="/blogs"
          backLabel="Back to Blogs"
        />
        <ContactCTA />
      </div>
    );
  }

  if (!post) notFound();

  const date = formatBlogDate(post.publishedAt, "long") || "Recently";
  const iconImage = post.iconImageUrl;
  const contentBlocks = normalizeContent(post.content);

  return (
    <div className="pt-24 pb-0 space-y-0">
      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        backHref="/blogs"
        backLabel="Back to Blogs"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-muted-foreground sm:text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {date}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2">
            <Clock className="h-4 w-4 text-primary" />
            {post.readTime}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-4 py-2">
            <UserRound className="h-4 w-4 text-primary" />
            {post.author}
          </span>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20 lg:py-24 section-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <aside className="lg:col-span-4">
            <div className="sticky top-32 rounded-lg border border-border/80 bg-card/95 p-6 shadow-sm">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                {iconImage ? (
                  <Image
                    src={iconImage}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <DynamicIcon
                    name={post.iconName || "Newspaper"}
                    className="h-7 w-7"
                  />
                )}
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-foreground">
                Article Focus
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Practical engineering guidance for teams improving product quality, delivery flow, and long-term maintainability.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(post.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-foreground/75"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/blogs"
                className="mt-6 inline-flex items-center text-sm font-bold text-primary transition-colors hover:text-secondary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                All blogs
              </Link>
            </div>
          </aside>

          <article className="lg:col-span-8">
            {post.coverImageUrl && (
              <div className="mb-6 overflow-hidden rounded-lg border border-border/80 bg-white/85 shadow-sm">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 768px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className="rounded-lg border border-border/80 bg-white/85 p-6 shadow-sm sm:p-8 lg:p-10">
              {contentBlocks.length > 0 ? (
                <div className="space-y-10">
                  {contentBlocks.map(renderContentBlock)}
                </div>
              ) : (
                <p className="text-sm leading-8 text-muted-foreground sm:text-base">
                  {post.excerpt}
                </p>
              )}
            </div>
          </article>
        </div>
      </section>

      <ContactCTA />
    </div>
  );
}
