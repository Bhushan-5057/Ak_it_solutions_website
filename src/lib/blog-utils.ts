export function formatBlogDate(
  value?: string,
  style: "short" | "long" = "short"
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
