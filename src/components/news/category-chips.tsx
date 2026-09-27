import Link from "next/link"

import { cn } from "@/lib/utils"

export type ChipOption = { label: string; value: string | null; count: number }

/** Server-rendered filter chips; each chip is a link that sets `?category=`. */
export function CategoryChips({ options, active }: { options: ChipOption[]; active: string | null }) {
  return (
    <nav aria-label="Filter stories by category">
      <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {options.map((option) => {
          const isActive = option.value === active
          const href = option.value ? `/news?category=${encodeURIComponent(option.value)}` : "/news"
          return (
            <li key={option.label} className="shrink-0">
              <Link
                href={href}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-2 border px-4 text-sm leading-[17px] font-medium tracking-[-0.3px] uppercase transition-colors",
                  isActive ? "border-black bg-black text-white" : "border-rule bg-white text-black hover:border-black"
                )}
              >
                {option.label}
                <span className={cn("font-mono text-xs", isActive ? "text-white/70" : "text-subtle")}>{option.count}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
