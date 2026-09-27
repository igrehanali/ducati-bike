import Image from "next/image"
import Link from "next/link"

import type { Article } from "@/lib/news"

export function FeaturedArticle({ article }: { article: Article }) {
  const href = `/news/${article.slug}`
  return (
    <section aria-labelledby="featured-article-title" className="px-5">
      <article className="group grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:gap-16">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/3] overflow-hidden bg-surface md:aspect-auto md:min-h-[520px]">
          <Image
            src={article.image}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute top-4 left-4 bg-brand-dark px-2.5 py-1 font-mono text-[11px] leading-[14px] font-medium tracking-[-0.2px] text-white uppercase">
            Featured
          </span>
        </Link>
        <div className="flex flex-col justify-center gap-6 md:py-10">
          <p className="flex flex-wrap items-center gap-2 font-mono text-xs leading-[14px] font-medium tracking-[-0.2px] text-subtle uppercase">
            <span className="bg-chip px-2 py-1 text-black">{article.category}</span>
            <time dateTime={article.isoDate}>{article.date}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readMinutes} min read</span>
          </p>
          <div className="flex flex-col gap-4">
            <h2
              id="featured-article-title"
              className="font-inter text-[28px] leading-[34px] font-medium tracking-[-0.8px] md:text-[40px] md:leading-[48px]"
            >
              <Link href={href} className="hover:opacity-80">
                {article.title}
              </Link>
            </h2>
            <p className="max-w-[520px] text-base leading-6 tracking-[-0.3px] text-subtle">{article.excerpt}</p>
            <p className="text-sm leading-[17px] tracking-[-0.3px]">By {article.author}</p>
          </div>
          <Link
            href={href}
            className="inline-flex h-[42px] w-fit items-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
          >
            Read article
          </Link>
        </div>
      </article>
    </section>
  )
}
