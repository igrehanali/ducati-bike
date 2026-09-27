import Image from "next/image"

import { SocialInstagramIcon } from "@/components/icons"
import { SectionTitle } from "@/components/section-title"
import { cn } from "@/lib/utils"

type GalleryImage = { image: string; alt: string }

type RiderGalleryProps = {
  images: GalleryImage[]
  title?: string
  /** "grid" is the full home layout; "strip" is a single row. */
  layout?: "grid" | "strip"
  className?: string
}

export function RiderGallery({ images, title = "#VelloraMotoUK", layout = "grid", className }: RiderGalleryProps) {
  return (
    <section className={cn("px-5 pt-20", className)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <SectionTitle>{title}</SectionTitle>
            <p className="text-sm leading-[17px] tracking-[-0.3px] text-subtle">
              Tag <span className="font-semibold text-black">@velloramotouk</span> to be featured by our riding community.
            </p>
          </div>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-base leading-[19px] font-semibold tracking-[-0.3px] hover:opacity-70">
            <SocialInstagramIcon className="h-[21px] w-5 text-black" />
            Follow us
          </a>
        </div>
        <ul className={cn("grid gap-2", layout === "grid" ? "grid-cols-3 md:grid-cols-4 lg:grid-cols-6" : "grid-cols-3 md:grid-cols-6")}>
          {images.map((item, index) => (
            <li
              key={item.image}
              className={cn(
                "group relative aspect-square overflow-hidden bg-surface",
                layout === "grid" && index === 0 && "col-span-2 row-span-2",
                layout === "grid" && index === 7 && "lg:col-span-2 lg:row-span-2"
              )}
            >
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label={`View post: ${item.alt} (opens Instagram)`} className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes={layout === "grid" && (index === 0 || index === 7) ? "(min-width: 1024px) 33vw, 66vw" : "(min-width: 1024px) 17vw, 33vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                  <SocialInstagramIcon className="size-8" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
