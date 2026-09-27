"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Varied tile shapes give the grid a masonry rhythm.
const SHAPES = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[16/10]", "aspect-[4/5]"]

export function BikeGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null
  const count = images.length
  const go = (step: number) => setIndex((i) => (i === null ? i : (i + step + count) % count))

  return (
    <>
      <ul className="columns-2 gap-2 md:columns-3">
        {images.map((src, i) => (
          <li key={src} className="mb-2 break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo ${i + 1} of ${count}`}
              className={cn("group relative block w-full overflow-hidden bg-surface", SHAPES[i % SHAPES.length])}
            >
              <Image
                src={src}
                alt={`Vellora ${name} — photo ${i + 1}`}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={(next) => !next && setIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[100dvh] max-h-none w-screen max-w-none flex-col gap-0 rounded-none bg-black p-0 text-white ring-0 sm:max-w-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(1)
            if (event.key === "ArrowLeft") go(-1)
          }}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <DialogTitle className="font-mono text-xs leading-[14px] font-normal tracking-[-0.2px] uppercase">
              {name} — {index === null ? 0 : index + 1} / {count}
            </DialogTitle>
            <DialogDescription className="sr-only">Use the arrow keys to move between photos.</DialogDescription>
            <DialogClose aria-label="Close gallery" className="flex size-10 items-center justify-center hover:bg-white/10">
              <XIcon className="size-6" />
            </DialogClose>
          </div>
          <div className="relative min-h-0 flex-1">
            {index !== null ? (
              <Image key={images[index]} src={images[index]} alt={`Vellora ${name} — photo ${index + 1}`} fill sizes="100vw" className="object-contain animate-in fade-in duration-300" />
            ) : null}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute top-1/2 left-3 flex size-11 -translate-y-1/2 items-center justify-center bg-white text-black hover:bg-white/85 md:left-5"
            >
              <ChevronLeftIcon className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute top-1/2 right-3 flex size-11 -translate-y-1/2 items-center justify-center bg-white text-black hover:bg-white/85 md:right-5"
            >
              <ChevronRightIcon className="size-6" />
            </button>
          </div>
          <ul className="flex justify-center gap-2 overflow-x-auto px-5 py-4 [scrollbar-width:none]">
            {images.map((src, i) => (
              <li key={src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index}
                  className={cn("relative block h-12 w-16 overflow-hidden border-2 transition-opacity", i === index ? "border-white" : "border-transparent opacity-50 hover:opacity-100")}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  )
}
