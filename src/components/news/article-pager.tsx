import Link from "next/link"

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons"
import type { Article } from "@/lib/news"
import { cn } from "@/lib/utils"

function PagerLink({ article, direction }: { article: Article; direction: "prev" | "next" }) {
  const next = direction === "next"
  return (
    <Link
      href={`/news/${article.slug}`}
      rel={next ? "next" : "prev"}
      className={cn(
        "group flex flex-1 flex-col gap-3 border border-rule p-5 transition-colors hover:border-black md:p-6",
        next && "sm:items-end sm:text-right"
      )}
    >
      <span className="flex items-center gap-2 font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">
        {next ? null : <ArrowLeftIcon className="size-5" />}
        {next ? "Next story" : "Previous story"}
        {next ? <ArrowRightIcon className="size-5" /> : null}
      </span>
      <span className="font-inter text-lg leading-[22px] font-medium tracking-[-0.4px] group-hover:opacity-70">{article.title}</span>
      <time dateTime={article.isoDate} className="text-sm leading-[17px] tracking-[-0.3px] text-subtle">
        {article.date}
      </time>
    </Link>
  )
}

export function ArticlePager({ prev, next }: { prev?: Article; next?: Article }) {
  if (!prev && !next) return null
  return (
    <nav aria-label="More stories" className="px-5 pt-20">
      <div className="flex flex-col gap-2 sm:flex-row">
        {prev ? <PagerLink article={prev} direction="prev" /> : <div className="hidden flex-1 sm:block" />}
        {next ? <PagerLink article={next} direction="next" /> : <div className="hidden flex-1 sm:block" />}
      </div>
    </nav>
  )
}
