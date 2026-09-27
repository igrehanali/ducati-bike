import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ArticleGrid } from "@/components/news/article-card"
import { ArticlePager } from "@/components/news/article-pager"
import { NewsletterBand } from "@/components/news/newsletter-band"
import { headingId, shopTheStory, SITE_URL, sortedArticles } from "@/components/news/news-utils"
import { ShareRow } from "@/components/news/share-row"
import { SectionTitle } from "@/components/section-title"
import { ProductRowSection } from "@/components/product-sections"
import { PageHeader } from "@/components/site/page-header"
import { articles, getArticle, type Article } from "@/lib/news"

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: "Story not found" }
  const url = `/news/${article.slug}`
  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.isoDate,
      authors: [article.author],
      section: article.category,
      images: [{ url: article.image, alt: article.title }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images: [article.image] },
  }
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const url = `${SITE_URL}/news/${article.slug}`
  const index = sortedArticles.findIndex((a) => a.slug === article.slug)
  const prev = sortedArticles[index - 1]
  const next = sortedArticles[index + 1]

  const related = article.related
    .map((s) => getArticle(s))
    .filter((a): a is Article => Boolean(a))
  // Top up to three with the newest stories from the same category.
  for (const candidate of sortedArticles) {
    if (related.length >= 3) break
    if (candidate.slug !== article.slug && candidate.category === article.category && !related.some((r) => r.slug === candidate.slug)) {
      related.push(candidate)
    }
  }

  const products = shopTheStory(article)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [`${SITE_URL}${article.image}`],
    datePublished: article.isoDate,
    dateModified: article.isoDate,
    articleSection: article.category,
    // Bylines like "Racing Desk" or "Service Department" are teams, not people.
    author: { "@type": /vellora|desk|team|department/i.test(article.author) ? "Organization" : "Person", name: article.author },
    publisher: { "@type": "Organization", name: "Vellora Moto UK", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <PageHeader
        title={article.title}
        image={article.image}
        eyebrow={article.category}
        crumbs={[{ label: "News", href: "/news" }, { label: article.title }]}
        className="md:min-h-[620px]"
      >
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 font-mono text-xs leading-[14px] tracking-[-0.2px] text-white/85">
          <time dateTime={article.isoDate}>{article.date}</time>
          <span aria-hidden="true">·</span>
          <span>By {article.author}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readMinutes} min read</span>
        </p>
      </PageHeader>

      <article className="px-5 pt-12 md:pt-16">
        <div className="mx-auto flex max-w-[720px] flex-col gap-10">
          <p className="font-inter text-xl leading-[30px] font-medium tracking-[-0.4px] md:text-[22px] md:leading-8">{article.excerpt}</p>

          <div className="flex flex-col gap-6 text-base leading-7 tracking-[-0.2px] text-black/85">
            {article.body.map((block, i) => (
              <section key={i} className="flex flex-col gap-4">
                {block.heading ? (
                  <h2
                    id={headingId(block.heading)}
                    className="group scroll-mt-24 pt-4 text-2xl leading-[29px] font-semibold tracking-[-0.5px] text-black"
                  >
                    <a href={`#${headingId(block.heading)}`} className="hover:underline">
                      {block.heading}
                    </a>
                  </h2>
                ) : null}
                <p>{block.text}</p>
              </section>
            ))}
          </div>

          <div className="flex flex-col gap-6 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
            <ShareRow url={url} title={article.title} />
            <Link href={`/news?category=${article.category}`} className="text-sm leading-[17px] font-medium tracking-[-0.3px] underline-offset-4 hover:underline">
              More {article.category} stories
            </Link>
          </div>
        </div>
      </article>

      {products.length ? <ProductRowSection title="Shop the story" products={products} /> : null}

      {related.length ? (
        <section aria-labelledby="related-title" className="px-5 pt-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <SectionTitle>
                <span id="related-title">Related articles</span>
              </SectionTitle>
              <Link href="/news" className="hidden text-base leading-[19px] font-semibold tracking-[-0.3px] hover:opacity-70 sm:block">
                View all news
              </Link>
            </div>
            <ArticleGrid articles={related.slice(0, 3)} />
          </div>
        </section>
      ) : null}

      <ArticlePager prev={prev} next={next} />

      <NewsletterBand />
    </>
  )
}
