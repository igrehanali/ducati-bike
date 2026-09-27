import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-[26px] leading-[32px] font-semibold tracking-[-0.6px] md:text-[32px] md:leading-[38px]", className)}>
      {children}
    </h2>
  )
}
