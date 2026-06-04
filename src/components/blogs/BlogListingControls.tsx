"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { BlogSortBy, BlogSortOrder } from "@/lib/blogs";

type SortValue = `${BlogSortBy}:${BlogSortOrder}`;

type BlogListingControlsProps = {
  search: string;
  category: string;
  sortBy: BlogSortBy;
  sortOrder: BlogSortOrder;
  categories: string[];
};

const sortOptions: { label: string; value: SortValue }[] = [
  { label: "Latest", value: "publishedAt:DESC" },
  { label: "Oldest", value: "publishedAt:ASC" },
  { label: "Title A-Z", value: "title:ASC" },
  { label: "Title Z-A", value: "title:DESC" },
];

const SEARCH_DEBOUNCE_MS = 550;
const NAVIGATION_THROTTLE_MS = 700;

export default function BlogListingControls({
  search,
  category,
  sortBy,
  sortOrder,
  categories,
}: BlogListingControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(search);
  const lastNavigationAt = useRef(0);
  const throttledNavigationTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const navigateWithoutScroll = useCallback(
    (url: string) => {
      const runNavigation = () => {
        lastNavigationAt.current = Date.now();
        startTransition(() => {
          router.push(url, { scroll: false });
        });
      };
      const timeSinceLastNavigation = Date.now() - lastNavigationAt.current;

      if (throttledNavigationTimer.current) {
        clearTimeout(throttledNavigationTimer.current);
      }

      if (timeSinceLastNavigation >= NAVIGATION_THROTTLE_MS) {
        runNavigation();
        return;
      }

      throttledNavigationTimer.current = setTimeout(
        runNavigation,
        NAVIGATION_THROTTLE_MS - timeSinceLastNavigation
      );
    },
    [router, startTransition]
  );

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.delete("page");

      const query = params.toString();
      navigateWithoutScroll(query ? `${pathname}?${query}` : pathname);
    },
    [navigateWithoutScroll, pathname, searchParams]
  );

  useEffect(() => {
    const nextSearch = searchValue.trim();

    if (nextSearch === search) return;

    const timer = setTimeout(() => {
      updateParams({ search: nextSearch });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search, searchValue, updateParams]);

  useEffect(() => {
    return () => {
      if (throttledNavigationTimer.current) {
        clearTimeout(throttledNavigationTimer.current);
      }
    };
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ search: searchValue.trim() });
  };

  const handleSortChange = (value: SortValue) => {
    const [nextSortBy, nextSortOrder] = value.split(":") as [
      BlogSortBy,
      BlogSortOrder,
    ];

    updateParams({ sortBy: nextSortBy, sortOrder: nextSortOrder });
  };

  return (
    <div className="mb-8 rounded-lg border border-border/80 bg-card/95 p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_180px]">
        <form onSubmit={handleSearchSubmit} className="flex min-w-0 gap-2">
          <label htmlFor="blog-search" className="sr-only">
            Search blogs
          </label>
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="blog-search"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search blogs"
              className="h-12 w-full rounded-lg border border-border/80 bg-background pl-11 pr-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </form>

        <div className="relative">
          <label htmlFor="blog-category" className="sr-only">
            Filter by category
          </label>
          <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            id="blog-category"
            value={category}
            disabled={isPending}
            onChange={(event) => updateParams({ category: event.target.value })}
            className="h-12 w-full cursor-pointer rounded-lg border border-border/80 bg-background pl-11 pr-4 text-sm font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">All categories</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="blog-sort" className="sr-only">
            Sort blogs
          </label>
          <select
            id="blog-sort"
            value={`${sortBy}:${sortOrder}`}
            disabled={isPending}
            onChange={(event) => handleSortChange(event.target.value as SortValue)}
            className="h-12 w-full cursor-pointer rounded-lg border border-border/80 bg-background px-4 text-sm font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPending && (
        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-primary">
          Updating blogs...
        </p>
      )}
    </div>
  );
}
