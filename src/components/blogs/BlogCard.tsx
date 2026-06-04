"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { BlogPost } from "@/types";
import { DynamicIcon } from "@/components/common/Cards";
import { formatBlogDate } from "@/lib/blog-utils";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  compact?: boolean;
}

export default function BlogCard({ post, index = 0, compact = false }: BlogCardProps) {
  const date = formatBlogDate(post.publishedAt);
  const iconImage = post.iconImageUrl || post.coverImageUrl;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group flex h-full flex-col rounded-lg border border-border/80 bg-card/95 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden text-primary transition-colors group-hover:text-white">
          {iconImage ? (
            <Image
              src={iconImage}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <DynamicIcon name={post.iconName} className="h-6 w-6" />
          )}
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-secondary">
          {post.category}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
          {date || "Recently"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          {post.readTime}
        </span>
      </div>

      <h3 className={`${compact ? "mt-4 text-lg" : "mt-5 text-xl"} font-extrabold leading-tight text-foreground transition-colors group-hover:text-primary`}>
        {post.title}
      </h3>
      <p className="mt-3 flex-grow text-sm leading-7 text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(post.tags || []).slice(0, compact ? 2 : 3).map((tag) => (
          <span key={tag} className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-foreground/75">
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/blogs/${post.slug}`}
        className="mt-6 inline-flex items-center text-sm font-bold text-primary transition-colors hover:text-secondary"
      >
        Read insight
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.article>
  );
}
