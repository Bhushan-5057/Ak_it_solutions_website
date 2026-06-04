import PageHero from "@/components/common/PageHero";
import SectionHeading from "@/components/common/SectionHeading";

export default function BlogsLoading() {
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

          <div className="mb-8 h-20 animate-pulse rounded-lg border border-border/80 bg-card/80" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-lg border border-border/80 bg-card/80 shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
