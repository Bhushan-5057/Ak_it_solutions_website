import { BlogPost } from "@/types";

type ApiResponse<T, M = unknown> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: M;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

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

const DEFAULT_BLOG_META: BlogListMeta = {
  pagination: {
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  },
  sorting: {
    sortBy: "publishedAt",
    sortOrder: "DESC",
  },
};

function buildQuery(params: BlogListParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("NOT_FOUND");
  }

  let payload: ApiResponse<T> | undefined;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error("Unable to read blog response.");
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Unable to fetch blogs.");
  }

  return payload.data;
}

async function requestWithMeta<T, M>(path: string): Promise<{ data: T; meta?: M }> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  let payload: ApiResponse<T, M> | undefined;

  try {
    payload = (await response.json()) as ApiResponse<T, M>;
  } catch {
    throw new Error("Unable to read blog response.");
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Unable to fetch blogs.");
  }

  return {
    data: payload.data,
    meta: payload.meta,
  };
}

export async function getBlogs(params: BlogListParams = {}) {
  const result = await requestWithMeta<BlogPost[], BlogListMeta>(
    `/api/blogs${buildQuery(params)}`
  );

  return {
    posts: result.data,
    meta: result.meta || {
      ...DEFAULT_BLOG_META,
      pagination: {
        ...DEFAULT_BLOG_META.pagination,
        page: params.page || DEFAULT_BLOG_META.pagination.page,
        limit: params.limit || DEFAULT_BLOG_META.pagination.limit,
        totalItems: result.data.length,
        totalPages: result.data.length > 0 ? 1 : 0,
      },
    },
  };
}

export function getBlogBySlug(slug: string) {
  return request<BlogPost>(`/api/blogs/slug/${encodeURIComponent(slug)}`);
}

export function isNotFoundError(error: unknown) {
  return error instanceof Error && error.message === "NOT_FOUND";
}
