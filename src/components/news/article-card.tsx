import Image from "next/image"
import Link from "next/link"

import { ReadMoreArrowIcon } from "@/components/icons"
import type { Article } from "@/lib/news"
import { cn } from "@/lib/utils"

/** Journal card — mirrors the home "Trending & latest news" card. */
export function ArticleCard({ article, eager = false }: { article: Article; eager?: boolean }) {
  const href = `/news/${article.slug}`
  return (
    <article className="group flex flex-col gap-6">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[344/467] overflow-hidden bg-surface">
        <Image
          src={article.image}
          alt=""
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 font-mono text-xs leading-[14px] font-medium tracking-[-0.2px] text-subtle">
            <time dateTime={article.isoDate}>{article.date}</time>
            <span aria-hidden="true">·</span>
            <span className="uppercase">{article.category}</span>
          </p>
          <div className="flex flex-col gap-2">
            <h3 className="truncate font-inter text-base leading-5 font-medium tracking-[-0.3px]">
              <Link href={href} className="hover:opacity-70">
                {article.title}
              </Link>
            </h3>
            <p className="line-clamp-2 text-sm leading-[17px] tracking-[-0.3px] text-subtle">{article.excerpt}</p>
          </div>
        </div>
        <Link
          href={href}
          className="flex w-fit items-center gap-2 text-base leading-5 tracking-[-0.3px] hover:opacity-70"
        >
          Read More<span className="sr-only">: {article.title}</span>
          <ReadMoreArrowIcon className="size-5" />
        </Link>
      </div>
    </article>
  )
}

export function ArticleGrid({ articles, className, eagerCount = 0 }: { articles: Article[]; className?: string; eagerCount?: number }) {
  return (
    <ul className={cn("grid grid-cols-1 gap-x-2 gap-y-12 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {articles.map((article, index) => (
        <li key={article.slug}>
          <ArticleCard article={article} eager={index < eagerCount} />
        </li>
      ))}
    </ul>
  )
}
