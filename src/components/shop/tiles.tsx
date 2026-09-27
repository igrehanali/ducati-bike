import Image from "next/image"
import Link from "next/link"

import { ReadMoreArrowIcon } from "@/components/icons"
import { imageFit } from "@/components/product/product-card"
import { catalog, departments, type Category } from "@/lib/catalog"
import { cn } from "@/lib/utils"

const countIn = (slug: string) => catalog.filter((p) => p.category === slug).length

/** Image tile per sub-category, scrolling horizontally on small screens. */
export function CategoryTiles({ items, className }: { items: Category[]; className?: string }) {
  return (
    <nav aria-label="Categories" className={cn("px-5", className)}>
      <ul className="-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
        {items.map((category) => (
          <li key={category.slug} className="w-[40%] shrink-0 snap-start sm:w-[27%] lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink">
            <Link href={`/shop/${category.slug}`} className="group flex flex-col gap-3">
              <div className="relative aspect-square overflow-hidden bg-surface">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 27vw, 40vw"
                  className={cn(imageFit(category.image), "transition-transform duration-500 group-hover:scale-[1.03]")}
                />
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="truncate font-inter text-sm leading-[17px] font-medium tracking-[-0.3px] group-hover:underline md:text-base md:leading-5">
                  {category.name}
                </h3>
                <span className="font-mono text-xs text-subtle">{countIn(category.slug)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Four department tiles for the /shop landing. */
export function DepartmentTiles({ className }: { className?: string }) {
  return (
    <nav aria-label="Departments" className={cn("px-5", className)}>
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {departments.map((department, index) => (
          <li key={department.slug}>
            <Link
              href={department.slug === "ebikes" ? "/ebikes" : `/shop/${department.slug}`}
              className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden p-4 text-white md:aspect-[3/4] md:p-6"
            >
              <Image
                src={department.image}
                alt=""
                fill
                loading={index < 2 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <h2 className="font-inter text-lg leading-[22px] font-medium tracking-[-0.4px] md:text-2xl md:leading-[29px]">{department.name}</h2>
              <p className="mt-2 hidden max-w-[300px] text-sm leading-[17px] tracking-[-0.3px] text-white/85 md:block">{department.description}</p>
              <span className="mt-3 flex items-center gap-1 text-xs leading-[14px] font-medium uppercase transition-transform group-hover:translate-x-1 md:text-sm md:leading-[17px]">
                Shop now
                <ReadMoreArrowIcon className="size-5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
