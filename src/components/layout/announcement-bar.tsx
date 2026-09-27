"use client"

import { useState } from "react"

import { AnnounceLeftIcon, AnnounceRightIcon } from "@/components/icons"
import { announcements } from "@/lib/site-content"

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const step = (delta: number) => setIndex((i) => (i + delta + announcements.length) % announcements.length)

  return (
    <div className="bg-brand px-5 py-2.5 text-white">
      <div className="mx-auto flex max-w-[400px] items-center justify-between gap-[23px]">
        <button type="button" aria-label="Previous announcement" onClick={() => step(-1)} className="p-1">
          <AnnounceLeftIcon className="h-3 w-1.5" />
        </button>
        <p aria-live="polite" className="truncate text-center text-xs leading-[18px] font-semibold uppercase">
          {announcements[index]}
        </p>
        <button type="button" aria-label="Next announcement" onClick={() => step(1)} className="p-1">
          <AnnounceRightIcon className="h-3 w-1.5" />
        </button>
      </div>
    </div>
  )
}
