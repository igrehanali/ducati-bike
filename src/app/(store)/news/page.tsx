import type { Metadata } from "next"
import Link from "next/link"

import { ArticleGrid } from "@/components/news/article-card"
import { CategoryChips, type ChipOption } from "@/components/news/category-chips"
import { FeaturedArticle } from "@/components/news/featured-article"
import { NewsletterBand } from "@/components/news/newsletter-band"
import { isNewsCategory, NEWS_CATEGORIES, sortedArticles } from "@/components/news/news-utils"
import { SectionTitle } from "@/components/section-title"
import { PageHeader } from "@/components/site/page-header"

export const metadata: Metadata = {
  title: "News & stories",
  description: "New collections, World GP news, riding guides and workshop advice from the Vellora Moto UK journal.",
  alternates: { canonical: "/news" },
}

export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const { category: raw } = await searchParams
  const category = isNewsCategory(raw) ? raw : null

  const [featured, ...rest] = sortedArticles
  const list = category ? sortedArticles.filter((a) => a.category === category) : rest

  const options: ChipOption[] = [
    { label: "All", value: null, count: sortedArticles.length },
    ...NEWS_CATEGORIES.map((c) => ({ label: c, value: c, count: sortedArticles.filter((a) => a.category === c).length })),
  ]

  return (
    <>
      <PageHeader
        title="News & stories"
        description="New collections, race weekends, riding guides and advice from our workshop — the latest from Vellora Moto UK."
        crumbs={[{ label: "News" }]}
      />

      {category ? null : <FeaturedArticle article={featured} />}

      <section aria-labelledby="news-list-title" className={category ? "px-5" : "px-5 pt-20"}>
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
          <SectionTitle>
            <span id="news-list-title">{category ? category : "Latest stories"}</span>
          </SectionTitle>
          <CategoryChips options={options} active={category} />
        </div>

        {list.length ? (
          <ArticleGrid articles={list} eagerCount={category ? 3 : 0} />
        ) : (
          <div className="flex flex-col items-start gap-4 border-t border-rule py-12">
            <h3 className="text-xl leading-6 font-semibold tracking-[-0.4px]">No stories here yet</h3>
            <p className="text-sm leading-[17px] tracking-[-0.3px] text-subtle">Check back soon, or browse every story in the journal.</p>
            <Link
              href="/news"
              className="inline-flex h-[42px] items-center bg-black px-8 text-sm leading-[21px] font-medium text-white uppercase hover:bg-black/85"
            >
              View all stories
            </Link>
          </div>
        )}
      </section>

      <NewsletterBand />
    </>
  )
}
