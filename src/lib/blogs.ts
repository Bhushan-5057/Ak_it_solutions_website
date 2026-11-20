import { BlogPost } from "@/types";
import { loadData } from "@/utils/dataLoader";

export type BlogSortBy =
  | "id"
  | "title"
  | "slug"
  | "category"
  | "author"
  | "readTime"
  | "publishedAt"
  | "createdAt"
  | "updatedAt";

export type BlogSortOrder = "ASC" | "DESC";

export type BlogListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: BlogSortBy;
  sortOrder?: BlogSortOrder;
  category?: string;
  author?: string;
  publishedFrom?: string;
  publishedTo?: string;
  createdFrom?: string;
  createdTo?: string;
};

export type BlogListMeta = {
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  search?: string;
  filters?: {
    category?: string;
    author?: string;
    publishedFrom?: string;
    publishedTo?: string;
    createdFrom?: string;
    createdTo?: string;
  };
  sorting?: {
    sortBy: BlogSortBy;
    sortOrder: BlogSortOrder;
  };
};

function getStaticBlogs(): BlogPost[] {
  return loadData<BlogPost[]>("blogs.text");
}

function matchesSearch(post: BlogPost, search: string) {
  if (!search) return true;

  const query = search.toLowerCase();
  const haystack = [
    post.title,
    post.excerpt,
    post.category,
    post.author,
    ...(post.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function compareValues(left: string, right: string, sortOrder: BlogSortOrder) {
  const result = left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });

  return sortOrder === "ASC" ? result : -result;
}

function sortPosts(
  posts: BlogPost[],
  sortBy: BlogSortBy,
  sortOrder: BlogSortOrder
) {
  return [...posts].sort((first, second) => {
    const left = String(first[sortBy as keyof BlogPost] || "");
    const right = String(second[sortBy as keyof BlogPost] || "");

    return compareValues(left, right, sortOrder);
  });
}

export function getBlogCategories() {
  return Array.from(
    new Set(getStaticBlogs().map((post) => post.category).filter(Boolean))
  ).sort((first, second) => first.localeCompare(second));
}

export async function getBlogs(params: BlogListParams = {}) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 12;
  const search = params.search?.trim() || "";
  const category = params.category?.trim() || "";
  const author = params.author?.trim() || "";
  const sortBy = params.sortBy || "publishedAt";
  const sortOrder = params.sortOrder || "DESC";

  let posts = getStaticBlogs().filter((post) => {
    if (!matchesSearch(post, search)) return false;
    if (category && post.category !== category) return false;
    if (author && post.author !== author) return false;
    return true;
  });

  posts = sortPosts(posts, sortBy, sortOrder);

  const totalItems = posts.length;
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0;
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const start = (safePage - 1) * limit;
  const paginatedPosts = posts.slice(start, start + limit);

  return {
    posts: paginatedPosts,
    meta: {
      pagination: {
        page: safePage,
        limit,
        totalItems,
        totalPages,
      },
      search: search || undefined,
      filters: {
        category: category || undefined,
        author: author || undefined,
      },
      sorting: {
        sortBy,
        sortOrder,
      },
    } satisfies BlogListMeta,
  };
}

export async function getBlogBySlug(slug: string) {
  const post = getStaticBlogs().find((item) => item.slug === slug);

  if (!post) {
    throw new Error("NOT_FOUND");
  }

  return post;
}

export function isNotFoundError(error: unknown) {
  return error instanceof Error && error.message === "NOT_FOUND";
}
