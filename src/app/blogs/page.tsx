import { Metadata } from "next";
import { BlogPost } from "@/types";
import PageHero from "@/components/common/PageHero";
import SectionHeading from "@/components/common/SectionHeading";
import BlogCard from "@/components/blogs/BlogCard";
import BlogListingControls from "@/components/blogs/BlogListingControls";
import BlogPagination from "@/components/blogs/BlogPagination";
import ContactCTA from "@/components/common/ContactCTA";
import {
  BlogListMeta,
  BlogSortBy,
  BlogSortOrder,
  getBlogCategories,
  getBlogs,
} from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Software engineering insights from AK IT Solution covering websites, mobile apps, SaaS platforms, cloud architecture, and product delivery.",
};

type BlogsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 12;
const allowedSortBy: BlogSortBy[] = [
  "id",
  "title",
  "slug",
  "category",
  "author",
  "readTime",
  "publishedAt",
  "createdAt",
  "updatedAt",
];

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key];

  return Array.isArray(value) ? value[0] || "" : value || "";
}

function getPositiveNumber(value: string, fallback: number) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getSortBy(value: string): BlogSortBy {
  return allowedSortBy.includes(value as BlogSortBy)
    ? (value as BlogSortBy)
    : "publishedAt";
}

function getSortOrder(value: string): BlogSortOrder {
  return value === "ASC" ? "ASC" : "DESC";
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const resolvedSearchParams = (await searchParams) || {};
  const page = getPositiveNumber(getParam(resolvedSearchParams, "page"), 1);
  const search = getParam(resolvedSearchParams, "search").trim();
  const category = getParam(resolvedSearchParams, "category").trim();
  const sortBy = getSortBy(getParam(resolvedSearchParams, "sortBy"));
  const sortOrder = getSortOrder(getParam(resolvedSearchParams, "sortOrder"));
  let posts: BlogPost[] = [];
  let meta: BlogListMeta = {
    pagination: {
      page,
      limit: PAGE_SIZE,
      totalItems: 0,
      totalPages: 0,
    },
    sorting: {
      sortBy,
      sortOrder,
    },
  };
  let errorMessage = "";

  try {
    const result = await getBlogs({
      page,
      limit: PAGE_SIZE,
      search,
      category,
      sortBy,
      sortOrder,
    });
    posts = result.posts;
    meta = result.meta;
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to fetch blogs. Please try again later.";
  }

  const categories = getBlogCategories();
  const hasActiveFilters = Boolean(search || category);

  return (
    <div className="pt-24 pb-0 space-y-0">
      <PageHero
        eyebrow="Engineering Insights"
        title="Software Development Blogs"
        description="Practical guidance for business leaders and technology teams who want cleaner architecture, smoother launches, and better digital products."
      />

      <section className="py-16 sm:py-20 lg:py-24 section-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Latest Articles"
            title="Clear Thinking for Digital Growth"
            align="center"
          />

          <BlogListingControls
            search={search}
            category={category}
            sortBy={sortBy}
            sortOrder={sortOrder}
            categories={categories}
          />

          {errorMessage ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
              <h3 className="text-lg font-extrabold text-foreground">
                Blogs are unavailable right now
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {errorMessage}
              </p>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {posts.map((post, index) => (
                  <BlogCard key={post.id || post.slug} post={post} index={index} />
                ))}
              </div>
              <BlogPagination
                page={meta.pagination.page}
                limit={meta.pagination.limit}
                totalItems={meta.pagination.totalItems}
                totalPages={meta.pagination.totalPages}
              />
            </>
          ) : (
            <div className="rounded-lg border border-border/80 bg-card/95 p-8 text-center shadow-sm">
              <h3 className="text-lg font-extrabold text-foreground">
                {hasActiveFilters ? "No matching blogs found" : "No blogs published yet"}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {hasActiveFilters
                  ? "Try a different search term or category to find more engineering insights."
                  : "Fresh engineering insights will appear here as soon as they are published."}
              </p>
            </div>
          )}
        </div>
      </section>

      <ContactCTA />
    </div>
  );
}
