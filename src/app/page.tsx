import { BrandBanner } from "@/components/home/brand-banner"
import { CollectionsSection } from "@/components/home/collections-section"
import { CommunityStories } from "@/components/home/community-stories"
import { Hero } from "@/components/home/hero"
import { LatestNews } from "@/components/home/latest-news"
import { PromoTiles } from "@/components/home/promo-tiles"
import { RangeSection } from "@/components/home/range-section"
import { RiderGallery } from "@/components/home/rider-gallery"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { SiteFooter } from "@/components/layout/site-footer"
import { ProductCarouselSection } from "@/components/product-sections"
import { lifestyleApparel, motorcycleAccessories, newArrivals, riderGallery, news } from "@/lib/data"

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <main className="flex-1 pb-20">
        <Hero />
        <ProductCarouselSection id="new-collection" title="New 2026 collection" tabs={newArrivals} layout="inline" viewAllHref="/shop/new-2026" />
        <CollectionsSection />
        <RangeSection />
        <BrandBanner />
        <ProductCarouselSection id="lifestyle" title="Lifestyle Apparel" tabs={lifestyleApparel} viewAllHref="/shop/casual-wear" />
        <CommunityStories />
        <ProductCarouselSection id="accessories" title="Motorcycle Accessories" tabs={motorcycleAccessories} viewAllHref="/shop/accessories" />
        <PromoTiles />
        <LatestNews news={news} />
        <RiderGallery images={riderGallery.slice(0, 12)} />
      </main>
      <SiteFooter />
    </>
  )
}
