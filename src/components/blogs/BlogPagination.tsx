"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BlogPaginationProps = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

function getVisiblePages(page: number, totalPages: number) {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from(
    { length: end - adjustedStart + 1 },
    (_, index) => adjustedStart + index
  );
}

export default function BlogPagination({
  page,
  limit,
  totalItems,
  totalPages,
}: BlogPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, totalItems);
  const visiblePages = getVisiblePages(page, totalPages);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const buttonClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-border/80 bg-card px-3 text-sm font-extrabold text-foreground transition-all hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50";

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-10 flex flex-col items-center justify-between gap-4 rounded-lg border border-border/80 bg-card/95 p-4 shadow-sm sm:flex-row"
    >
      <p className="text-sm font-semibold text-muted-foreground">
        Showing {firstItem}-{lastItem} of {totalItems} blogs
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          className={buttonClass}
          disabled={page <= 1 || isPending}
          onClick={() => goToPage(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`${buttonClass} ${
              pageNumber === page
                ? "border-primary bg-primary text-white hover:text-white"
                : ""
            }`}
            disabled={pageNumber === page || isPending}
            onClick={() => goToPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          className={buttonClass}
          disabled={page >= totalPages || isPending}
          onClick={() => goToPage(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
